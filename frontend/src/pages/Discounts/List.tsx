import { useEffect } from 'react';
import { discountsApi } from '../../api/discountAPI';
import { useAsync } from '../../hooks/useAsync';
import { useDiscountTypes } from '../../hooks/useDiscountTypes';
import type { Discount } from '../../api/types';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  onNavigateToSimulator: (discountId?: string) => void;
  onNavigateToDetails: (discountId: string) => void;
}

export function DiscountListPage({ onNavigateToSimulator, onNavigateToDetails }: Props) {
  const loadingState = useAsync<Discount[]>();
  const deleteState = useAsync<void>();
  const { getLabel, getFormattedValue } = useDiscountTypes();

  useEffect(() => {
    loadingState.execute(() => discountsApi.getAll()).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (discountId: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el descuento "${name}"?`)) {
      return;
    }

    try {
      await deleteState.execute(() => discountsApi.delete(discountId));
      await loadingState.execute(() => discountsApi.getAll());
    } catch {
      // Error handled by useAsync
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Listado de Descuentos
      </Typography>

      {loadingState.loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {loadingState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {loadingState.error}
        </Alert>
      )}

      {!loadingState.loading && !loadingState.error && (!loadingState.data || loadingState.data.length === 0) && (
        <Alert severity="info">No hay descuentos registrados.</Alert>
      )}

      {loadingState.data && loadingState.data.length > 0 && (
        <Box>
          {deleteState.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Error al eliminar: {deleteState.error}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingState.data.map((d) => (
                  <TableRow key={d._discountId} hover>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{d._discountId}</TableCell>
                    <TableCell>{d._name}</TableCell>
                    <TableCell>{getLabel(d._typeDiscount)}</TableCell>
                    <TableCell>{getFormattedValue(d)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} justifyContent="center">
                        <Tooltip title="Simular">
                          <IconButton
                            color="primary"
                            onClick={() => onNavigateToSimulator(d._discountId)}
                            size="small"
                          >
                            <CalculateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ver Detalles">
                          <IconButton
                            color="info"
                            onClick={() => onNavigateToDetails(d._discountId)}
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(d._discountId, d._name)}
                            disabled={deleteState.loading}
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}