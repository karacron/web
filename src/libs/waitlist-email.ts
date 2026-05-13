import nodemailer from "nodemailer";

type WaitlistLocale = "en" | "es";

type WaitlistEmailPayload = {
  name: string;
  email: string;
  type: "personal" | "company";
  companyName: string | null;
  employeeRange: string | null;
  message: string;
  locale: string;
};

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_SECURE = process.env.SMTP_SECURE === "true";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const WAITLIST_FROM_EMAIL = process.env.WAITLIST_FROM_EMAIL;
const WAITLIST_NOTIFY_EMAIL =
  process.env.WAITLIST_NOTIFY_EMAIL ?? "sgonzalez@authuser.org";

function resolveLocale(locale: string): WaitlistLocale {
  return locale === "es" ? "es" : "en";
}

function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !WAITLIST_FROM_EMAIL) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

function getThanksTemplate(locale: WaitlistLocale, name: string) {
  if (locale === "es") {
    return {
      subject: "Gracias por unirte a la lista de espera de Kara",
      text: `Hola ${name},\n\nGracias por sumarte a la lista de espera de Kara.\n\nRecibimos tus datos correctamente y te escribiremos cuando tengamos novedades, previews privadas o acceso anticipado.\n\nUn saludo,\nEquipo Kara`,
      html: `<p>Hola ${name},</p><p>Gracias por sumarte a la lista de espera de Kara.</p><p>Recibimos tus datos correctamente y te escribiremos cuando tengamos novedades, previews privadas o acceso anticipado.</p><p>Un saludo,<br/>Equipo Kara</p>`,
    };
  }

  return {
    subject: "Thanks for joining the Kara waitlist",
    text: `Hi ${name},\n\nThanks for joining the Kara waitlist.\n\nWe received your submission and we will reach out when we have updates, private previews, or early access.\n\nBest regards,\nKara Team`,
    html: `<p>Hi ${name},</p><p>Thanks for joining the Kara waitlist.</p><p>We received your submission and we will reach out when we have updates, private previews, or early access.</p><p>Best regards,<br/>Kara Team</p>`,
  };
}

function getAdminTemplate(payload: WaitlistEmailPayload) {
  const locale = resolveLocale(payload.locale);

  return {
    subject: `Nueva alta en waitlist (${locale.toUpperCase()})`,
    text: [
      "Se registró un nuevo contacto en la waitlist:",
      `- Nombre: ${payload.name}`,
      `- Email: ${payload.email}`,
      `- Tipo: ${payload.type}`,
      `- Empresa: ${payload.companyName ?? "N/A"}`,
      `- Rango empleados: ${payload.employeeRange ?? "N/A"}`,
      `- Locale: ${payload.locale}`,
      `- Mensaje: ${payload.message}`,
    ].join("\n"),
    html: `<p>Se registró un nuevo contacto en la waitlist:</p><ul><li><strong>Nombre:</strong> ${payload.name}</li><li><strong>Email:</strong> ${payload.email}</li><li><strong>Tipo:</strong> ${payload.type}</li><li><strong>Empresa:</strong> ${payload.companyName ?? "N/A"}</li><li><strong>Rango empleados:</strong> ${payload.employeeRange ?? "N/A"}</li><li><strong>Locale:</strong> ${payload.locale}</li><li><strong>Mensaje:</strong> ${payload.message}</li></ul>`,
  };
}

export async function sendWaitlistEmails(payload: WaitlistEmailPayload) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn(
      "[waitlist-email] SMTP no configurado. Se omite envío de correo.",
    );
    return;
  }

  const locale = resolveLocale(payload.locale);
  const thanks = getThanksTemplate(locale, payload.name);
  const admin = getAdminTemplate(payload);

  const [adminResult, contactResult] = await Promise.allSettled([
    transporter.sendMail({
      from: WAITLIST_FROM_EMAIL,
      to: WAITLIST_NOTIFY_EMAIL,
      replyTo: payload.email,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
    }),
    transporter.sendMail({
      from: WAITLIST_FROM_EMAIL,
      to: payload.email,
      subject: thanks.subject,
      text: thanks.text,
      html: thanks.html,
    }),
  ]);

  if (adminResult.status === "rejected") {
    console.error(
      "[waitlist-email] Falló notificación interna:",
      adminResult.reason,
    );
  }

  if (contactResult.status === "rejected") {
    console.error(
      "[waitlist-email] Falló agradecimiento al contacto:",
      contactResult.reason,
    );
  }
}
