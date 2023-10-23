import { memo } from "react";
import { TableCell, TableRow } from "./table";
import { Invoice } from "@/types/Invoice";

type itemTableProps = {
  data: Invoice;
};

const ItemComponent = (props: itemTableProps) => {
  return (
    <TableRow>
      <TableCell>{props.data.governmentId}</TableCell>
      <TableCell>{props.data.name}</TableCell>
      <TableCell className="font-medium">{props.data.debtId}</TableCell>
      <TableCell>{props.data.debtDueDate}</TableCell>
      <TableCell className="text-right">$ {props.data.debtAmount}</TableCell>
      <TableCell>{props.data.email}</TableCell>
    </TableRow>
  );
};

export const TableItem = memo(ItemComponent);
