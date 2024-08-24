import { FastField, FieldArray, useFormikContext } from "formik";
import CommonStyles from "../../../../Components/CommonStyles";
import { Column } from "../../../../Components/CommonStyles/Table";
import CommonField from "../../../../Components/CommonFields";
import { Box } from "@mui/material";
import CommonIcons from "../../../../Components/CommonIcons";

import { RoomInitValues } from "../AddRoomButton";
import RowPriceExpenditure from "./RowPriceExpenditure";
import { Expenditure } from "../../../../Hooks/useGetRoomDetail";

const TableExpenditure = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<RoomInitValues>();

  //! Function

  //! Render

  const columns: Column<Expenditure>[] = [
    {
      id: "id",
      label: "STT",
      width: 50,
    },
    {
      id: "name",
      label: "Name",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`expenditures.${rowIndex}.name`}
              placeholder="Tiền môi giới, tiền vật liệu..."
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
              name={`expenditures.${rowIndex}.unit`}
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
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`expenditures.${rowIndex}.quantity`}
              placeholder="1000"
              component={CommonField.InputField}
              type="number"
            />
          </Box>
        );
      },
    },
    {
      id: "unitPrice",
      label: "Unit Price",
      customRender: (_, rowIndex) => {
        return (
          <Box sx={{ pr: "10px" }}>
            <FastField
              name={`expenditures.${rowIndex}.unitPrice`}
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
            <RowPriceExpenditure rowIndex={rowIndex} />
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
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <CommonStyles.Button
              isIcon
              color="error"
              onClick={() => {
                if (values.expenditures) {
                  setFieldValue(
                    "expenditures",
                    values.expenditures
                      .filter((_, index) => index !== rowIndex)
                      .map((item, index) => ({ ...item, id: index + 1 }))
                  );
                }
              }}
            >
              <CommonIcons.Delete />
            </CommonStyles.Button>
            <CommonStyles.Button
              isIcon
              color="primary"
              onClick={() => {
                if (!values.expenditures) return;
                setFieldValue(
                  "expenditures",
                  [
                    ...values.expenditures.slice(0, rowIndex + 1),
                    { id: values.expenditures.length + 1, name: "", price: "" },
                    ...values.expenditures.slice(rowIndex + 1),
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
    <Box sx={{ marginTop: "20px" }}>
      <CommonStyles.Typography type="bold16" mb={2}>
        Room expenditures
      </CommonStyles.Typography>
      <FieldArray
        name="expenditures"
        render={() => {
          return (
            <CommonStyles.Table
              columns={columns}
              data={values.expenditures || []}
              styleBody={{
                minHeight: 'unset'
              }}
            />
          );
        }}
      />
    </Box>
  );
};

export default TableExpenditure;
