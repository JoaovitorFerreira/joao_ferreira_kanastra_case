export const endpoint = "http://127.0.0.1:8000";

export const uploadFile = async (formData: FormData) => {
  const response: Response = await fetch(`${endpoint}/files`, {
    method: "POST",
    body: formData,
  });
  return response;
};

export const getFiles = async (page: number, size: number) => {
  const response: Response = await fetch(
    `${endpoint}/files?page=${page}&size=${size}`,
    {
      method: "GET",
    }
  );
  return response;
};
