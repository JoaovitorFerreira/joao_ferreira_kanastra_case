import { ReactElement, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFileContext } from "@/context";
import { FileActionType } from "@/constants";
import { getFiles } from "@/api/baseApi";
import { TableItem } from "@/components/ui/tableItem";
import { Invoice } from "@/types/Invoice";
import { Spinner } from "@/components/ui/spinner";

function FileList(): ReactElement {
  const { state, dispatch } = useFileContext();

  // Remember to keep the fileList updated after upload a new file

  const getListPage = (page?: number, size?: number) => {
    const sizeToSearch = size == undefined ? 10 : size;
    const pageToSearch = page == undefined ? 1 : page;
    dispatch({
      type: FileActionType.SET_IS_LOADING,
      payload: { isLoading: true },
    });
    getFiles(pageToSearch, sizeToSearch)
      .then(async (result) => {
        const fileList = await result.json();
        result.ok &&
          dispatch({
            type: FileActionType.SET_FILE_LIST,
            payload: { fileList },
          });
      })
      .finally(() => {
        dispatch({
          type: FileActionType.SET_IS_LOADING,
          payload: { isLoading: false },
        });
      });
  };

  useEffect(() => {
    getListPage();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold pt-5 text-green-800">Invoices List</h1>
      {state.isLoading ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Spinner />
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your Invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Debt id</TableHead>
              <TableHead className="text-right">due date</TableHead>
              <TableHead>Debt amount</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.fileList! &&
              state.fileList.items.map((invoice: Invoice) => {
                return <TableItem key={invoice.id} data={invoice} />;
              })}
          </TableBody>
          {state.fileList! && (
            <div
              style={{
                display: "flex",
                width: "max-content",
                alignItems: "center",
              }}
            >
              <button
                className={`py-2 px-4 rounded-lg ${
                  state.fileList.page - 1 == 0 && "bg-green-50"
                } hover:${
                  state.fileList.page - 1 != 0 &&
                  "bg-slate-300 transition-all border border-green-500"
                }`}
                disabled={state.fileList.page - 1 == 0}
                onClick={() => getListPage(state.fileList.page - 1)}
              >
                previous
              </button>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p>
                  page: {state.fileList.page} of {state.fileList.pages}
                </p>
              </div>
              <button
                className={`py-2 px-4 rounded-lg ${
                  state.fileList.page >= state.fileList.pages && "bg-green-50"
                } hover:${
                  state.fileList.page !== state.fileList.pages &&
                  "bg-slate-300 transition-all border border-green-500"
                }`}
                disabled={state.fileList.page >= state.fileList.pages}
                onClick={() => getListPage(state.fileList.page + 1)}
              >
                next
              </button>
            </div>
          )}
        </Table>
      )}
    </>
  );
}

export { FileList };
