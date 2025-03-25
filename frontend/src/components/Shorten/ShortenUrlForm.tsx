import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./ShortenUrlForm.css";
import { baseApiUrl } from "../../environment";

export interface ShortData {
  shortenedUrl: string;
}

const ShortenUrlForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseApiUrl}/shorten`, {
        originalUrl,
        alias,
        expiresAt,
      });

      setShortenedUrl(response.data.shortenedUrl);
      toast.success("Ссылка успешно сокращена!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        "Произошла ошибка при создании короткой ссылки";
      toast.error(errorMessage);
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

        <button type="submit" className="submit-btn">
          Сократить
        </button>

        {shortenedUrl && (
          <div className="result">
            <p>Ваша короткая ссылка:</p>
            <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">
              {shortenedUrl}
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default ShortenUrlForm;
