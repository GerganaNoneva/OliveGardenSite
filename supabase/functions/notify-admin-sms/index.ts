import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingNotification {
  studioName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  customerName: string;
  contactMethod: string;
  contactValue: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('SMS notification function called');
    
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    const adminPhoneNumber = Deno.env.get("ADMIN_PHONE_NUMBER");

    console.log('Environment check:', {
      hasSid: !!twilioAccountSid,
      hasToken: !!twilioAuthToken,
      hasFromNumber: !!twilioPhoneNumber,
      hasToNumber: !!adminPhoneNumber,
      toNumber: adminPhoneNumber,
      fromNumber: twilioPhoneNumber
    });

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber || !adminPhoneNumber) {
      const missingVars = [];
      if (!twilioAccountSid) missingVars.push('TWILIO_ACCOUNT_SID');
      if (!twilioAuthToken) missingVars.push('TWILIO_AUTH_TOKEN');
      if (!twilioPhoneNumber) missingVars.push('TWILIO_PHONE_NUMBER');
      if (!adminPhoneNumber) missingVars.push('ADMIN_PHONE_NUMBER');
      throw new Error(`Missing Twilio configuration: ${missingVars.join(', ')}`);
    }

    const booking: BookingNotification = await req.json();
    console.log('Booking data received:', booking);

    const message = `Нова заявка за резервация!

Студио: ${booking.studioName}
Дати: ${booking.startDate} - ${booking.endDate}
Цена: ${booking.totalPrice} лв.

Клиент: ${booking.customerName}
Контакт: ${booking.contactMethod} - ${booking.contactValue}`;

    console.log('Sending SMS with message:', message);

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    const body = new URLSearchParams({
      To: adminPhoneNumber,
      From: twilioPhoneNumber,
      Body: message,
    });

    console.log('Calling Twilio API...');
    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    console.log('Twilio response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio API error:', error);
      throw new Error(`Twilio API error: ${error}`);
    }

    const result = await response.json();
    console.log('SMS sent successfully:', result.sid);

    return new Response(
      JSON.stringify({ success: true, messageId: result.sid }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('Error in SMS function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});