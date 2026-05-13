const watchedVars = [
  "DATABASE_URL",
  "DIRECT_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "WAITLIST_FROM_EMAIL",
  "WAITLIST_NOTIFY_EMAIL",
];

console.log("[build-env] Environment variable status:");

for (const key of watchedVars) {
  const value = process.env[key];
  const status = value && value.trim().length > 0 ? "SET" : "MISSING";
  console.log(`[build-env] ${key}=${status}`);
}
