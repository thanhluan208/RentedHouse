import { Box, } from "@mui/material";
import { FastField, useFormikContext } from "formik";
import CommonField from "../../../../Components/CommonFields";
import { BillQuantityType } from "../../../../Interfaces/common";
import { PDFInitValues } from "./GenPdfButton";

interface IInputQuantity {
  rowIndex: number;
}

const InputQuantity = (props: IInputQuantity) => {
  //! State
  const { rowIndex } = props;
  const { values } = useFormikContext<PDFInitValues>();
  //! Function

  //! Render
  if (values.bill[rowIndex].type === BillQuantityType.START_END) {
    return (
      <Box sx={{ display: "flex", gap: "10px" }}>
        <FastField
          name={`bill.${rowIndex}.startMonthQuantity`}
          placeholder="Start month quantity"
          component={CommonField.InputField}
          tooltipLabel="Start month quantity"
          type="number"
        />
        <FastField
          name={`bill.${rowIndex}.endMonthQuantity`}
          placeholder="End month quantity"
          component={CommonField.InputField}
          tooltipLabel="End month quantity"
          type="number"
        />
      </Box>
    );
  }

  return (
    <Box>
      <FastField
        name={`bill.${rowIndex}.quantity`}
        placeholder="1000"
        component={CommonField.InputField}
        type="number"
      />
    </Box>
  );
};

export default InputQuantity;
