import { useEffect } from 'react';
import { discountsApi } from '../../api/discountAPI';
import { useAsync } from '../../hooks/useAsync';
import { useDiscountTypes } from '../../hooks/useDiscountTypes';
import { DISCOUNT_CONFIG } from '../../config/discountConfig';
import type { Discount } from '../../api/types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Typography,
  Divider,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Props {
  discountId: string;
  onNavigateToList: () => void;
}

export function DiscountDetailsPage({ discountId, onNavigateToList }: Props) {
  const loadingState = useAsync<Discount>();
  const { getLabel, getFormattedValue } = useDiscountTypes();

  useEffect(() => {
    loadingState.execute(() => discountsApi.getById(discountId)).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountId]);

  const data = loadingState.data;

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

      <Card style={{width:'auto', maxWidth: 800,justifyContent:'center', margin:'0 auto'}}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Detalles del Descuento
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {loadingState.loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {loadingState.error && (
            <Alert severity="error">Error: {loadingState.error}</Alert>
          )}

          {data && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">ID</Typography>
                <Typography>{data._discountId}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
                <Typography>{data._name}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Tipo de Descuento</Typography>
                <Typography>{getLabel(data._typeDiscount)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Valor</Typography>
                <Typography>{getFormattedValue(data)}</Typography>
              </Box>

              {DISCOUNT_CONFIG[data._typeDiscount]?.fields.map((field) => {
                const value = (data as unknown as Record<string, unknown>)[field.responseField];
                return value != null ? (
                  <Box key={field.name}>
                    <Typography variant="subtitle2" color="text.secondary">{field.label}</Typography>
                    <Typography>
                      {field.adornment?.position === 'start' && field.adornment.text}
                      {String(value)}
                      {field.adornment?.position === 'end' && field.adornment.text}
                    </Typography>
                  </Box>
                ) : null;
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
