import { capitalize, isString } from "lodash";
import { numberToVietnameseText, removeAllDot } from "../Helpers";
import { PDFInitValues } from "../Pages/HouseDetail/components/GenPDF/GenPdfButton";
import moment from "moment";

export const monthlyBill = (values: PDFInitValues) => {
  const dd = {
    content: [
      {
        text: "Hóa đơn tiền dịch vụ",
        style: "header",
      },
      {
        alignment: "justify",
        columns: [
          {
            width: "*",
            text: [
              {
                text: `Từ ngày: ${values.fromDate?.format(
                  "DD/MM/YYYY"
                )} đến ${values.toDate?.format("DD/MM/YYYY")} \n`,
                style: "subheader",
              },
              {
                text: `Phòng: ${
                  isString(values?.room) ? values?.room : values?.room?.name
                } \n`,
                style: "subheader",
              },
              {
                text: `Khách hàng: ${
                  values?.guest ? values?.guest?.name : ""
                } \n`,
                style: "subheader",
              },
              {
                text: `Ngày tạo: ${moment().format("DD/MM/YYYY")} \n`,
                style: "subheader",
              },
            ],
          },
          {
            width: "*",
            text: [
              {
                text: "Tài khoản thanh toán: \n",
                style: "subheader",
              },
              {
                text: "Ngân hàng TMCP Quốc tế - VIB\n",
              },
              {
                text: "Trần Thị Mai Liên\n",
              },
              {
                text: "STK: 436889999\n",
              },
            ],
          },
        ],
      },
      {
        style: "tableExample",
        table: {
          widths: [30, 150, "*", "*", "*", 100],
          body: [
            [
              {
                text: "STT",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Dịch vụ",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Đơn vị",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Số lượng",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Giá",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Thành tiền",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
            ],
            ...values.bill.map((elm, index) => {
              return [
                {
                  text: index + 1,
                  alignment: "center",
                },
                {
                  text: elm.name,
                  alignment: "center",
                },
                {
                  text: elm.unit,
                  alignment: "center",
                },
                {
                  text: elm.quantity,
                  alignment: "center",
                },
                {
                  text: elm.unitPrice,
                  alignment: "center",
                },
                {
                  text: elm.price,
                  alignment: "right",
                },
              ];
            }),
            [
              {
                text: "Tổng cộng",
                colSpan: 5,
                style: "subheader",
                fillColor: "#eeffee",
                alignment: "center",
              },
              "",
              "",
              "",
              "",
              {
                text: `${values.bill
                  .reduce(
                    (total, item) =>
                      total + Number(removeAllDot(`${item.price}`)),
                    0
                  )
                  .toLocaleString("vi-VN")} VND`,
                style: "subheader",
                fillColor: "#eeffee",
                alignment: "right",
              },
            ],
          ],
        },
      },
      {
        text:
          "Tổng tiền bằng chữ: " +
          `${capitalize(
            numberToVietnameseText(
              +values.bill.reduce(
                (total, item) => total + Number(removeAllDot(`${item.price}`)),
                0
              )
            )
          )} đồng.`,
        style: "subheader",
      },
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      subHeaderCenter: {
        fontSize: 16,
        bold: true,
        margin: [0, 5, 0, 20],
        alignment: "center",
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 20, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
  };

  return dd;
};

export const compareBill = (
  currentMonth: PDFInitValues,
  lastMonth: PDFInitValues
) => {
  console.log("data", { currentMonth, lastMonth });
  const dd = {
    content: [
      {
        text: "Hóa đơn tiền dịch vụ",
        style: "header",
      },
      {
        alignment: "justify",
        columns: [
          {
            width: "*",
            text: [
              {
                text: `Từ ngày: ${currentMonth.fromDate?.format(
                  "DD/MM/YYYY"
                )} đến ${currentMonth.toDate?.format("DD/MM/YYYY")} \n`,
                style: "subheader",
              },
              {
                text: `Phòng: ${
                  isString(currentMonth?.room)
                    ? currentMonth?.room
                    : currentMonth?.room?.name
                } \n`,
                style: "subheader",
              },
              {
                text: `Khách hàng: ${
                  currentMonth?.guest ? currentMonth?.guest?.name : ""
                } \n`,
                style: "subheader",
              },
              {
                text: `Ngày tạo: ${moment().format("DD/MM/YYYY")} \n`,
                style: "subheader",
              },
            ],
          },
          {
            width: "*",
            text: [
              {
                text: "Tài khoản thanh toán: \n",
                style: "subheader",
              },
              {
                text: "Ngân hàng TMCP Quốc tế - VIB\n",
              },
              {
                text: "Trần Thị Mai Liên\n",
              },
              {
                text: "STK: 436889999\n",
              },
            ],
          },
        ],
      },
      {
        style: "tableExample",
        table: {
          widths: [30, 150, "*", "*", "*", 100],
          body: [
            [
              {
                text: "STT",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Dịch vụ",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Đơn vị",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Số lượng",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Giá",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Thành tiền",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
            ],
            ...currentMonth.bill.map((elm, index) => {
              return [
                {
                  text: index + 1,
                  alignment: "center",
                },
                {
                  text: elm.name,
                  alignment: "center",
                },
                {
                  text: elm.unit,
                  alignment: "center",
                },
                {
                  text: elm.quantity,
                  alignment: "center",
                },
                {
                  text: elm.unitPrice,
                  alignment: "center",
                },
                {
                  text: elm.price,
                  alignment: "right",
                },
              ];
            }),
            [
              {
                text: "Tổng cộng",
                colSpan: 5,
                style: "subheader",
                fillColor: "#eeffee",
                alignment: "center",
              },
              "",
              "",
              "",
              "",
              {
                text: `${currentMonth.bill
                  .reduce(
                    (total, item) =>
                      total + Number(removeAllDot(`${item.price}`)),
                    0
                  )
                  .toLocaleString("vi-VN")} VND`,
                style: "subheader",
                fillColor: "#eeffee",
                alignment: "right",
              },
            ],
          ],
        },
      },
      {
        text:
          "Tổng tiền bằng chữ: " +
          `${capitalize(
            numberToVietnameseText(
              +currentMonth.bill.reduce(
                (total, item) => total + Number(removeAllDot(`${item.price}`)),
                0
              )
            )
          )} đồng.`,
        style: "subheader",
      },
      {
        style: "tableExample",
        table: {
          widths: [30, "*", 50, 45, 45, "*", 65, 65],
          body: [
            [
              {
                text: "STT",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
                rowSpan: 2,
              },
              {
                text: "Dịch vụ",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
                rowSpan: 2,
              },
              {
                text: "Đơn vị",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
                rowSpan: 2,
              },
              {
                text: "Số lượng",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
                colSpan: 2,
              },
              "",
              {
                text: "Giá",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
                rowSpan: 2,
              },
              {
                text: "Thành tiền",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
                colSpan: 2,
              },
              "",
            ],
            [
              "",
              "",
              "",
              {
                text: `${lastMonth?.fromDate?.format("T MM/YYYY")}`,
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: `${currentMonth?.fromDate?.format("T MM/YYYY")}`,
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              "",
              {
                text: `${lastMonth?.fromDate?.format("T MM/YYYY")}`,
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: `${currentMonth?.fromDate?.format("T MM/YYYY")}`,
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
            ],
            ...currentMonth.bill.map((elm, index) => {
              const elmLastMonth = lastMonth.bill.find(
                (item) => item.name === elm.name
              );
              return [
                {
                  text: index + 1,
                  alignment: "center",
                },
                {
                  text: elm.name,
                  alignment: "center",
                },
                {
                  text: elm.unit,
                  alignment: "center",
                },
                {
                  text: elmLastMonth?.quantity || "0",
                  alignment: "center",
                  fillColor: "#c7f6ff",
                },
                {
                  text: elm?.quantity || "0",
                  alignment: "center",
                  fillColor: "#c7ffd0",
                },
                {
                  text: elm.unitPrice,
                  alignment: "center",
                },
                {
                  text: elmLastMonth?.price || "0",
                  alignment: "center",
                  fillColor: "#c7f6ff",
                },
                {
                  text: elm.price,
                  alignment: "right",
                  fillColor: "#c7ffd0",
                },
              ];
            }),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      subHeaderCenter: {
        fontSize: 16,
        bold: true,
        margin: [0, 5, 0, 20],
        alignment: "center",
      },
      subheader: {
        fontSize: 12,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableExample: {
        margin: [0, 20, 0, 15],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
  };

  return dd;
};
