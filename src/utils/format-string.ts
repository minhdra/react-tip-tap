import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat);

dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

export const formatNumber = (value: any) =>
  `${value}`.replace(/\B(?<!\.\d)(?=(\d{3})+(?!\d))/g, ",");

export const formatUrlUpload = (value?: string | null) => {
  if (value?.includes("http://") || value?.includes("https://")) return value;
  return "/api/" + value;
};

export const formatOnlyNumber = (value: string): number =>
  Number(`${value}`.replace(/[^0-9.-]/g, ""));

export const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current > dayjs().endOf("day");
};

export const handleFullName = (full_name: string) => {
  const listNames = full_name.split(" ");
  const len = listNames.length;

  const result = {
    first_name: listNames[0],
    last_name: listNames[0],
    middle_name: listNames[0],
  };

  if (len === 1) return result;
  if (len === 2) {
    result.first_name = listNames[1];
    return result;
  }
  if (len > 2) {
    result.first_name = listNames[0];
    result.middle_name = listNames.slice(1, len - 1).join(" ");
    result.last_name = listNames[len - 1];

    return result;
  }
};

export const getKeyFromPath = (path: string) => {
  if (!path) return;

  const texts = path.split("/");
  const len = texts.length;

  return texts[len - 1];
};

export const formatToDate = (strDate: string) => {
  return dayjs(strDate).isValid() ? dayjs(strDate).format(formatDateShow) : "";
};

export const getLastPath = (path: string) => {
  return path.split("/")?.[path.split("/").length - 1];
};

export const formatDateShow = "DD-MM-YYYY";
export const formatDatePost = "YYYY-MM-DD";
export const formatDateTime = "YYYY-MM-DD HH:mm:ss";

export const formatDateUTC = (date?: string, type: "date" | "time" = "date") =>
  dayjs(date, { utc: true }).format(
    type === "date" ? formatDatePost : formatDateTime,
  );

export const getTimeAgo = (date?: string) => {
  const formatted = formatDateUTC(date, "time");

  return dayjs(formatted, { locale: "vi" }).fromNow();
};

export const getDateVi = (dateStr: string) => {
  return dayjs(dateStr, formatDateShow).isValid()
    ? dayjs(dateStr, formatDateShow).format(formatDatePost)
    : null;
};

export const getDate = (dateStr?: string) => {
  if (!dateStr) return undefined;
  return dayjs(dateStr).isValid() ? dayjs(dateStr) : undefined;
};

export const getUrlToDetail = (url: string, id: string | number): string => {
  return url.replace(":id", id + "");
};

export const encodedData = (data: any): string => {
  const d = JSON.stringify(data);
  return btoa(d);
};

export const decodedData = (data: string): any => {
  return atob(data);
};

export const extractLastWord = (
  inputStr: string,
): { lastWord: string; stringWithoutLastWord: string } => {
  // Split the string into words
  const words: string[] = inputStr.split(/\s+/);

  // Extract the last word
  const lastWord: string = words.pop() || "";

  // Create a new string without the last word
  const stringWithoutLastWord: string = words.join(" ");

  return { lastWord, stringWithoutLastWord };
};

export const convertToPath = (text: string) => {
  text = removeVietnameseTones(text);
  const regex = /&|,| |\//g;
  if (text) return text.trim().toLowerCase().replace(regex, "-");

  return "";
};

export const generateUsername = (fullName: string): string => {
  // Split the full name into individual words
  const words: string[] = removeVietnameseTones(fullName).split(" ");

  // Extract the last name
  const lastName: string = words[words.length - 1];

  // Extract the first character of each name (excluding the last name)
  const initials: string = words
    .slice(0, -1)
    .map((name) => name[0])
    .join("");

  // Combine the last name and initials to create the username
  const username: string = lastName + initials;

  return username.toLowerCase(); // Convert to lowercase for consistency
};

// Function to extract src attributes from img elements in HTML
export function extractImgListSrc(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const imgElements = doc.querySelectorAll("img");
  const listSrc = Array.from(imgElements).map((img) => decodeURI(img.src));
  return listSrc;
}

export const removeVietnameseTones = (str: string) => {
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|=|<|>|\?|\/|,|:|;|'|"|&|#|\[|\]|~|\$|_|`|{|}|\||\\/g,
    " ",
  );

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();

  return str;
};
