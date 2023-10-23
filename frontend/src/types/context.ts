import { ReactNode } from "react";

import { FileActionType } from "@/constants";
import { PaginatedInvoice } from "./Invoice";

export type ReducerAction<T, P> = {
  type: T;
  payload?: Partial<P>;
};


export type FileContextState = {
  isLoading: boolean;
  file: File | null;
  fileList: PaginatedInvoice; // & {} You can add more information about the challenge inside this type
};

export type FileAction = ReducerAction<
  FileActionType,
  Partial<FileContextState>
>;

export type FileDispatch = ({ type, payload }: FileAction) => void;

export type FileContextType = {
  state: FileContextState;
  dispatch: FileDispatch;
};

export type FileProviderProps = { children: ReactNode };
