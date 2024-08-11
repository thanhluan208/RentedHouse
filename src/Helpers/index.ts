import { Timestamp } from "firebase/firestore";
import { capitalize } from "lodash";
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

export const formatDate = (date: Timestamp, format = "Do MMMM YYYY") => {
  return moment(date.toDate()).format(format);
};

export const removeAllDot = (str: string) => {
  return str.replace(/\./g, "");
};

export function numberToVietnameseText(number: number) {
  const units = ['', 'ngàn', 'triệu', 'tỷ'];
  const textNumbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

  const convertNumberToText = (num: number) => {
      if (num === 0) return 'không';
      let result = '';
      let unit = 0;
      while (num > 0) {
          let part = num % 1000;
          if (part > 0) {
              result = convertHundreds(part) + ' ' + units[unit] + ' ' + result;
          }
          num = Math.floor(num / 1000);
          unit++;
      }
      return result.trim().replace(/\s+/g, ' ');
  };

  const convertHundreds = (num: number) => {
      const hundred = Math.floor(num / 100);
      const ten = Math.floor((num % 100) / 10);
      const unit = num % 10;

      let result = '';
      if (hundred > 0) result += textNumbers[hundred] + ' trăm ';
      if (ten > 1) result += textNumbers[ten] + ' mươi ';
      if (ten === 1) result += 'mười ';
      if (unit > 0) result += (ten > 0 && unit === 1 ? 'mốt' : textNumbers[unit]) + ' ';
      return result.trim();
  };

  return convertNumberToText(number).replace(/\s+/g, ' ').trim();
}