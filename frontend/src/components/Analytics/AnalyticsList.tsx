import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "./AnalyticsList.css";
import { baseApiUrl } from "../../environment";

export interface AnalyticsData {
  id: number;
  ip: string;
  shortUrl: string;
  clickCount: number;
  alias: string;
  createdAt: string;
  updatedAt: string;
}

const AnalyticsList = () => {
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [dataList, setDataList] = useState<AnalyticsData[]>([]);
  const [dataCount, setDataCount] = useState(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setDataList([]);

    try {
      const alias = shortenedUrl.split("/").pop() || "";
      const response = await axios.get(`${baseApiUrl}/analytics/${alias}`, {
        params: { limit: dataCount },
      });

      const analytics: AnalyticsData[] = response.data?.data;

      if (analytics?.length > 0) {
        setDataList(analytics);
      } else {
        toast.info("Нет данных для отображения");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Ошибка при получении списка данных"
      );
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
            value={dataCount}
            onChange={(e) => setDataCount(Number(e.target.value) || 5)}
            required
            placeholder="Введите кол-во"
          />
        </div>

        <button type="submit" className="submit-btn">
          Получить данные
        </button>

        {dataList.length > 0 && (
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
              {dataList.map((data: any) => (
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
