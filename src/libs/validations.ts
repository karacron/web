import { promises as dns } from 'dns';

export const STRICT_EMAIL_REGEX =
	/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function validateEmailMX(email: string): Promise<boolean> {
	const domain = email.split('@')[1];
	if (!domain) return false;

	try {
		const records = await dns.resolveMx(domain);
		return records && records.length > 0;
	} catch (error) {
		console.error('MX validation failed for domain:', domain, error);
		return false; // Rechazar si falla lookup
	}
}

export function validateEmail(email: string): boolean {
	return STRICT_EMAIL_REGEX.test(email);
}

export const MIN_MESSAGE_LENGTH = 10;
export const MAX_MESSAGE_LENGTH = 500;

export function validateMessage(message: string): boolean {
	const trimmed = message.trim();
	return (
		trimmed.length >= MIN_MESSAGE_LENGTH &&
		trimmed.length <= MAX_MESSAGE_LENGTH
	);
}

export function validateName(name: string): boolean {
	return name.trim().length > 0 && name.trim().length <= 200;
}

export function validateCompanyName(
	companyName: string | undefined,
	type: string,
): boolean {
	if (type !== 'company') return true;
	return companyName ? validateName(companyName) : false;
}

export function validateEmployeeRange(range: string | undefined): boolean {
	const validRanges = ['1-10', '11-50', '51-200', '201-500', '500+'];
	return range ? validRanges.includes(range) : true;
}

export interface WaitlistValidationError {
	field: string;
	message: string;
}

export function validateWaitlistForm(
	payload: Record<string, unknown>,
): WaitlistValidationError[] {
	const errors: WaitlistValidationError[] = [];

	// Name
	if (!validateName(String(payload.name || ''))) {
		errors.push({
			field: 'name',
			message: 'Name is required and must be valid',
		});
	}

	// Type
	const type = String(payload.type || '');
	if (!['personal', 'company'].includes(type)) {
		errors.push({
			field: 'type',
			message: "Type must be 'personal' or 'company'",
		});
	}

	// Company name
	if (!validateCompanyName(payload.companyName as string | undefined, type)) {
		errors.push({
			field: 'companyName',
			message: "Company name is required when type is 'company'",
		});
	}

	// Employee range
	if (!validateEmployeeRange(payload.employeeRange as string | undefined)) {
		errors.push({
			field: 'employeeRange',
			message: 'Invalid employee range',
		});
	}

	// Email
	if (!validateEmail(String(payload.email || ''))) {
		errors.push({ field: 'email', message: 'Email must be valid' });
	}

	// Message
	if (!validateMessage(String(payload.message || ''))) {
		errors.push({
			field: 'message',
			message: `Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters`,
		});
	}

	// Consent
	if (!payload.consentPrivacy) {
		errors.push({
			field: 'consentPrivacy',
			message: 'Privacy consent is required',
		});
	}

	return errors;
}
