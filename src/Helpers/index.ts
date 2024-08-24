import { capitalize, isString } from "lodash";
import moment from "moment";

export const processNavLabel = (label: string) => {
  return label
    .split("_")
    .map((w) => capitalize(w.toLocaleLowerCase()))
    .join(" ");
};

export const processDelay = (callback: () => void) => {
  const randomDelay = Math.floor(Math.random() * 1000 + 500);

  return new Promise((res) => {
    setTimeout(() => {
      callback();
      res("success");
    }, randomDelay);
  });
};

export const formatDate = (date: Date, format = "Do MMMM YYYY") => {
  return moment(date).format(format);
};

export const removeAllDot = (str: string) => {
  if(!str) return 0
  return str.replace(/\./g, "");
};

export function numberToVietnameseText(number: number) {
  const units = ["", "ngàn", "triệu", "tỷ"];
  const textNumbers = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];

  const convertNumberToText = (num: number) => {
    if (num === 0) return "không";
    let result = "";
    let unit = 0;
    while (num > 0) {
      let part = num % 1000;
      if (part > 0) {
        result = convertHundreds(part) + " " + units[unit] + " " + result;
      }
      num = Math.floor(num / 1000);
      unit++;
    }
    return result.trim().replace(/\s+/g, " ");
  };

  const convertHundreds = (num: number) => {
    const hundred = Math.floor(num / 100);
    const ten = Math.floor((num % 100) / 10);
    const unit = num % 10;

    let result = "";
    if (hundred > 0) result += textNumbers[hundred] + " trăm ";
    if (ten > 1) result += textNumbers[ten] + " mươi ";
    if (ten === 1) result += "mười ";
    if (unit > 0)
      result += (ten > 0 && unit === 1 ? "mốt" : textNumbers[unit]) + " ";
    return result.trim();
  };

  return convertNumberToText(number).replace(/\s+/g, " ").trim();
}

export function removeNullAndUndefinedFromObject(obj: any) {
  return Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined)
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}

export function convertFileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Event handler when reading is successful
    reader.onload = () => {
      if (!reader?.result || !isString(reader.result)) reject("No result");
      resolve(reader?.result);
    };

    // Event handler for errors
    reader.onerror = (error) => {
      reject(error);
    };

    // Read the file as a Data URL (Base64)
    reader.readAsDataURL(file);
  });
}

export const isDefined = (value: any) => {
  return value !== null && value !== undefined;
};

export function urlToBase64(url: string, callback: any) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    const reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.send();
}
