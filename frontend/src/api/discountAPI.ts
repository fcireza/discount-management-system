import { httpClient } from './client';
import type {
  Discount,
  CreateDiscountRequest,
  ApplyDiscountRequest,
  ApplyDiscountResponse,
} from './types';

export const discountsApi = {
  getAll(): Promise<Discount[]> {
    return httpClient<Discount[]>('/Discounts');
  },

  getById(discountId: string): Promise<Discount> {
    return httpClient<Discount>(`/Discounts/${discountId}`);
  },

  create(data: CreateDiscountRequest): Promise<void> {
    return httpClient<void>('/Discounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete(discountId: string): Promise<void> {
    return httpClient<void>(`/Discounts/${discountId}`, {
      method: 'DELETE',
    });
  },

  applyDiscount(
    data: ApplyDiscountRequest
  ): Promise<ApplyDiscountResponse> {
    return httpClient<ApplyDiscountResponse>('/Discounts/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
