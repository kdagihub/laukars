// Email service abstraction
// Uses Resend in production, logs to console in development

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Development: log to console
    console.log("=== EMAIL (dev) ===");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${html.substring(0, 200)}...`);
    console.log("===================");
    return { success: true, dev: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Laukars <noreply@laukars.com>",
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

// ─── EMAIL TEMPLATES ────────────────────────────────────────────────────────

export function emailLeadConfirmation(
  clientName: string,
  codeA: string,
  vehicleTitle: string,
  trackingUrl: string
) {
  return {
    subject: `Laukars - Votre demande a été enregistrée (${codeA})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1e3a5f; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Laukars</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #1a1a1a;">Bonjour ${clientName},</h2>
          <p style="color: #4a5568;">Votre demande pour <strong>${vehicleTitle}</strong> a été enregistrée avec succès.</p>
          
          <div style="background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="color: #3b82f6; font-size: 14px; margin: 0 0 8px 0;">Votre code de visite</p>
            <p style="color: #1e3a5f; font-size: 32px; font-weight: bold; font-family: monospace; margin: 0; letter-spacing: 3px;">${codeA}</p>
          </div>
          
          <p style="color: #4a5568;">Conservez ce code, il vous sera demandé lors du rendez-vous.</p>
          <p style="color: #4a5568;">Vous pouvez suivre l'avancement de votre demande :</p>
          
          <div style="text-align: center; margin: 24px 0;">
            <a href="${trackingUrl}" style="background: #1e3a5f; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Suivre ma demande
            </a>
          </div>
          
          <p style="color: #718096; font-size: 14px;">Vous serez contacté très rapidement par notre équipe.</p>
        </div>
        <p style="text-align: center; color: #a0aec0; font-size: 12px; margin-top: 16px;">
          &copy; ${new Date().getFullYear()} Laukars - Votre courtier automobile de confiance
        </p>
      </div>
    `,
  };
}

export function emailNewLeadNotification(
  agentName: string,
  clientName: string,
  clientPhone: string,
  vehicleTitle: string,
  requestType: string,
  codeA: string
) {
  return {
    subject: `Nouvelle demande: ${clientName} - ${vehicleTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1e3a5f; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">Nouvelle demande reçue</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p>Bonjour ${agentName},</p>
          <p>Une nouvelle demande a été enregistrée :</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Client</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${clientName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Téléphone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${clientPhone}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Véhicule</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${vehicleTitle}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${requestType === "BUY" ? "Achat" : "Location"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Code A</td><td style="padding: 8px; font-family: monospace; font-size: 18px; font-weight: bold; color: #1e3a5f;">${codeA}</td></tr>
          </table>
          <p style="color: #e53e3e; font-weight: bold;">Contactez le client rapidement !</p>
        </div>
      </div>
    `,
  };
}

export function emailSurveyAlert(
  clientName: string,
  codeA: string,
  vehicleTitle: string
) {
  return {
    subject: `⚠️ ALERTE: Incohérence détectée - ${codeA}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #e53e3e; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">Alerte Incohérence</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #e53e3e; font-weight: bold;">Le client déclare avoir acheté le véhicule alors que l'agent a marqué la demande comme "Échec".</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Client</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${clientName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Véhicule</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${vehicleTitle}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Code A</td><td style="padding: 8px; font-family: monospace; font-size: 18px; color: #e53e3e;">${codeA}</td></tr>
          </table>
          <p>Veuillez vérifier cette situation dans le dashboard.</p>
        </div>
      </div>
    `,
  };
}
