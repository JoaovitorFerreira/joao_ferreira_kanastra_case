export type Invoice = {
  debtAmount: number;
  debtDueDate: string;
  debtId: string;
  email: string;
  governmentId: number;
  id: number;
  name: string;
};

export type PaginatedInvoice = {
  items: Invoice[];
  page: number;
  pages: number;
  size: number;
  total: number;
};
