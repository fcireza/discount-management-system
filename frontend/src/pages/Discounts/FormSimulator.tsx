import { useState, useEffect } from 'react';
import { discountsApi } from '../../api/discountAPI';
import { useAsync } from '../../hooks/useAsync';
import { useDiscountTypes } from '../../hooks/useDiscountTypes';
import type { Discount, ApplyDiscountResponse } from '../../api/types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalculateIcon from '@mui/icons-material/Calculate';

interface Props {
  discountId?: string;
  onNavigateToList: () => void;
}

export function FormSimulatorPage({ discountId, onNavigateToList }: Props) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const loadingDiscounts = useAsync<Discount[]>();
  const calculating = useAsync<ApplyDiscountResponse>();
  const { getLabel } = useDiscountTypes();

  useEffect(() => {
    loadingDiscounts.execute(() => discountsApi.getAll())
      .then((data) => {
        setDiscounts(data);
        if (discountId && data.some(d => d._discountId === discountId)) {
          setSelectedDiscountId(discountId);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountId]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscountId || !unitPrice || !quantity) return;

    try {
      await calculating.execute(() =>
        discountsApi.applyDiscount({
          discountId: selectedDiscountId,
          unitPrice: parseFloat(unitPrice),
          quantity: parseInt(quantity, 10),
        })
      );
    } catch {
      // Error already handled by useAsync
    }
  };

  const isValid = selectedDiscountId !== '' && unitPrice !== '' && quantity !== '';
  const selectedDiscount = discounts.find(d => d._discountId === selectedDiscountId);

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
            Simulador de Descuento
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {loadingDiscounts.loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {loadingDiscounts.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loadingDiscounts.error}
            </Alert>
          )}

          {!loadingDiscounts.loading && discounts.length === 0 && (
            <Alert severity="info">
              No hay descuentos disponibles para simular.
            </Alert>
          )}

          {discounts.length > 0 && (
            <Box component="form" onSubmit={handleCalculate}>
              <Stack spacing={3}>
                <FormControl fullWidth required>
                  <InputLabel id="discount-label">Seleccionar descuento</InputLabel>
                  <Select
                    labelId="discount-label"
                    id="discount"
                    value={selectedDiscountId}
                    label="Seleccionar descuento"
                    onChange={(e: SelectChangeEvent) => setSelectedDiscountId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>-- Seleccione un descuento --</em>
                    </MenuItem>
                    {discounts.map((d) => (
                      <MenuItem key={d._discountId} value={d._discountId}>
                        {d._name} — {getLabel(d._typeDiscount)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Precio unitario"
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="Ej: 50"
                  slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                  fullWidth
                />

                <TextField
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ej: 3"
                  slotProps={{ htmlInput: { min: 1, step: 1 } }}
                  required
                  fullWidth
                />

                {calculating.error && (
                  <Alert severity="error">{calculating.error}</Alert>
                )}

                <Button
                  variant="contained"
                  type="submit"
                  disabled={calculating.loading || !isValid}
                  startIcon={
                    calculating.loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <CalculateIcon />
                    )
                  }
                >
                  {calculating.loading ? 'Calculando...' : 'Calcular'}
                </Button>
              </Stack>
            </Box>
          )}

          {calculating.data && selectedDiscount && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Resultado — {selectedDiscount._name}
              </Typography>

              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Total original</strong></TableCell>
                    <TableCell align="right"><strong>${calculating.data.originalTotal}</strong></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Precio c/u</TableCell>
                    <TableCell align="right">${unitPrice}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cantidad</TableCell>
                    <TableCell align="right">{quantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Descuento aplicado</TableCell>
                    <TableCell align="right" sx={{ color: 'error.main' }}>
                      -${calculating.data.discountedApplied}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Total final</strong></TableCell>
                    <TableCell align="right" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      ${calculating.data.finalTotal}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
