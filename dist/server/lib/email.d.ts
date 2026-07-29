interface SendReceiptEmailParams {
    to: string;
    donorName: string;
    amount: number;
    currency: string;
    receiptNumber: string;
    campaignName?: string;
    isRecurring: boolean;
}
export declare function sendReceiptEmail(params: SendReceiptEmailParams): Promise<void>;
export declare function sendWelcomeEmail(to: string, donorName: string): Promise<void>;
export declare function sendNewsletterDigestEmail(to: string, subject: string, content: string): Promise<void>;
export declare function sendMagicLinkEmail(email: string, token: string): Promise<void>;
export {};
