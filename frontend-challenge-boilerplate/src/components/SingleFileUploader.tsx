import { uploadFile } from "@/api/baseApi";
import { FileActionType } from "@/constants";
import { useFileContext } from "@/context";
import { ChangeEvent, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Toast } from "./ui/toast";
import { AlertType, ToastStateProps } from "@/types/alert";

const INITIAL_DATA_TOAST: ToastStateProps = {
  open: false,
  message: "",
  alert: AlertType.WARNING,
};

const SingleFileUploader = () => {
  const { state, dispatch } = useFileContext();
  const [openToast, setOpenToast] =
    useState<ToastStateProps>(INITIAL_DATA_TOAST);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Do not use useState to control this file change. Instead, use the FileContext
    //@ts-ignore
    const fileToUpload = e.target.files[0];
    if (fileToUpload != null) {
      dispatch({
        type: FileActionType.SET_UPLOAD_FILE,
        payload: { file: fileToUpload, isLoading: false },
      });
    }
  };

  const showToast = (alert: AlertType, message: string) => {
    setOpenToast({ open: true, alert, message });
  };
  const closeToast = () => {
    setOpenToast(INITIAL_DATA_TOAST);
  };

  const handleUpload = async () => {
    // Do your upload logic here. Remember to use the FileContext
    const formData = new FormData();
    if (state.file == null) return;
    formData.append("file_upload", state.file);
    dispatch({
      type: FileActionType.SET_IS_LOADING,
      payload: { isLoading: true },
    });
    uploadFile(formData)
      .then((result) => {
        result.ok &&
          showToast(AlertType.SUCCESS, "arquivo enviado com sucesso");
        !result.ok && showToast(AlertType.ERROR, "erro ao enviar arquivo");
      })
      .finally(() => {
        dispatch({
          type: FileActionType.SET_IS_LOADING,
          payload: { isLoading: false },
        });
      });
  };

  return (
    <div className="flex flex-col gap-6">
      {openToast.open && (
        <Toast
          alertType={openToast.alert}
          message={openToast.message}
          onCloseToast={closeToast}
          autoClose
          open={openToast.open}
        />
      )}
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input
          id="file"
          type="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          onChange={handleFileChange}
        />
      </div>
      {state.file && (
        <section>
          <p className="pb-6">File details:</p>
          <ul>
            <li>Name: {state.file.name}</li>
            <li>Type: {state.file.type}</li>
            <li>Size: {state.file.size} bytes</li>
          </ul>
        </section>
      )}
      {state.file !== null && !state.isLoading && (
        <button
          className="rounded-lg bg-green-800 text-white px-4 py-2 border-none font-semibold"
          onClick={handleUpload}
        >
          Upload the file
        </button>
      )}
      {state.isLoading && <Spinner />}
    </div>
  );
};

export { SingleFileUploader };
