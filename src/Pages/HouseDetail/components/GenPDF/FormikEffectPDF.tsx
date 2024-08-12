import { useFormikContext } from "formik";
import { PDFInitValues } from "./GenPdfButton";
import { useEffect } from "react";
import { isString } from "lodash";

const FormikEffectPDF = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const { room, bill } = values;
  //! Function
  useEffect(() => {
    if (!isString(room) && room?.price) {
      console.log("room", room);
      if (room.price) {
        bill.push({
          id: `${bill.length + 1}`,
          name: "Tiền phòng",
          price: room.price,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.price,
        });
      }

      if(room.electricityFee) {
        bill.push({
          id: `${bill.length + 1}`,
          name: "Tiền điện",
          price: room.electricityFee,
          quantity: 1,
          unit: "kWh",
          unitPrice: room.electricityFee,
        });
      }

      if(room.internetFee) {
        bill.push({
          id: `${bill.length + 1}`,
          name: "Tiền internet",
          price: room.internetFee,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.internetFee,
        });
      }

      if(room.waterFee) {
        bill.push({
          id: `${bill.length + 1}`,
          name: "Tiền nước",
          price: room.waterFee,
          quantity: 1,
          unit: "m3",
          unitPrice: room.waterFee,
        });
      }

      if(room.livingExpense) {
        bill.push({
          id: `${bill.length + 1}`,
          name: "Phí sinh hoạt",
          price: room.livingExpense,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.livingExpense,
        });
      }

      if(room.parkingFee) {
        bill.push({
          id: `${bill.length + 1}`,
          name: "Tiền đỗ xe",
          price: room.parkingFee,
          quantity: 1,
          unit: "tháng",
          unitPrice: room.parkingFee,
        });
      }

      setFieldValue("bill", bill);
    }
  }, [room]);

  //! Render
  return null;
};

export default FormikEffectPDF;
