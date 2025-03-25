import React, { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import { baseApiUrl } from "../../environment";
import { useMutation } from "@tanstack/react-query";

export interface InfoData {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

interface MutationData {
  alias: string;
}

const ShortenUrlInfoForm = () => {
  const [shortenedUrl, setShortenedUrl] = useState("");

  const { mutate, data, isPending, reset } = useMutation<
    InfoData,
    AxiosError,
    MutationData
  >({
    mutationFn: ({ alias }) =>
      axios.get(`${baseApiUrl}/info/${alias}`).then((res) => {
        return res.data;
      }),
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { error?: string })?.error ||
        "Ошибка при получении информации о ссылке";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const alias = shortenedUrl.split("/").pop() || "";

      if (alias) {
        mutate({ alias });
      }
    },
    [mutate, shortenedUrl]
  );

  const handleDelete = async () => {
    try {
      const alias = shortenedUrl.split("/").pop() || "";
      await axios.delete(`${baseApiUrl}/delete/${alias}`);
      toast.success("Ссылка успешно удалена");
      setShortenedUrl("");
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Ошибка при удалении ссылки");
    }
  };

  return (
    <div className="shorten-url-form-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <form onSubmit={handleSubmit} className="shorten-url-form">
        <h2 className="form-title">Данные ссылки</h2>

        <div className="form-group">
          <label htmlFor="originalUrl">Ссылка</label>
          <input
            type="url"
            id="originalUrl"
            value={shortenedUrl}
            onChange={(e) => setShortenedUrl(e.target.value)}
            required
            placeholder="Введите ссылку"
          />
        </div>

        <button type="submit" disabled={isPending} className="submit-btn">
          {isPending ? "Загрузка..." : "Получить данные"}
        </button>

        {data && (
          <div className="link-info">
            <p>Основной урл: {data.originalUrl}</p>
            <p>Создано: {new Date(data.createdAt).toLocaleString()}</p>
            <p>Кол-во переходов: {data.clickCount}</p>

            <button className="delete-btn" onClick={handleDelete}>
              Удалить ссылку
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ShortenUrlInfoForm;
