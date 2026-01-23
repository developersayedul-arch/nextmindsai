import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    console.log('Starting automatic payment verification...');

    // Get pending DodoPayment payments (created in last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: pendingPayments, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'pending')
      .eq('payment_method', 'DodoPayment')
      .gte('created_at', twentyFourHoursAgo);

    if (fetchError) {
      console.error('Error fetching pending payments:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${pendingPayments?.length || 0} pending DodoPayment transactions`);

    const results = {
      checked: 0,
      verified: 0,
      failed: 0,
      unchanged: 0,
      errors: [] as string[]
    };

    if (!pendingPayments || pendingPayments.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No pending payments to verify',
          results 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check each pending payment
    for (const payment of pendingPayments) {
      results.checked++;
      
      try {
        // Extract session ID from transaction_id or notes
        const sessionId = payment.transaction_id.startsWith('dodo_') 
          ? null 
          : payment.transaction_id;
        
        // Also try to extract from notes if available
        const notesMatch = payment.notes?.match(/Checkout session: ([a-zA-Z0-9_-]+)/);
        const checkoutSessionId = sessionId || notesMatch?.[1];

        if (!checkoutSessionId) {
          console.log(`Payment ${payment.id}: No valid session ID found, skipping`);
          results.unchanged++;
          continue;
        }

        console.log(`Checking payment ${payment.id} with session ${checkoutSessionId}`);

        // Query DodoPayment API for session status
        const dodoResponse = await fetch(
          `https://dodopayments.com/checkouts/${checkoutSessionId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${DODO_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!dodoResponse.ok) {
          const errorText = await dodoResponse.text();
          console.error(`DodoPayment API error for ${checkoutSessionId}:`, errorText);
          results.errors.push(`Payment ${payment.id}: API error - ${dodoResponse.status}`);
          continue;
        }

        const sessionData = await dodoResponse.json();
        console.log(`Session ${checkoutSessionId} status:`, sessionData.status);

        // Check payment status
        const status = sessionData.status?.toLowerCase() || sessionData.payment_status?.toLowerCase();

        if (status === 'completed' || status === 'paid' || status === 'succeeded') {
          // Payment verified - update payment record
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'verified',
              verified_at: new Date().toISOString(),
              notes: `Auto-verified via DodoPayment API. Session: ${checkoutSessionId}`
            })
            .eq('id', payment.id);

          if (updateError) {
            console.error(`Error updating payment ${payment.id}:`, updateError);
            results.errors.push(`Payment ${payment.id}: Update failed`);
            continue;
          }

          // Activate subscription
          const { error: subError } = await supabase
            .from('subscriptions')
            .update({ is_active: true })
            .eq('payment_id', payment.id);

          if (subError) {
            console.error(`Error activating subscription for payment ${payment.id}:`, subError);
          }

          // Also try to activate by user_id if payment_id didn't match
          if (!subError) {
            await supabase
              .from('subscriptions')
              .update({ is_active: true })
              .eq('user_id', payment.user_id)
              .eq('is_active', false);
          }

          console.log(`Payment ${payment.id} verified and subscription activated`);
          results.verified++;

        } else if (status === 'failed' || status === 'cancelled' || status === 'expired') {
          // Payment failed
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'failed',
              notes: `Auto-marked as failed. DodoPayment status: ${status}`
            })
            .eq('id', payment.id);

          if (updateError) {
            console.error(`Error updating failed payment ${payment.id}:`, updateError);
          }

          console.log(`Payment ${payment.id} marked as failed`);
          results.failed++;

        } else {
          // Still pending or unknown status
          console.log(`Payment ${payment.id} still pending (status: ${status})`);
          results.unchanged++;
        }

      } catch (paymentError: unknown) {
        const errorMessage = paymentError instanceof Error ? paymentError.message : 'Unknown error';
        console.error(`Error processing payment ${payment.id}:`, errorMessage);
        results.errors.push(`Payment ${payment.id}: ${errorMessage}`);
      }
    }

    console.log('Verification complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Verified ${results.verified} payments, ${results.failed} failed, ${results.unchanged} unchanged`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Verification failed';
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
