import type { Discount, DiscountType } from '../api/types';

export interface FieldConfig {
  /** Property name in CreateDiscountRequest */
  name: string;
  /** Property name in Discount response (with underscore prefix) */
  responseField: string;
  label: string;
  type: 'number' | 'text';
  placeholder?: string;
  inputProps?: Record<string, number>;
  adornment?: { position: 'start' | 'end'; text: string };
}

export interface DiscountTypeConfig {
  label: string;
  fields: FieldConfig[];
  formatter: (discount: Discount) => string;
  /** Message shown when there are no extra fields */
  infoMessage?: string;
}

export const DISCOUNT_CONFIG: Record<DiscountType, DiscountTypeConfig> = {
  PercentageDiscount: {
    label: 'Porcentaje',
    fields: [
      {
        name: 'percentage',
        responseField: '_percentage',
        label: 'Porcentaje',
        type: 'number',
        placeholder: 'Ej: 10',
        inputProps: { min: 0, max: 100, step: 0.01 },
        adornment: { position: 'end', text: '%' },
      },
    ],
    formatter: (d) => (d._percentage ? `${d._percentage}%` : '-'),
  },

  FixedAmountDiscount: {
    label: 'Monto Fijo',
    fields: [
      {
        name: 'amount',
        responseField: '_amount',
        label: 'Monto',
        type: 'number',
        placeholder: 'Ej: 100',
        inputProps: { min: 0, step: 0.01 },
        adornment: { position: 'start', text: '$' },
      },
    ],
    formatter: (d) => (d._amount ? `$${d._amount}` : '-'),
  },

  TwoForOneDiscount: {
    label: '2x1',
    fields: [],
    formatter: () => '2x1',
    infoMessage: 'Descuento 2x1 — no requiere campos adicionales',
  },
};
