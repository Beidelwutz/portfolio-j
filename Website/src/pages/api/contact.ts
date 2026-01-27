import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, message } = data;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Alle Felder sind erforderlich" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Kontakt <onboarding@resend.dev>",
      to: ["kontakt@jpgjenny.me", "sester.jennifer@gmail.com"],
      replyTo: email,
      subject: `Portfolio Anfrage von ${name}`,
      html: `
        <h2>Neue Anfrage über das Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      text: `Neue Anfrage über das Portfolio\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(
        JSON.stringify({ error: "E-Mail konnte nicht gesendet werden" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
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
