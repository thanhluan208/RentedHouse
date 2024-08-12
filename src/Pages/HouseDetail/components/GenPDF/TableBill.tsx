import { FastField, FieldArray, useFormikContext } from "formik";
import CommonStyles from "../../../../Components/CommonStyles";
import { Bill, PDFInitValues } from "./GenPdfButton";
import { Column } from "../../../../Components/CommonStyles/Table";
import CommonField from "../../../../Components/CommonFields";
import { Box } from "@mui/material";
import CommonIcons from "../../../../Components/CommonIcons";
import {
  numberToVietnameseText,
  removeAllDot,
} from "../../../../Helpers";
import { capitalize } from "lodash";


const TableBill = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();

  //! Function

  //! Render

  const columns: Column<Bill>[] = [
    {
      id: "id",
      label: "#",
      width: 100,
    },
    {
      id: "name",
      label: "Name",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`bill.${rowIndex}.name`}
              placeholder="Tiền điên, tiền nước..."
              component={CommonField.InputField}
            />
          </Box>
        );
      },
    },
    {
      id: "price",
      label: "Price",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`bill.${rowIndex}.price`}
              component={CommonField.InputField}
              fullWidth
              isPrice
              //   type="number"
              InputProps={{
                endAdornment: (
                  <CommonStyles.Typography type="bold14" marginRight="5px">
                    VND
                  </CommonStyles.Typography>
                ),
              }}
              placeholder="100000"
            />
          </Box>
        );
      },
    },
    {
      id: "action",
      label: "Action",
      customRender: (_, rowIndex) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <CommonStyles.Button
              isIcon
              color="error"
              onClick={() => {
                setFieldValue(
                  "bill",
                  values.bill
                    .filter((_, index) => index !== rowIndex)
                    .map((item, index) => ({ ...item, id: index + 1 }))
                );
              }}
            >
              <CommonIcons.Delete />
            </CommonStyles.Button>
            <CommonStyles.Button
              isIcon
              color="primary"
              onClick={() => {
                setFieldValue(
                  "bill",
                  [
                    ...values.bill.slice(0, rowIndex + 1),
                    { id: values.bill.length + 1, name: "", price: "" },
                    ...values.bill.slice(rowIndex + 1),
                  ].map((item, index) => ({ ...item, id: index + 1 }))
                );
              }}
            >
              <CommonIcons.Add />
            </CommonStyles.Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <FieldArray
        name="bill"
        render={() => {
          return (
            <CommonStyles.Table columns={columns} data={values.bill || []} />
          );
        }}
      />
      <CommonStyles.Typography type="bold18" mt={2}>
        Total:{" "}
        <CommonStyles.Typography type="normal18" component="span">
          {values.bill
            .reduce(
              (total, item) => total + Number(removeAllDot(`${item.price}`)),
              0
            )
            .toLocaleString("vi-VN")}{" "}
          VND
        </CommonStyles.Typography>
        <CommonStyles.Typography type="bold18" mt={2}>
          In words:{" "}
          <CommonStyles.Typography type="normal18" component="span">
            {capitalize(numberToVietnameseText(
              +values.bill.reduce(
                (total, item) => total + Number(removeAllDot(`${item.price}`)),
                0
              )
            ))}{" "}
            VND
          </CommonStyles.Typography>
        </CommonStyles.Typography>
      </CommonStyles.Typography>
    </Box>
  );
};

export default TableBill;
