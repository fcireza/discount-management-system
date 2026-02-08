export type DiscountType = 'PercentageDiscount' | 'FixedAmountDiscount' | 'TwoForOneDiscount';

export interface Discount {
  _discountId: string;
  _name: string;
  _typeDiscount: DiscountType;
  _percentage?: number;
  _amount?: number;
}

export interface CreateDiscountRequest {
  name: string;
  type: DiscountType;
  percentage?: number;
  amount?: number;
}

export interface ApplyDiscountRequest {
  discountId: string;
  unitPrice: number;
  quantity: number;
}

export interface ApplyDiscountResponse {
  originalTotal: number;
  finalTotal: number;
  discountedApplied: number;
}
