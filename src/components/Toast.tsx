import { toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: '#4f5902',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#4f5902',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: '#fff',
        color: '#dc2626',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #dc2626',
      },
    });
  },
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: '#fff',
        color: '#4f5902',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  },
};