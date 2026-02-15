import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const SAPAY_SECRET_KEY = Deno.env.get('SAPAY_SECRET_KEY');
    if (!SAPAY_SECRET_KEY) {
      throw new Error('SA Pay secret key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const bodyText = await req.text();
    const receivedSignature = req.headers.get('X-SIGNATURE') || '';

    // Verify webhook signature
    const expectedSignature = await hmacSha256(SAPAY_SECRET_KEY, bodyText);
    if (receivedSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401
      });
    }

    const payload = JSON.parse(bodyText);
    console.log('SA Pay webhook received:', payload);

    const { invoice_id, status, order_id, transaction_id, metadata } = payload;

    if (status === 'completed' || status === 'success') {
      // Update payment record
      const { data: payment, error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          transaction_id: transaction_id || invoice_id,
          notes: `SA Pay verified. Invoice: ${invoice_id}`
        })
        .eq('transaction_id', invoice_id)
        .select()
        .single();

      if (updateError) {
        // Try matching by order_id in notes
        const { error: retryError } = await supabase
          .from('payments')
          .update({
            status: 'verified',
            verified_at: new Date().toISOString(),
            transaction_id: transaction_id || invoice_id,
          })
          .ilike('notes', `%${order_id}%`);

        if (retryError) {
          console.error('Payment update error:', retryError);
        }
      }

      // Activate subscription if applicable
      if (metadata?.user_id && metadata?.plan_type) {
        const planType = metadata.plan_type;

        if (!planType.startsWith('mentorship_')) {
          const expiresAt = new Date();
          if (planType === 'unlimited') {
            expiresAt.setDate(expiresAt.getDate() + 30);
          } else {
            expiresAt.setDate(expiresAt.getDate() + 7);
          }

          await supabase.from('subscriptions').insert({
            user_id: metadata.user_id,
            plan_type: planType,
            expires_at: expiresAt.toISOString(),
            is_active: true,
            payment_id: payment?.id || null
          });
        }

        // Update mentorship session if applicable
        if (metadata.session_id) {
          await supabase
            .from('mentorship_sessions')
            .update({ payment_status: 'paid' })
            .eq('id', metadata.session_id);
        }
      }

      console.log('Payment verified successfully');
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
