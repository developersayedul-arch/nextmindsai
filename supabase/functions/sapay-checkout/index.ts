import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  amount: number;
  currency?: string;
  provider?: string;
  customerEmail: string;
  customerName: string;
  planType: string;
  analysisId?: string;
  sessionId?: string;
  returnUrl: string;
}

async function generateSignature(payload: Record<string, unknown>, secretKey: string): Promise<string> {
  return await hmacSha256(secretKey, JSON.stringify(payload));
}

async function hmacSha256(secretKey: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SAPAY_API_KEY = Deno.env.get('SAPAY_API_KEY');
    const SAPAY_SECRET_KEY = Deno.env.get('SAPAY_SECRET_KEY');

    if (!SAPAY_API_KEY || !SAPAY_SECRET_KEY) {
      console.error('SA Pay Core keys not configured');
      throw new Error('Payment gateway not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Invalid authentication');
    }

    const body: CheckoutRequest = await req.json();
    console.log('SA Pay checkout request:', { ...body, customerEmail: '***' });

    const {
      amount,
      currency = 'BDT',
      provider,
      customerEmail,
      customerName,
      planType,
      analysisId,
      sessionId,
      returnUrl
    } = body;

    const orderId = `order_${Date.now()}_${user.id.slice(0, 8)}`;

    // Build SA Pay Core payment payload
    const paymentPayload = {
      order_id: orderId,
      amount,
      currency,
      provider: provider || 'bkash', // default provider
      metadata: {
        user_id: user.id,
        plan_type: planType,
        analysis_id: analysisId || '',
        session_id: sessionId || '',
        customer_email: customerEmail,
        customer_name: customerName,
        return_url: returnUrl,
      }
    };

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = await hmacSha256(SAPAY_SECRET_KEY, JSON.stringify(paymentPayload));

    const sapayResponse = await fetch('https://api.sapaycore.com/api/v1/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': SAPAY_API_KEY,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
      },
      body: JSON.stringify(paymentPayload),
    });

    if (!sapayResponse.ok) {
      const errorText = await sapayResponse.text();
      console.error('SA Pay API error:', errorText);
      throw new Error('Failed to create payment session');
    }

    const session = await sapayResponse.json();
    console.log('SA Pay session created:', session);

    // Create pending payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        analysis_id: analysisId || null,
        transaction_id: session.invoice_id || orderId,
        amount: amount,
        payment_method: 'SA Pay',
        sender_number: customerEmail,
        status: 'pending',
        notes: `SA Pay order: ${orderId}, plan: ${planType}`
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record error:', paymentError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: session.payment_url || session.checkout_url || session.url,
        invoiceId: session.invoice_id,
        orderId: orderId,
        paymentId: payment?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: unknown) {
    console.error('SA Pay checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Checkout failed';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
