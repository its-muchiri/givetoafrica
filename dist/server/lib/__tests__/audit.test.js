import { describe, it, expect } from 'vitest';
import { generateReceiptNumber } from '../audit.js';
describe('audit', () => {
    describe('generateReceiptNumber', () => {
        it('generates receipt number with GF prefix', () => {
            const receipt = generateReceiptNumber();
            expect(receipt).toMatch(/^GF-\d{6}-[A-Z0-9]{6}$/);
        });
        it('generates unique receipt numbers', () => {
            const receipts = new Set();
            for (let i = 0; i < 100; i++) {
                receipts.add(generateReceiptNumber());
            }
            expect(receipts.size).toBe(100);
        });
        it('includes current date in receipt number', () => {
            const receipt = generateReceiptNumber();
            const now = new Date();
            const datePart = now.getFullYear().toString().slice(-2) +
                String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0');
            expect(receipt).toContain(datePart);
        });
    });
});
