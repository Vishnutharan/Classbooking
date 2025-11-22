/**
 * Payment-related models
 * Extracted from payment-integration.service.ts
 */

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'succeeded' | 'failed';
    clientSecret: string;
}

export interface PaymentReceipt {
    id: string;
    paymentIntentId: string;
    amount: number;
    currency: string;
    receiptUrl: string;
    createdAt: Date;
}
