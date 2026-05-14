import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { routing } from "./routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

function normalizeLocale(value: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const short = value.split("-")[0]?.toLowerCase();
  if (short && hasLocale(routing.locales, short)) {
    return short;
  }

  return hasLocale(routing.locales, value) ? value : undefined;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const fromCookie = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE)?.value ?? null,
  );
  const fromHeader = normalizeLocale(
    headerStore.get("accept-language")?.split(",")[0]?.trim() ?? null,
  );

  const locale = fromCookie ?? fromHeader ?? routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../i18n/content/${locale}.json`)).default,
  };
});

export function getLocalizedErrorMessage(
  key:
    | "invalid_email_domain"
    | "email_already_registered"
    | "internal_server_error",
  locale: string,
): string {
  const messages = {
    en: {
      invalid_email_domain: "Email is not valid",
      email_already_registered: "Email already registered",
      internal_server_error: "Internal server error",
    },
    es: {
      invalid_email_domain: "El correo electrónico no es válido",
      email_already_registered: "El correo electrónico ya está registrado",
      internal_server_error: "Error interno del servidor",
    },
    zh: {
      invalid_email_domain: "电子邮件无效",
      email_already_registered: "该电子邮件已注册",
      internal_server_error: "服务器内部错误",
    },
    nl: {
      invalid_email_domain: "E-mailadres is ongeldig",
      email_already_registered: "E-mailadres is al geregistreerd",
      internal_server_error: "Interne serverfout",
    },
    fr: {
      invalid_email_domain: "L'adresse e-mail n'est pas valide",
      email_already_registered: "L'adresse e-mail est déjà enregistrée",
      internal_server_error: "Erreur interne du serveur",
    },
    ja: {
      invalid_email_domain: "メールアドレスが無効です",
      email_already_registered: "このメールアドレスは既に登録されています",
      internal_server_error: "サーバー内部エラー",
    },
    de: {
      invalid_email_domain: "E-Mail ist ungültig",
      email_already_registered: "E-Mail ist bereits registriert",
      internal_server_error: "Interner Serverfehler",
    },
    it: {
      invalid_email_domain: "L'email non è valida",
      email_already_registered: "L'email è già registrata",
      internal_server_error: "Errore interno del server",
    },
    hi: {
      invalid_email_domain: "ईमेल मान्य नहीं है",
      email_already_registered: "ईमेल पहले से पंजीकृत है",
      internal_server_error: "आंतरिक सर्वर त्रुटि",
    },
    ar: {
      invalid_email_domain: "البريد الإلكتروني غير صالح",
      email_already_registered: "البريد الإلكتروني مسجل بالفعل",
      internal_server_error: "خطأ داخلي في الخادم",
    },
    ru: {
      invalid_email_domain: "Некорректный адрес электронной почты",
      email_already_registered: "Электронная почта уже зарегистрирована",
      internal_server_error: "Внутренняя ошибка сервера",
    },
    tr: {
      invalid_email_domain: "E-posta geçerli değil",
      email_already_registered: "E-posta zaten kayıtlı",
      internal_server_error: "Sunucu iç hatası",
    },
  };

  return (
    messages[locale as keyof typeof messages]?.[key] ||
    messages.en[key] ||
    "Unknown error"
  );
}
