import { Box, Collapse } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import CommonStyles from "../../../../Components/CommonStyles";
import { FastField } from "formik";
import CommonField from "../../../../Components/CommonFields";
import { HouseStatus } from "../../../../Constants/options";
import { useState } from "react";
import CommonIcons from "../../../../Components/CommonIcons";
import GuestInput from "../GuessInput";

const RoomInformations = () => {
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
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <CommonStyles.Typography type="bold16" mb={2}>
          Room information
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
            display: "flex",
            flexDirection: "column",
            padding: "0 10px",
          }}
        >
          <FastField
            name="name"
            component={CommonField.InputField}
            fullWidth
            label="Room name"
            required
            placeholder="Give the room a unique name"
            maxChar={50}
          />
          <FastField
            name="status"
            component={CommonField.MuiSelectField}
            fullWidth
            options={HouseStatus}
            label="Status"
            placeholder="Select status"
          />
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <FastField
              name="price"
              component={CommonField.InputField}
              fullWidth
              isPrice
              label="Price"
              required
              placeholder="Enter price"
            />
            <FastField
              name="size"
              component={CommonField.InputField}
              fullWidth
              label="Size"
              InputProps={{
                endAdornment: (
                  <CommonStyles.Typography type="bold14" marginRight="5px">
                    m²
                  </CommonStyles.Typography>
                ),
              }}
              placeholder="Enter size"
            />
            <FastField
              name="maxGuest"
              component={CommonField.InputField}
              fullWidth
              label="Max guest"
              placeholder="Enter max guest"
            />
          </Box>
        </Box>
        <GuestInput />
      </Collapse>
    </Fragment>
  );
};

export default RoomInformations;
