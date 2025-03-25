import { v4 as uuidv4 } from "uuid";
import { ShortUrl } from "../models/shortUrl";

/**
 * Генерация уникального алиаса для короткой ссылки.
 * Используется либо переданный алиас, либо генерируется случайный ID.
 *
 * @param alias - пользовательский алиас для короткой ссылки
 * @returns уникальный алиас (или сгенерированный)
 */
export const generateAlias = (alias?: string): string => {
  return alias ? alias : uuidv4().slice(0, 8);
};

/**
 * Проверка, является ли строка валидным URL.
 *
 * @param url - строка URL
 * @returns true, если URL валиден, иначе false
 */
export const isValidUrl = (url: string): boolean => {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
  return regex.test(url);
};

/**
 * Проверка на срок действия короткой ссылки.
 *
 * @param expiresAt - дата окончания действия ссылки
 * @returns true, если ссылка еще не истекла, иначе false
 */
export const isLinkExpired = (expiresAt?: string): boolean => {
  if (!expiresAt) return false;
  const expirationDate = new Date(expiresAt);
  return expirationDate < new Date();
};


/**
 * Поиск оригинального URL по алиасу.
 *
 * @param alias - алиас короткой ссылки
 * @param urlMap - объект, где ключ - алиас, значение - оригинальный URL
 * @returns оригинальный URL, если найден, иначе undefined
 */
export const findOriginalUrl = (alias: string, urlMap: Map<string, ShortUrl>): string | undefined => {
  return urlMap.get(alias)?.originalUrl;
};