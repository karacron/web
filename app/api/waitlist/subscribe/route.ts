import { getLocalizedErrorMessage } from '@lib/i18n';
import { prisma } from '@lib/prisma';
import { checkRateLimit, getClientIp } from '@lib/rate-limit';
import { validateEmailMX, validateWaitlistForm } from '@lib/validations';
import { sendWaitlistEmails } from '@lib/waitlist-email';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		// Rate limiting
		const ipHash = getClientIp(request.headers);
		const { allowed, remaining } = checkRateLimit(ipHash);

		if (!allowed) {
			return NextResponse.json(
				{
					ok: false,
					error: 'Too many requests. Please try again later.',
				},
				{
					status: 429,
					headers: {
						'X-Content-Type-Options': 'nosniff',
						'X-Frame-Options': 'DENY',
						'X-XSS-Protection': '1; mode=block',
						'Strict-Transport-Security':
							'max-age=31536000; includeSubDomains',
						'Content-Type': 'application/json',
					},
				},
			);
		}

		// Parse and validate body
		const body = await request.json();

		const validationErrors = validateWaitlistForm(body);
		if (validationErrors.length > 0) {
			return NextResponse.json(
				{ ok: false, errors: validationErrors },
				{
					status: 400,
					headers: {
						'X-Content-Type-Options': 'nosniff',
						'X-Frame-Options': 'DENY',
						'Content-Type': 'application/json',
					},
				},
			);
		}

		const locale = body.locale || 'en';

		// Validar MX del email
		const isEmailValidMX = await validateEmailMX(body.email);
		if (!isEmailValidMX) {
			return NextResponse.json(
				{
					ok: false,
					error: getLocalizedErrorMessage(
						'invalid_email_domain',
						locale,
					),
				},
				{ status: 400 },
			);
		}

		// Check for duplicate email
		const existingSignup = await prisma.waitlistSignup.findUnique({
			where: { email: body.email },
		});

		if (existingSignup) {
			return NextResponse.json(
				{
					ok: false,
					error: getLocalizedErrorMessage(
						'email_already_registered',
						locale,
					),
				},
				{ status: 409 },
			);
		}

		// Create waitlist signup
		const signup = await prisma.waitlistSignup.create({
			data: {
				email: body.email,
				name: body.name,
				type: body.type,
				companyName: body.companyName || null,
				employeeRange: body.employeeRange || null,
				message: body.message,
				consentPrivacy: body.consentPrivacy === true,
				locale: body.locale || 'en',
				ipHash,
			},
		});

		// Best effort: si el correo falla, no bloquea el alta en waitlist.
		await sendWaitlistEmails({
			name: body.name,
			email: body.email,
			type: body.type,
			companyName: body.companyName || null,
			employeeRange: body.employeeRange || null,
			message: body.message,
			locale: body.locale || 'en',
		});

		return NextResponse.json(
			{ ok: true, id: signup.id },
			{
				status: 201,
				headers: {
					'X-Content-Type-Options': 'nosniff',
					'X-Frame-Options': 'DENY',
					'Strict-Transport-Security':
						'max-age=31536000; includeSubDomains',
					'Content-Type': 'application/json',
					'X-RateLimit-Remaining': String(remaining),
				},
			},
		);
	} catch (error) {
		console.error('[waitlist/subscribe] Error:', error);

		return NextResponse.json(
			{
				ok: false,
				error: getLocalizedErrorMessage(
					'internal_server_error',
					body.locale || 'en',
				),
			},
			{
				status: 500,
				headers: {
					'X-Content-Type-Options': 'nosniff',
					'Content-Type': 'application/json',
				},
			},
		);
	}
}

// Only allow POST
export async function GET() {
	return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
	return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
	return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
