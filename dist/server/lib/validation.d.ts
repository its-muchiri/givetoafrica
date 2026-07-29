import { z } from 'zod';
export declare const createDonationSchema: z.ZodObject<{
    amount: z.ZodNumber;
    currency: z.ZodEnum<["USD", "EUR", "GBP", "KES", "NGN", "GHS", "ZAR", "UGX", "TZS"]>;
    isRecurring: z.ZodBoolean;
    campaignId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    donorName: z.ZodString;
    donorEmail: z.ZodString;
    donorCountry: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodBoolean;
    coverFees: z.ZodBoolean;
    paymentMethod: z.ZodEnum<["crypto", "bank_transfer"]>;
    provider: z.ZodEnum<["nowpayments", "bank_wire"]>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    currency: "USD" | "EUR" | "GBP" | "KES" | "NGN" | "GHS" | "ZAR" | "UGX" | "TZS";
    isRecurring: boolean;
    donorName: string;
    donorEmail: string;
    donorCountry: string;
    isAnonymous: boolean;
    coverFees: boolean;
    paymentMethod: "crypto" | "bank_transfer";
    provider: "nowpayments" | "bank_wire";
    message?: string | undefined;
    campaignId?: string | undefined;
}, {
    amount: number;
    currency: "USD" | "EUR" | "GBP" | "KES" | "NGN" | "GHS" | "ZAR" | "UGX" | "TZS";
    isRecurring: boolean;
    donorName: string;
    donorEmail: string;
    donorCountry: string;
    isAnonymous: boolean;
    coverFees: boolean;
    paymentMethod: "crypto" | "bank_transfer";
    provider: "nowpayments" | "bank_wire";
    message?: string | undefined;
    campaignId?: string | undefined;
}>;
export declare const confirmWireSchema: z.ZodObject<{
    donationId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    donationId: string;
}, {
    donationId: string;
}>;
export declare const createCampaignSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    goalAmount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    currency: string;
    slug: string;
    title: string;
    description: string;
    goalAmount: number;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    slug: string;
    title: string;
    description: string;
    goalAmount: number;
    currency?: string | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const adminLoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    mfaCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
}, {
    email: string;
    password: string;
    mfaCode?: string | undefined;
}>;
export declare const volunteerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    skills: z.ZodOptional<z.ZodString>;
    availability: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    skills?: string | undefined;
    availability?: string | undefined;
}, {
    email: string;
    name: string;
    skills?: string | undefined;
    availability?: string | undefined;
}>;
export declare const newsletterSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
