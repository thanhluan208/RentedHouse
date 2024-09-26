import { FastField, FieldArray, getIn, useFormikContext } from "formik";
import CommonStyles from "../../../../Components/CommonStyles";
import { PDFInitValues } from "./CreateBillButton";
import { Column } from "../../../../Components/CommonStyles/Table";
import CommonField from "../../../../Components/CommonFields";
import { Box, useTheme } from "@mui/material";
import CommonIcons from "../../../../Components/CommonIcons";
import RowPrice from "./RowPrice";
import { Bill, BillQuantityType } from "../../../../Interfaces/common";
import InputQuantity from "./InputQuantity";
import { Fragment } from "react/jsx-runtime";
import { isString } from "lodash";

const TableBill = ({ disabled }: { disabled?: boolean }) => {
  //! State
  const { values, setFieldValue, errors } = useFormikContext<PDFInitValues>();
  const theme = useTheme();
  const billError = getIn(errors, "bill");
  //! Function

  //! Render

  const columns: Column<Bill>[] = [
    {
      id: "id",
      label: "STT",
      width: 50,
      customRender: (_, rowIndex) => {
        return (
          <CommonStyles.Typography type="bold14">
            {rowIndex + 1}
          </CommonStyles.Typography>
        );
      },
    },
    {
      id: "name",
      label: "Name",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`bill.${rowIndex}.name`}
              placeholder="Tiền điện, tiền nước..."
              component={CommonField.InputField}
              disabled={disabled}
            />
          </Box>
        );
      },
    },
    {
      id: "unit",
      label: "Unit",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`bill.${rowIndex}.unit`}
              placeholder="1000"
              component={CommonField.InputField}
              disabled={disabled}
            />
          </Box>
        );
      },
    },
    {
      id: "quantity",
      label: "Quantity",
      customRender: (_, rowIndex) => {
        return <InputQuantity rowIndex={rowIndex} disabled={disabled} />;
      },
    },
    {
      id: "unitPrice",
      label: "Unit Price",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`bill.${rowIndex}.unitPrice`}
              component={CommonField.InputField}
              fullWidth
              isPrice
              disabled={disabled}
              InputProps={{
                endAdornment: (
                  <CommonStyles.Typography
                    type="bold14"
                    sx={{
                      marginRight: "10px",
                    }}
                  >
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
      id: "price",
      label: "Price",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px", display: "flex", alignItems: "center" }}>
            <RowPrice rowIndex={rowIndex} />
          </Box>
        );
      },
    },
    {
      id: "action",
      label: "Action",
      width: 200,
      customRender: (_, rowIndex) => {
        if(disabled) return <div />;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:'flex-end'
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
                    {
                      id: values.bill.length + 1,
                      name: "",
                      price: "",
                      status: values.isExpense ? "paid" : "unpaid",
                    },
                    ...values.bill.slice(rowIndex + 1),
                  ].map((item, index) => ({ ...item, id: index + 1 }))
                );
              }}
            >
              <CommonIcons.Add />
            </CommonStyles.Button>
            <CommonStyles.Button
              isIcon
              onClick={() => {
                if (values.bill[rowIndex].type === BillQuantityType.MONTH) {
                  setFieldValue(
                    `bill.${rowIndex}.type`,
                    BillQuantityType.START_END
                  );
                } else {
                  setFieldValue(
                    `bill.${rowIndex}.type`,
                    BillQuantityType.MONTH
                  );
                }
              }}
            >
              <CommonIcons.SyncAlt />
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
            <Fragment>
              <CommonStyles.Table
                columns={columns}
                data={values.bill || []}
                styleBody={{
                  minHeight: "unset",
                }}
              />
              {!disabled && <CommonStyles.Button
                variant="contained"
                type="button"
                sx={{ margin: "20px 0" }}
                onClick={() => {
                  setFieldValue("bill", [
                    ...values.bill,
                    {
                      id: values.bill.length + 1,
                      name: "",
                      price: 0,
                      unit: "",
                      unitPrice: 0,
                      quantity: 0,
                      status: values.isExpense ? "paid" : "unpaid",
                      type: BillQuantityType.MONTH,
                    },
                  ]);
                }}
              >
                Add row
              </CommonStyles.Button>}
            </Fragment>
          );
        }}
      />
      <CommonStyles.Typography color={theme.palette.error.main}>
        {isString(billError) ? billError : ""}
      </CommonStyles.Typography>
    </Box>
  );
};

export default TableBill;
