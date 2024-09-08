import { FastField, FieldArray, useFormikContext } from "formik";
import CommonStyles from "../../../../Components/CommonStyles";
import { PDFInitValues } from "./GenPdfButton";
import { Column } from "../../../../Components/CommonStyles/Table";
import CommonField from "../../../../Components/CommonFields";
import { Box } from "@mui/material";
import CommonIcons from "../../../../Components/CommonIcons";
import RowPrice from "./RowPrice";
import { Bill, BillQuantityType } from "../../../../Interfaces/common";
import InputQuantity from "./InputQuantity";

const TableBill = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();

  //! Function

  //! Render

  const columns: Column<Bill>[] = [
    {
      id: "id",
      label: "STT",
      width: 50,
      customRender: (_, rowIndex) => {
        return <CommonStyles.Typography type="bold14">{rowIndex + 1}</CommonStyles.Typography>;
      }
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
      id: "unit",
      label: "Unit",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`bill.${rowIndex}.unit`}
              placeholder="1000"
              component={CommonField.InputField}
            />
          </Box>
        );
      },
    },
    {
      id: "quantity",
      label: "Quantity",
      customRender: (_, rowIndex) => {
        return <InputQuantity rowIndex={rowIndex} />;
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
      width: 100,
      customRender: (_, rowIndex) => {
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
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
            <CommonStyles.Table
              columns={columns}
              data={values.bill || []}
              styleBody={{
                minHeight: "unset",
              }}
            />
          );
        }}
      />
    </Box>
  );
};

export default TableBill;
