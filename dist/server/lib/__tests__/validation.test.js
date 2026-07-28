import { describe, it, expect } from 'vitest';
import { createDonationSchema, confirmWireSchema, loginSchema, adminLoginSchema, volunteerSchema, newsletterSchema } from '../validation.js';
describe('createDonationSchema', () => {
    const validDonation = {
        amount: 10000,
        currency: 'USD',
        isRecurring: false,
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        donorCountry: 'US',
        isAnonymous: false,
        coverFees: true,
        paymentMethod: 'crypto',
        provider: 'nowpayments',
    };
    it('accepts valid donation', () => {
        const result = createDonationSchema.safeParse(validDonation);
        expect(result.success).toBe(true);
    });
    it('rejects amount below minimum ($50)', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, amount: 4999 });
        expect(result.success).toBe(false);
    });
    it('rejects amount above maximum', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, amount: 100000001 });
        expect(result.success).toBe(false);
    });
    it('accepts minimum amount ($50)', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, amount: 5000 });
        expect(result.success).toBe(true);
    });
    it('rejects invalid currency', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, currency: 'BTC' });
        expect(result.success).toBe(false);
    });
    it('rejects invalid email', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, donorEmail: 'not-an-email' });
        expect(result.success).toBe(false);
    });
    it('rejects empty name', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, donorName: '' });
        expect(result.success).toBe(false);
    });
    it('rejects invalid provider', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, provider: 'flutterwave' });
        expect(result.success).toBe(false);
    });
    it('rejects stripe as provider', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, provider: 'stripe' });
        expect(result.success).toBe(false);
    });
    it('rejects paypal as provider', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, provider: 'paypal' });
        expect(result.success).toBe(false);
    });
    it('accepts optional campaignId as UUID', () => {
        const result = createDonationSchema.safeParse({
            ...validDonation,
            campaignId: '550e8400-e29b-41d4-a716-446655440000',
        });
        expect(result.success).toBe(true);
    });
    it('accepts empty string campaignId', () => {
        const result = createDonationSchema.safeParse({ ...validDonation, campaignId: '' });
        expect(result.success).toBe(true);
    });
    it('accepts all supported currencies', () => {
        const currencies = ['USD', 'EUR', 'GBP', 'KES', 'NGN', 'GHS', 'ZAR', 'UGX', 'TZS'];
        for (const currency of currencies) {
            const result = createDonationSchema.safeParse({ ...validDonation, currency });
            expect(result.success).toBe(true);
        }
    });
    it('accepts all providers', () => {
        const providers = ['nowpayments', 'bank_wire'];
        for (const provider of providers) {
            const result = createDonationSchema.safeParse({ ...validDonation, provider });
            expect(result.success).toBe(true);
        }
    });
});
describe('confirmWireSchema', () => {
    it('accepts valid UUID', () => {
        const result = confirmWireSchema.safeParse({ donationId: '550e8400-e29b-41d4-a716-446655440000' });
        expect(result.success).toBe(true);
    });
    it('rejects invalid UUID', () => {
        const result = confirmWireSchema.safeParse({ donationId: 'not-a-uuid' });
        expect(result.success).toBe(false);
    });
});
describe('loginSchema', () => {
    it('accepts valid email', () => {
        const result = loginSchema.safeParse({ email: 'test@example.com' });
        expect(result.success).toBe(true);
    });
    it('rejects invalid email', () => {
        const result = loginSchema.safeParse({ email: 'invalid' });
        expect(result.success).toBe(false);
    });
});
describe('adminLoginSchema', () => {
    it('accepts valid credentials', () => {
        const result = adminLoginSchema.safeParse({ email: 'admin@test.com', password: 'pass123' });
        expect(result.success).toBe(true);
    });
    it('accepts with MFA code', () => {
        const result = adminLoginSchema.safeParse({ email: 'admin@test.com', password: 'pass123', mfaCode: '123456' });
        expect(result.success).toBe(true);
    });
    it('rejects empty password', () => {
        const result = adminLoginSchema.safeParse({ email: 'admin@test.com', password: '' });
        expect(result.success).toBe(false);
    });
    it('rejects wrong length MFA code', () => {
        const result = adminLoginSchema.safeParse({ email: 'admin@test.com', password: 'pass123', mfaCode: '123' });
        expect(result.success).toBe(false);
    });
});
describe('volunteerSchema', () => {
    it('accepts valid volunteer data', () => {
        const result = volunteerSchema.safeParse({ name: 'Jane Doe', email: 'jane@test.com' });
        expect(result.success).toBe(true);
    });
    it('accepts with optional fields', () => {
        const result = volunteerSchema.safeParse({
            name: 'Jane Doe',
            email: 'jane@test.com',
            skills: 'React, TypeScript',
            availability: 'Weekends',
        });
        expect(result.success).toBe(true);
    });
    it('rejects short name', () => {
        const result = volunteerSchema.safeParse({ name: 'J', email: 'jane@test.com' });
        expect(result.success).toBe(false);
    });
});
describe('newsletterSchema', () => {
    it('accepts valid email', () => {
        const result = newsletterSchema.safeParse({ email: 'subscriber@test.com' });
        expect(result.success).toBe(true);
    });
    it('rejects invalid email', () => {
        const result = newsletterSchema.safeParse({ email: 'bad-email' });
        expect(result.success).toBe(false);
    });
});
