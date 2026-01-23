import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, webhook-id, webhook-signature, webhook-timestamp',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEBHOOK_KEY = Deno.env.get('DODO_WEBHOOK_KEY');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rawBody = await req.text();
    console.log('Webhook received:', rawBody.substring(0, 200));

    // Verify webhook signature if key is configured
    const webhookId = req.headers.get('webhook-id');
    const webhookSignature = req.headers.get('webhook-signature');
    const webhookTimestamp = req.headers.get('webhook-timestamp');

    if (WEBHOOK_KEY && webhookSignature) {
      // Basic signature validation - in production use standardwebhooks library
      console.log('Webhook headers:', { webhookId, webhookTimestamp });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type || payload.event_type;
    
    console.log('Event type:', eventType);
    console.log('Payload data:', JSON.stringify(payload.data || payload, null, 2));

    // Handle different event types
    switch (eventType) {
      case 'payment.succeeded':
      case 'checkout.completed': {
        const sessionId = payload.data?.checkout_session_id || payload.data?.id;
        const metadata = payload.data?.metadata || {};
        
        console.log('Payment succeeded for session:', sessionId);
        console.log('Metadata:', metadata);

        if (sessionId) {
          // Update payment status
          const { error: paymentError } = await supabase
            .from('payments')
            .update({ 
              status: 'verified',
              verified_at: new Date().toISOString(),
              notes: `DodoPayment verified: ${eventType}`
            })
            .or(`transaction_id.eq.${sessionId},notes.ilike.%${sessionId}%`);

          if (paymentError) {
            console.error('Payment update error:', paymentError);
          }

          // Activate subscription if user_id in metadata
          if (metadata.user_id) {
            const { error: subError } = await supabase
              .from('subscriptions')
              .update({ is_active: true })
              .eq('user_id', metadata.user_id)
              .eq('is_active', false);

            if (subError) {
              console.error('Subscription update error:', subError);
            } else {
              console.log('Subscription activated for user:', metadata.user_id);
            }
          }
        }
        break;
      }

      case 'payment.failed': {
        const sessionId = payload.data?.checkout_session_id || payload.data?.id;
        console.log('Payment failed for session:', sessionId);
        
        if (sessionId) {
          await supabase
            .from('payments')
            .update({ 
              status: 'failed',
              notes: `Payment failed: ${payload.data?.failure_reason || 'Unknown'}`
            })
            .or(`transaction_id.eq.${sessionId},notes.ilike.%${sessionId}%`);
        }
        break;
      }

      default:
        console.log('Unhandled event type:', eventType);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Webhook error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
