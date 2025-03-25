import React, { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./AnalyticsList.css";
import { baseApiUrl } from "../../environment";
import { useMutation } from "@tanstack/react-query";

export interface AnalyticsData {
  id: number;
  ip: string;
  shortUrl: string;
  clickCount: number;
  alias: string;
  createdAt: string;
  updatedAt: string;
}

interface MutationData {
  alias: string;
  limit: number;
}

const AnalyticsList = () => {
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [limit, setLimit] = useState(5);

  const { mutate, data, isPending } = useMutation<
    AnalyticsData[],
    AxiosError,
    MutationData
  >({
    mutationFn: ({ alias, limit }) =>
      axios
        .get(`${baseApiUrl}/analytics/${alias}`, {
          params: { limit },
        })
        .then((res) => {
          const data = res.data?.data;

          if (!data?.length) {
            toast.info("Нет данных для отображения");
          }

          return data;
        }),
    onError: (error: AxiosError) => {
      toast.error(
        (error.response?.data as { error?: string })?.error ||
          "Ошибка при получении списка данных"
      );
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const alias = shortenedUrl.split("/").pop() || "";

      if (alias) {
        mutate({ alias, limit });
      }
    },
    [shortenedUrl, limit, mutate]
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
        <h2 className="form-title">Аналитика</h2>

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

        <div className="form-group">
          <label htmlFor="originalUrl">Кол-во отображаемых данных</label>
          <input
            type="number"
            id="originalUrl"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value) || 5)}
            required
            placeholder="Введите кол-во"
          />
        </div>

        <button type="submit" disabled={isPending} className="submit-btn">
          {isPending ? "Загрузка..." : "Получить данные"}
        </button>

        {data && data?.length > 0 && (
          <table className="analytics-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>IP</th>
                <th>Короткий урл</th>
                <th>Переходы</th>
                <th>Последний переход</th>
              </tr>
            </thead>
            <tbody>
              {data.map((data: any) => (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.ip}</td>
                  <td>
                    <a
                      href={data.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.shortUrl}
                    </a>
                  </td>
                  <td>{data.clickCount}</td>

                  <td>{new Date(data.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </form>
    </div>
  );
};

export default AnalyticsList;
