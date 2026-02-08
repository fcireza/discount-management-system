import type { DiscountType } from '../api/types';
import { DISCOUNT_CONFIG } from '../config/discountConfig';
import { useDiscountTypes } from '../hooks/useDiscountTypes';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
  InputAdornment,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface Props {
  value: DiscountType | '';
  onChange: (type: DiscountType | '') => void;
  fieldValues: Record<string, string>;
  onFieldChange: (name: string, value: string) => void;
}

export function SelectTypeDiscount({
  value,
  onChange,
  fieldValues,
  onFieldChange,
}: Props) {
  const { options } = useDiscountTypes();

  const handleChange = (e: SelectChangeEvent) => {
    onChange(e.target.value as DiscountType | '');
  };

  const config = value ? DISCOUNT_CONFIG[value] : null;

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="type-label">Tipo de descuento</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          value={value}
          label="Tipo de descuento"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Seleccione un tipo</em>
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {config?.fields.map((field) => (
        <TextField
          key={field.name}
          label={field.label}
          type={field.type}
          value={fieldValues[field.name] || ''}
          onChange={(e) => onFieldChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          slotProps={{ htmlInput: field.inputProps }}
          required={field.required}
          InputProps={
            field.adornment
              ? {
                  [`${field.adornment.position === 'start' ? 'start' : 'end'}Adornment`]:
                    <InputAdornment position={field.adornment.position}>
                      {field.adornment.text}
                    </InputAdornment>,
                }
              : undefined
          }
          fullWidth
        />
      ))}

      {config?.infoMessage && (
        <Alert severity="info">{config.infoMessage}</Alert>
      )}
    </>
  );
}