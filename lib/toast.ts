import { toast } from "sonner";

export const showToast = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg, { duration: 6000 }),
  warning: (msg: string) => toast.warning(msg),
  info: (msg: string) => toast.info(msg),
  promise: <T>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => toast.promise(promise, msgs),
};
