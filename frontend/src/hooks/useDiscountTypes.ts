import type { DiscountType, Discount } from '../api/types';
import { DISCOUNT_CONFIG } from '../config/discountConfig';

export interface DiscountTypeOption {
  value: DiscountType;
  label: string;
}

const DISCOUNT_TYPE_OPTIONS: DiscountTypeOption[] = (
  Object.entries(DISCOUNT_CONFIG) as [DiscountType, (typeof DISCOUNT_CONFIG)[DiscountType]][]
).map(([value, config]) => ({ value, label: config.label }));

/**
 * Hook que expone las opciones de tipo de descuento derivadas
 * de DISCOUNT_CONFIG.
 */
export function useDiscountTypes() {
  const getFormattedValue = (discount: Discount): string => {
    return DISCOUNT_CONFIG[discount._typeDiscount]?.formatter(discount) ?? '-';
  };

  return {
    options: DISCOUNT_TYPE_OPTIONS,
    getLabel: (type: DiscountType) => DISCOUNT_CONFIG[type]?.label ?? type,
    getFormattedValue,
  };
}
