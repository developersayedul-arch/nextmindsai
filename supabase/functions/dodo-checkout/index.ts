import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  productId: string;
  quantity: number;
  customerEmail: string;
  customerName: string;
  amount: number;
  planType: string;
  analysisId?: string;
  returnUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DODO_API_KEY = Deno.env.get('DODO_PAYMENTS_API_KEY');
    if (!DODO_API_KEY) {
      console.error('DODO_PAYMENTS_API_KEY not configured');
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
    console.log('Checkout request:', { ...body, customerEmail: '***' });

    const { 
      productId, 
      quantity, 
      customerEmail, 
      customerName, 
      amount, 
      planType, 
      analysisId,
      returnUrl 
    } = body;

    // Create DodoPayment checkout session
    const dodoResponse = await fetch('https://dodopayments.com/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DODO_API_KEY}`,
      },
      body: JSON.stringify({
        product_cart: [{
          product_id: productId,
          quantity: quantity || 1
        }],
        customer: {
          email: customerEmail,
          name: customerName
        },
        return_url: returnUrl,
        metadata: {
          user_id: user.id,
          plan_type: planType,
          analysis_id: analysisId || '',
          amount: amount.toString()
        }
      }),
    });

    if (!dodoResponse.ok) {
      const errorText = await dodoResponse.text();
      console.error('DodoPayment API error:', errorText);
      throw new Error('Failed to create checkout session');
    }

    const session = await dodoResponse.json();
    console.log('Checkout session created:', session.id);

    // Create pending payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        analysis_id: analysisId || null,
        transaction_id: session.id || `dodo_${Date.now()}`,
        amount: amount,
        payment_method: 'DodoPayment',
        sender_number: customerEmail,
        status: 'pending',
        notes: `Checkout session: ${session.id}`
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      // Continue anyway - don't block the checkout
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: session.checkout_url || session.url,
        sessionId: session.id,
        paymentId: payment?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: unknown) {
    console.error('Checkout error:', error);
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
