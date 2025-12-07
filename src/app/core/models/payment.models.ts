export type PaymentMethod = 'Cash' | 'Card';

export interface CardDetails {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentRequestDto {
  bookingId: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  card?: CardDetails;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  subject: string;
  classType: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  paymentMethod: PaymentMethod | string;
  paymentStatus: string;
  amount: number;
  currency: string;
  transactionReference?: string;
  createdAt: string;
  paidAt?: string;
  notes?: string;
}
