import { useState } from 'react';
import { SelectTypeDiscount } from '../../components/selectTypeDiscount';
import { discountsApi } from '../../api/discountAPI';
import { useAsync } from '../../hooks/useAsync';
import { DISCOUNT_CONFIG } from '../../config/discountConfig';
import type { DiscountType, CreateDiscountRequest } from '../../api/types';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Divider,
  Stack,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
  onNavigateToList: () => void;
}

export function DiscountFormPage({ onNavigateToList }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<DiscountType | ''>('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const createState = useAsync<void>();

  const isValid = name.trim() !== '' && type !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const config = DISCOUNT_CONFIG[type as DiscountType];
    const numericFields: Record<string, number> = {};
    config.fields.forEach((field) => {
      if (field.type === 'number') {
        numericFields[field.name] = parseFloat(fieldValues[field.name]) || 0;
      }
    });

    try {
      await createState.execute(() =>
        discountsApi.create({
          name: name.trim(),
          type: type as DiscountType,
          ...numericFields,
        } as CreateDiscountRequest)
      );
      onNavigateToList();
    } catch {
      // Error handled by useAsync
    }
  };

  const handleTypeChange = (newType: DiscountType | '') => {
    setType(newType);
    setFieldValues({});
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={onNavigateToList}
        sx={{ mb: 2 }}
      >
        Volver al listado
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Crear Descuento
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {createState.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createState.error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del descuento"
                required
                fullWidth
              />

              <SelectTypeDiscount
                value={type}
                onChange={handleTypeChange}
                fieldValues={fieldValues}
                onFieldChange={(name, value) =>
                  setFieldValues((prev) => ({ ...prev, [name]: value }))
                }
              />

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  type="submit"
                  color='success'
                  disabled={createState.loading || !isValid}
                  startIcon={
                    createState.loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveIcon />
                    )
                  }
                >
                  {createState.loading ? 'Creando...' : 'Crear Descuento'}
                </Button>
                <Button variant="outlined" color='error' onClick={onNavigateToList}>
                  Cancelar
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}