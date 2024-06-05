import { useCallback } from 'react';
import { showToast } from '../Components/Toast';

const useToast = () => {
  const toastSuccess = useCallback((message: string, duration?: number) => {
    showToast('success', message, duration);
  }, []);

  const toastError = useCallback((message: string, duration?: number) => {
    showToast('error', message, duration);
  }, []);

  const toastWarn = useCallback((message: string, duration?: number) => {
    showToast('warn', message, duration);
  }, []);

  const toastInfo = useCallback((message: string, duration?: number) => {
    showToast('info', message, duration);
  }, []);

  return {
    toastSuccess,
    toastError,
    toastWarn,
    toastInfo,
  };
};

export default useToast;
