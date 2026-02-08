import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
/*
  Este hook permite manejar fácilmente operaciones asíncronas en componentes React,
  proporcionando estado para el resultado, la carga y los errores.
*/
export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setState({ data: null, loading: false, error: errorMsg });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
