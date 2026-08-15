import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { TOAST_DURATION_MS } from "../game/constants";

interface Toast {
  id: number;
  message: string;
}

interface ToastOptions {
  /** Sticky toasts stay until the next reset — used to reveal the answer. */
  sticky?: boolean;
}

type ShowToast = (message: string, options?: ToastOptions) => void;

interface ToastApi {
  showToast: ShowToast;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const showToast = useCallback<ShowToast>((message, options) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);

    if (!options?.sticky) {
      const timer = setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        timers.current.delete(timer);
      }, TOAST_DURATION_MS);
      timers.current.add(timer);
    }
  }, []);

  const clearToasts = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    setToasts([]);
  }, []);

  const api = useMemo(
    () => ({ showToast, clearToasts }),
    [showToast, clearToasts]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toaster" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
