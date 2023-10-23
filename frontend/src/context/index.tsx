import { createContext, useContext, useReducer } from "react";

import { FileActionType } from "@/constants";
import {
  FileAction,
  FileContextState,
  FileDispatch,
  FileProviderProps,
} from "@/types";

export const FileContextInitialValues: Partial<FileContextState> = {
  file: {} as File,
  isLoading: false,
};

const FileContext = createContext<{
  state: FileContextState;
  dispatch: FileDispatch;
}>({
  state: FileContextInitialValues as FileContextState,
  dispatch: () => {},
});

const FileReducer = (
  state: FileContextState,
  action: FileAction
): FileContextState => {
  const { type, payload } = action;

  switch (type) {
    case FileActionType.SET_UPLOAD_FILE: {
      //@ts-ignore
      return { ...state, file: payload?.file };
    }
    case FileActionType.SET_FILE_LIST: {
      console.log("set file list");
      // Create the action return
      //@ts-ignore
      return { ...state, fileList: payload?.fileList };
    }
    case FileActionType.SET_IS_LOADING: {
      //@ts-ignore
      return { ...state, isLoading: payload?.isLoading };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const FileProvider = ({ children }: FileProviderProps) => {
  const [state, dispatch] = useReducer(
    FileReducer,
    FileContextInitialValues as FileContextState
  );

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

const useFileContext = () => {
  const context = useContext(FileContext);

  if (context === undefined)
    throw new Error("useFileContext must be used within a FileProvider");

  return context;
};

export { FileProvider, useFileContext };
