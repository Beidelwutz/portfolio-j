import type { APIRoute } from "astro";
import { Resend } from "resend";

// Professionelles HTML-Template für die Bestätigungs-E-Mail an den Absender
const getConfirmationEmailHtml = (name: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f7f8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; box-shadow: 0 10px 30px rgba(15, 17, 21, 0.12); overflow: hidden;">
          
          <!-- Header mit Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c5cff 0%, #5b3bff 100%); padding: 40px 40px 35px; text-align: center;">
              <h1 style="margin: 0; font-family: 'Raleway', sans-serif; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                JPG<span style="opacity: 0.9;">Jenny</span>
              </h1>
              <p style="margin: 8px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.8); letter-spacing: 0.05em; text-transform: uppercase;">
                Video &amp; Content Creator
              </p>
            </td>
          </tr>
          
          <!-- Hauptinhalt -->
          <tr>
            <td style="padding: 48px 40px;">
              <h2 style="margin: 0 0 20px; font-family: 'Raleway', sans-serif; font-size: 24px; font-weight: 700; color: #12141a;">
                Vielen Dank für deine Nachricht, ${name}!
              </h2>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #667085;">
                Ich habe deine Anfrage erhalten und freue mich sehr über dein Interesse an einer Zusammenarbeit.
              </p>
              
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #667085;">
                Ich werde mir deine Nachricht in Ruhe durchlesen und melde mich <strong style="color: #12141a;">in der Regel innerhalb weniger Stunden</strong> bei dir zurück.
              </p>
              
              <div style="background: rgba(124, 92, 255, 0.06); border-radius: 16px; padding: 24px; margin: 32px 0; border-left: 4px solid #7c5cff;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #667085;">
                  <strong style="color: #12141a;">Was passiert als Nächstes?</strong><br>
                  In meiner Antwort werde ich auf deine Anfrage eingehen und dir mehr über meine Verfügbarkeit und die nächsten Schritte mitteilen.
                </p>
              </div>
              
              <p style="margin: 32px 0 0; font-size: 16px; line-height: 1.7; color: #667085;">
                Bis bald!<br>
                <strong style="color: #12141a;">Jenny</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f1115; padding: 32px 40px; text-align: center;">
              <p style="margin: 0 0 12px; font-family: 'Raleway', sans-serif; font-size: 18px; font-weight: 800; color: #ffffff;">
                JPG<span style="color: #7c5cff;">Jenny</span>
              </p>
              <p style="margin: 0 0 16px; font-size: 13px; color: rgba(255, 255, 255, 0.5);">
                Video &amp; Content Creator aus Deutschland
              </p>
              <p style="margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.4);">
                <a href="https://jpgjenny.me" style="color: rgba(255, 255, 255, 0.6); text-decoration: none;">jpgjenny.me</a>
              </p>
            </td>
          </tr>
          
        </table>
        
        <!-- Legal Footer -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
          <tr>
            <td style="text-align: center; font-size: 12px; color: #667085; line-height: 1.6;">
              <p style="margin: 0;">
                Diese E-Mail wurde automatisch generiert, weil du das Kontaktformular auf jpgjenny.me ausgefüllt hast.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Plaintext-Version für die Bestätigungs-E-Mail
const getConfirmationEmailText = (name: string) => `
Vielen Dank für deine Nachricht, ${name}!

Ich habe deine Anfrage erhalten und freue mich sehr über dein Interesse an einer Zusammenarbeit.

Ich werde mir deine Nachricht in Ruhe durchlesen und melde mich in der Regel innerhalb weniger Stunden bei dir zurück.

Was passiert als Nächstes?
In meiner Antwort werde ich auf deine Anfrage eingehen und dir mehr über meine Verfügbarkeit und die nächsten Schritte mitteilen.

Bis bald!
Jenny

---
JPGJenny | Video & Content Creator
https://jpgjenny.me
`;

// Admin-Benachrichtigung mit allen Details
const getAdminNotificationHtml = (
  name: string, 
  email: string, 
  message: string, 
  ip: string, 
  geo: { city?: string; region?: string; country?: string; timezone?: string } | null,
  userAgent: string,
  timestamp: string
) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f7f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f7f8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(15, 17, 21, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #12141a 0%, #1a1d24 100%); padding: 24px 32px;">
              <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
                Neue Kontaktanfrage
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.6);">
                ${timestamp}
              </p>
            </td>
          </tr>
          
          <!-- Kontaktdaten -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px; font-size: 14px; font-weight: 700; color: #7c5cff; text-transform: uppercase; letter-spacing: 0.1em;">
                Absender
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; background: #f7f7f8; border-radius: 8px;">
                    <p style="margin: 0 0 8px; font-size: 14px; color: #667085;">
                      <strong style="color: #12141a;">Name:</strong> ${name}
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #667085;">
                      <strong style="color: #12141a;">E-Mail:</strong> 
                      <a href="mailto:${email}" style="color: #7c5cff; text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <h2 style="margin: 0 0 16px; font-size: 14px; font-weight: 700; color: #7c5cff; text-transform: uppercase; letter-spacing: 0.1em;">
                Nachricht
              </h2>
              <div style="padding: 16px 20px; background: #f7f7f8; border-radius: 8px; border-left: 3px solid #7c5cff; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #12141a; white-space: pre-wrap;">${message}</p>
              </div>
              
              <h2 style="margin: 0 0 16px; font-size: 14px; font-weight: 700; color: #667085; text-transform: uppercase; letter-spacing: 0.1em;">
                Technische Daten
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #667085;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f2;">
                    <strong>IP-Adresse:</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f2; text-align: right;">
                    <code style="background: #f7f7f8; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${ip}</code>
                  </td>
                </tr>
                ${geo ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f2;">
                    <strong>Standort:</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f2; text-align: right;">
                    ${[geo.city, geo.region, geo.country].filter(Boolean).join(", ") || "Unbekannt"}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f2;">
                    <strong>Zeitzone:</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f0f0f2; text-align: right;">
                    ${geo.timezone || "Unbekannt"}
                  </td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding: 8px 0;" colspan="2">
                    <strong>User-Agent:</strong><br>
                    <span style="font-size: 11px; word-break: break-all;">${userAgent}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Quick Actions -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <a href="mailto:${email}?subject=Re: Deine Anfrage auf jpgjenny.me" 
                 style="display: inline-block; padding: 12px 24px; background: #7c5cff; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 999px;">
                Direkt antworten
              </a>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Hilfsfunktion: IP-Adresse extrahieren
function getClientIP(request: Request): string {
  // Vercel / Netlify
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  // Cloudflare
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Andere Header
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  return "Unbekannt";
}

// Hilfsfunktion: Geo-Daten aus Vercel/Cloudflare Headers
function getGeoData(request: Request): { city?: string; region?: string; country?: string; timezone?: string } | null {
  // Vercel Geo Headers
  const city = request.headers.get("x-vercel-ip-city");
  const region = request.headers.get("x-vercel-ip-country-region");
  const country = request.headers.get("x-vercel-ip-country");
  const timezone = request.headers.get("x-vercel-ip-timezone");
  
  // Cloudflare Geo Headers als Fallback
  const cfCountry = request.headers.get("cf-ipcountry");
  
  if (city || region || country || timezone || cfCountry) {
    return {
      city: city ? decodeURIComponent(city) : undefined,
      region: region || undefined,
      country: country || cfCountry || undefined,
      timezone: timezone || undefined,
    };
  }
  
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // API Key Check
    const apiKey = import.meta.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "E-Mail-Service nicht konfiguriert. Bitte kontaktiere mich direkt unter sester.jennifer@gmail.com" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Resend Client innerhalb der Funktion erstellen
    const resend = new Resend(apiKey);

    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Alle Felder sind erforderlich" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Technische Daten sammeln
    const clientIP = getClientIP(request);
    const geoData = getGeoData(request);
    const userAgent = request.headers.get("user-agent") || "Unbekannt";
    const timestamp = new Date().toLocaleString("de-DE", {
      timeZone: "Europe/Berlin",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Bestätigungs-E-Mail an den Absender senden
    const confirmationResult = await resend.emails.send({
      from: "Jenny | JPGJenny <kontakt@jpgjenny.me>",
      to: email,
      subject: "Danke für deine Nachricht!",
      html: getConfirmationEmailHtml(name),
      text: getConfirmationEmailText(name),
    });

    if (confirmationResult.error) {
      console.error("Confirmation email error:", confirmationResult.error);
    }

    // 2. Admin-Benachrichtigung an pepebauer5@gmail.com
    const adminResult = await resend.emails.send({
      from: "Portfolio Kontakt <kontakt@jpgjenny.me>",
      to: "pepebauer5@gmail.com",
      replyTo: email,
      subject: `Neue Anfrage von ${name}`,
      html: getAdminNotificationHtml(name, email, message, clientIP, geoData, userAgent, timestamp),
      text: `Neue Anfrage über das Portfolio\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}\n\n---\nIP: ${clientIP}\nStandort: ${geoData ? [geoData.city, geoData.region, geoData.country].filter(Boolean).join(", ") : "Unbekannt"}\nZeit: ${timestamp}`,
    });

    if (adminResult.error) {
      console.error("Admin notification error:", adminResult.error);
      return new Response(
        JSON.stringify({ error: `E-Mail Fehler: ${adminResult.error.message}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Kopie an sester.jennifer@gmail.com mit allen Daten
    const copyResult = await resend.emails.send({
      from: "Portfolio Kontakt <kontakt@jpgjenny.me>",
      to: "sester.jennifer@gmail.com",
      replyTo: email,
      subject: `[Kopie] Neue Anfrage von ${name}`,
      html: getAdminNotificationHtml(name, email, message, clientIP, geoData, userAgent, timestamp),
      text: `Neue Anfrage über das Portfolio\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}\n\n---\nIP: ${clientIP}\nStandort: ${geoData ? [geoData.city, geoData.region, geoData.country].filter(Boolean).join(", ") : "Unbekannt"}\nZeit: ${timestamp}`,
    });

    if (copyResult.error) {
      console.error("Copy email error:", copyResult.error);
      // Nicht als Fehler behandeln, da die Hauptmails gesendet wurden
    }

    return new Response(
      JSON.stringify({ success: true, message: "Nachricht gesendet!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return new Response(
      JSON.stringify({ error: "Serverfehler" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
