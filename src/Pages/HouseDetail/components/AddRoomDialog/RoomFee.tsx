import { Box, Collapse } from "@mui/material";
import { Fragment, useState } from "react";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import { FastField } from "formik";
import CommonField from "../../../../Components/CommonFields";

const RoomFee = () => {
  //! State
  const [open, setOpen] = useState(true);

  //! Function

  //! Render
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <CommonStyles.Typography type="bold16" mb={2}>
          Room fee
        </CommonStyles.Typography>
        <CommonIcons.KeyboardArrowDown
          sx={{
            cursor: "pointer",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        />
      </Box>
      <Collapse in={open}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            padding: "0 10px",
            columnGap: "20px",
          }}
        >
          <FastField
            name="electricityFee"
            component={CommonField.InputField}
            fullWidth
            isPrice
            label="Electricity fee"
            required
            placeholder="Enter electricity fee"
            InputProps={{
              endAdornment: (
                <CommonStyles.Typography
                  type="bold14"
                  sx={{
                    marginRight: "10px",
                  }}
                >
                  vnd/kWh
                </CommonStyles.Typography>
              ),
            }}
          />
          <FastField
            name="internetFee"
            component={CommonField.InputField}
            fullWidth
            isPrice
            label="Internet fee"
            required
            placeholder="Enter internet fee"
          />
          <FastField
            name="waterFee"
            component={CommonField.InputField}
            fullWidth
            isPrice
            label="Water fee"
            required
            placeholder="Enter water fee"
          />
          <FastField
            name="livingExpense"
            component={CommonField.InputField}
            fullWidth
            isPrice
            label="Living expense"
            required
            placeholder="Enter living expense"
          />
          <FastField
            name="parkingFee"
            component={CommonField.InputField}
            fullWidth
            isPrice
            label="Parking fee"
            required
            placeholder="Enter parking fee"
          />
        </Box>
      </Collapse>
    </Fragment>
  );
};

export default RoomFee;
