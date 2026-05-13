import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { routing } from './routing';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function normalizeLocale(value: string | null): string | undefined {
	if (!value) {
		return undefined;
	}

	const short = value.split('-')[0]?.toLowerCase();
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
		headerStore.get('accept-language')?.split(',')[0]?.trim() ?? null,
	);

	const locale = fromCookie ?? fromHeader ?? routing.defaultLocale;

	return {
		locale,
		messages: (await import(`../i18n/content/${locale}.json`)).default,
	};
});

export function getLocalizedErrorMessage(
	key:
		| 'invalid_email_domain'
		| 'email_already_registered'
		| 'internal_server_error',
	locale: string,
): string {
	const messages = {
		en: {
			invalid_email_domain: 'Email is not valid',
			email_already_registered: 'Email already registered',
			internal_server_error: 'Internal server error',
		},
		es: {
			invalid_email_domain: 'El correo electrónico no es válido',
			email_already_registered:
				'El correo electrónico ya está registrado',
			internal_server_error: 'Error interno del servidor',
		},
	};

	return (
		messages[locale as 'en' | 'es']?.[key] ||
		messages.en[key] ||
		'Unknown error'
	);
}
