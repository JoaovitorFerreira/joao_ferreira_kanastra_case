export enum AlertType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
}

export type ToastStateProps = {
  open: boolean;
  alert: AlertType;
  message: string;
};
