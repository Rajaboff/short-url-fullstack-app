import React, { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./ShortenUrlForm.css";
import { baseApiUrl } from "../../environment";
import { useMutation } from "@tanstack/react-query";

export interface ShortData {
  shortenedUrl: string;
}

interface MutationData {
  alias: string;
  expiresAt: string;
  originalUrl: string;
}

const ShortenUrlForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const { mutate, data, isPending } = useMutation<
    string,
    AxiosError,
    MutationData
  >({
    mutationFn: ({ originalUrl, alias, expiresAt }) =>
      axios
        .post(`${baseApiUrl}/shorten`, {
          originalUrl,
          alias,
          expiresAt,
        })
        .then((res) => {
          toast.success("Ссылка успешно сокращена!");
          return res.data.shortenedUrl;
        }),
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { error?: string })?.error ||
        "Ошибка при создании короткой ссылки";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (originalUrl) {
        mutate({ originalUrl, expiresAt, alias });
      }
    },
    [originalUrl, expiresAt, alias, mutate]
  );

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
        <h2 className="form-title">Сократить ссылку</h2>

        <div className="form-group">
          <label htmlFor="originalUrl">Исходная ссылка</label>
          <input
            type="url"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            placeholder="Введите ссылку"
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiresAt">Срок действия (опционально)</label>
          <input
            type="datetime-local"
            id="expiresAt"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="alias">Пользовательский алиас (опционально)</label>
          <input
            type="text"
            id="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            maxLength={20}
            placeholder="Введите алиас (макс. 20 символов)"
          />
        </div>

        <button type="submit" disabled={isPending} className="submit-btn">
          {isPending ? "Загрузка..." : "Сократить"}
        </button>

        {data && (
          <div className="result">
            <p>Ваша короткая ссылка:</p>
            <a href={data} target="_blank" rel="noopener noreferrer">
              {data}
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default ShortenUrlForm;
