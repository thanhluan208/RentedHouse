import { capitalize, cloneDeep, isString } from "lodash";
import {
  convertFileToBase64,
  numberToVietnameseText,
  removeAllDot,
} from "../Helpers";
import { PDFInitValues } from "../Pages/HouseDetail/components/GenBill/GenPdfButton";
import moment from "moment";
import { BillQuantityType } from "../Interfaces/common";

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
                text: `${Math.round(
                  values.bill.reduce(
                    (total, item) =>
                      total + Number(removeAllDot(`${item.price}`)),
                    0
                  )
                ).toLocaleString("vi-VN")} VND`,
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
              Math.round(
                +values.bill.reduce(
                  (total, item) =>
                    total + Number(removeAllDot(`${item.price}`)),
                  0
                )
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

export const compareBill = async (bill: PDFInitValues) => {
  const billMonthly = cloneDeep(bill.bill).filter(
    (elm) => elm.type === BillQuantityType.MONTH
  );
  const billStartEnd = cloneDeep(bill.bill).filter(
    (elm) => elm.type === BillQuantityType.START_END
  );
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
                text: `Từ ngày: ${bill.fromDate?.format(
                  "DD/MM/YYYY"
                )} đến ${bill.toDate?.format("DD/MM/YYYY")} \n`,
                style: "subheader",
              },
              {
                text: `Phòng: ${
                  isString(bill?.room) ? bill?.room : bill?.room?.name
                } \n`,
                style: "subheader",
              },
              {
                text: `Khách hàng: ${bill?.guest ? bill?.guest?.name : ""} \n`,
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
        id: "billMonthly",
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
            ...billMonthly.map((elm, index) => {
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
                text: `${Math.round(
                  billMonthly.reduce(
                    (total, item) =>
                      total + Number(removeAllDot(`${item.price}`)),
                    0
                  )
                ).toLocaleString("vi-VN")} VND`,
                style: "subheader",
                fillColor: "#eeffee",
                alignment: "right",
              },
            ],
          ],
        },
      },
      {
        id: "billStartEnd",
        style: "tableExample",
        table: {
          widths: [30, "*", 50, 45, 45, "*", "*"],
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
                rowSpan: 2,
              },
            ],
            [
              "",
              "",
              "",
              {
                text: "Đầu kỳ",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              {
                text: "Cuối kỳ",
                style: "tableHeader",
                fillColor: "#1b752f",
                alignment: "center",
                color: "#fff",
              },
              "",
              "",
            ],
            ...billStartEnd.map((elm, index) => {
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
                  text: elm?.startMonthQuantity || "0",
                  alignment: "center",
                  fillColor: "#c7f6ff",
                },
                {
                  text: elm?.endMonthQuantity || "0",
                  alignment: "center",
                  fillColor: "#c7ffd0",
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
                colSpan: 6,
                style: "subheader",
                fillColor: "#eeffee",
                alignment: "center",
              },
              "",
              "",
              "",
              "",
              "",
              {
                text: `${Math.round(
                  billStartEnd.reduce(
                    (total, item) =>
                      total + Number(removeAllDot(`${item.price}`)),
                    0
                  )
                ).toLocaleString("vi-VN")} VND`,
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
          "Tổng tiền: " +
          `${Math.round(
            bill.bill.reduce(
              (total, item) => total + Number(removeAllDot(`${item.price}`)),
              0
            )
          ).toLocaleString("vi-VN")} VND`,
        style: "subheader",
      },
      {
        text:
          "Tổng tiền bằng chữ: " +
          `${capitalize(
            numberToVietnameseText(
              Math.round(
                +bill.bill.reduce(
                  (total, item) =>
                    total + Number(removeAllDot(`${item.price}`)),
                  0
                )
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
      imageCol: {
        margin: [0, 10, 0, 10],
      },
    },
    defaultStyle: {
      columnGap: 20,
    },
  };

  if (billMonthly.length === 0) {
    dd.content = dd.content.filter((elm) => elm.id !== "billMonthly");
  }

  if (billStartEnd.length === 0) {
    dd.content = dd.content.filter((elm) => elm.id !== "billStartEnd");
  }

  if (bill?.images?.length && bill?.images?.length > 0) {
    const listImgsPromise: any[] = [];
    bill.images.forEach((img: File) => {
      listImgsPromise.push(convertFileToBase64(img));
    });
    const listImgs = await Promise.all(listImgsPromise);

    for (let i = 0; i < listImgs.length; i += 2) {
      const imgCol: any = {
        alignment: "justify",
        columns: [],
        style: "imageCol",
      };

      if (listImgs[i]) {
        imgCol.columns.push({
          image: listImgs[i],
          width: 250,
        });
      }

      if (listImgs[i + 1]) {
        imgCol.columns.push({
          image: listImgs[i + 1],
          width: 250,
        });
      }

      dd.content.push(imgCol);
    }
  }

  return dd;
};
