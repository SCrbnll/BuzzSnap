import { Toaster, toast } from "sonner";

const NotificationProvider: React.FC = () => {
  return <Toaster position="bottom-right" richColors expand={false} />;
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    duration: 3000, 
  });
};

export const notifySuccessDescription = (message: string, description: string) => {
    toast.success(message, {
        description: description,
        duration: 3000, 
    });
};

export const notifyError = (message: string) => {
  toast.error(message, {
    duration: 4000,
  });
};

export const notifyErrorDescription = (message: string, description: string) => {
    toast.success(message, {
        description: description,
        duration: 3000, 
    });
};


export function notifyPromise<T>(
  promiseFunction: () => Promise<T>,
  messages?: {
    loading?: string;
    success?: (data: T) => string;
    error?: string;
  }
): Promise<T> {
  return new Promise((resolve, reject) => {
    toast
      .promise(promiseFunction(), {
        loading: messages?.loading || "Cargando...",
        success: (data) => {
          resolve(data); 
          return messages?.success ? messages.success(data) : "Operación exitosa";
        },
        error: (error) => {
          reject(error); 
          return messages?.error || "Ocurrió un error";
        },
      })
  });
}

  


export default NotificationProvider;
