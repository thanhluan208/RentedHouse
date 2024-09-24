import { useFormikContext } from "formik";
import { PDFInitValues } from "./CreateBillButton";
import CommonStyles from "../../../../Components/CommonStyles";
import { useEffect } from "react";
import { removeAllDot } from "../../../../Helpers";
import { BillQuantityType } from "../../../../Interfaces/common";

interface IRowPrice {
  rowIndex: number;
}

const RowPrice = (props: IRowPrice) => {
  //! State
  const { rowIndex } = props;
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const currentBill = values.bill[rowIndex];
  const { type, quantity, unitPrice, endMonthQuantity, startMonthQuantity } =
    currentBill;
  //! Function
  useEffect(() => {
    let price = 0;
    if (type === BillQuantityType.MONTH) {
      price = (quantity ?? 0) * +removeAllDot(`${unitPrice ?? 0}`);
    } else {
      price = (endMonthQuantity ?? 0) - (startMonthQuantity ?? 0);
      price *= +removeAllDot(`${unitPrice ?? 0}`);
    }

    setFieldValue(
      `bill.${rowIndex}.price`,
      Math.round(price).toLocaleString("vi-VN")
    );
  }, [
    type,
    quantity,
    unitPrice,
    endMonthQuantity,
    startMonthQuantity,
    rowIndex,
  ]);

  //! Render
  return (
    <CommonStyles.Typography type="bold14">
      {values.bill[rowIndex].price} VND
    </CommonStyles.Typography>
  );
};

export default RowPrice;
