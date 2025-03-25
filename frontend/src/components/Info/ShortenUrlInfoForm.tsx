import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { baseApiUrl } from "../../environment";

export interface InfoData {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

const ShortenUrlInfoForm = () => {
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [urlInfo, setUrlInfo] = useState<InfoData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const alias = shortenedUrl.split("/").pop() || "";
      const response = await axios.get(`${baseApiUrl}/info/${alias}`);

      setUrlInfo(response.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          "Ошибка при получении информации о ссылке"
      );
    }
  };

  const handleDelete = async () => {
    try {
      const alias = shortenedUrl.split("/").pop() || "";
      await axios.delete(`${baseApiUrl}/delete/${alias}`);
      toast.success("Ссылка успешно удалена");
      setShortenedUrl("");
      setUrlInfo(null);
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

        <button type="submit" className="submit-btn">
          Получить
        </button>

        {urlInfo && (
          <div className="link-info">
            <p>Основной урл: {urlInfo.originalUrl}</p>
            <p>Создано: {new Date(urlInfo.createdAt).toLocaleString()}</p>
            <p>Кол-во переходов: {urlInfo.clickCount}</p>

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
