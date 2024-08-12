import { useFormikContext } from "formik";
import { PDFInitValues } from "./GenPdfButton";
import CommonStyles from "../../../../Components/CommonStyles";
import { useEffect } from "react";
import { removeAllDot } from "../../../../Helpers";

interface IRowPrice {
  rowIndex: number;
}

const RowPrice = (props: IRowPrice) => {
  //! State
  const { rowIndex } = props;
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();

  //! Function
  useEffect(() => {
    const price =
      values.bill[rowIndex].quantity *
      +removeAllDot(`${values.bill[rowIndex].unitPrice}`);
    setFieldValue(`bill.${rowIndex}.price`, price.toLocaleString('vi-VN'));
  }, [values.bill[rowIndex].quantity, values.bill[rowIndex].unitPrice]);

  //! Render
  return (
    <CommonStyles.Typography type="bold14">
      {values.bill[rowIndex].price} VND
    </CommonStyles.Typography>
  );
};

export default RowPrice;
