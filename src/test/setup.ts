import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

jest.mock('dns', () => ({
	promises: {
		resolveMx: jest.fn(async (domain) => {
			if (domain === 'valid.com')
				return [{ exchange: 'mail.valid.com', priority: 10 }];
			if (domain === 'invalid.com')
				throw new Error('No MX records found');
			throw new Error('DNS lookup failed');
		}),
	},
}));
