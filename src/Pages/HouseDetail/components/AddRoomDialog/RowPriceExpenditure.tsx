import { useFormikContext } from "formik";
import CommonStyles from "../../../../Components/CommonStyles";
import { useEffect } from "react";
import { removeAllDot } from "../../../../Helpers";
import { RoomInitValues } from "../AddRoomButton";

interface IRowPriceExpenditure {
  rowIndex: number;
}

const RowPriceExpenditure = (props: IRowPriceExpenditure) => {
  //! State
  const { rowIndex } = props;
  const { values, setFieldValue } = useFormikContext<RoomInitValues>();

  //! Function
  useEffect(() => {
    if (!values.expenditures) return;
    const price =
      values.expenditures[rowIndex].quantity *
      +removeAllDot(`${values.expenditures[rowIndex].unitPrice}`);
    setFieldValue(
      `expenditures.${rowIndex}.price`,
      price.toLocaleString("vi-VN")
    );
  }, [
    values?.expenditures?.[rowIndex].quantity,
    values?.expenditures?.[rowIndex].unitPrice,
  ]);

  //! Render
  return (
    <CommonStyles.Typography type="bold14">
      {values?.expenditures?.[rowIndex].price} VND
    </CommonStyles.Typography>
  );
};

export default RowPriceExpenditure;
