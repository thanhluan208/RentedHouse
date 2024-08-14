import { FastField, FieldArray, useFormikContext } from "formik";
import { Box, Tooltip } from "@mui/material";
import { RoomInitValues } from "./AddRoomButton";
import CommonStyles from "../../../Components/CommonStyles";
import { v4 as uuid } from "uuid";
import CommonField from "../../../Components/CommonFields";
import CommonIcons from "../../../Components/CommonIcons";

const GuestInput = () => {
  //! State
  const { values } = useFormikContext<RoomInitValues>();

  //! Function

  //! Render
  return (
    <Box>
      {values?.guests?.length > 0 && (
        <CommonStyles.Typography type="bold14" my={1}>
          Guests
        </CommonStyles.Typography>
      )}
      <FieldArray
        name="guests"
        render={({ push, remove }) => {
          return (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {values.guests.map((guest: any, index: number) => {
                  return (
                    <Box sx={{ display: "flex", gap: "8px" }}>
                      <FastField
                        name={`guests.${index}.name`}
                        key={guest.id}
                        component={CommonField.InputField}
                        placeholder="Guest name"
                        fullWidth
                      />
                      <CommonStyles.Button
                        isIcon
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <CommonIcons.Remove />
                      </CommonStyles.Button>
                    </Box>
                  );
                })}
              </Box>
              <Tooltip
                title={
                  values.guests.length > values.maxGuest
                    ? "Number of guests must smaller than or equals room size"
                    : ""
                }
              >
                <div style={{ width: "fit-content", height: "fit-content" }}>
                  <CommonStyles.Button
                    sx={{
                      mt: 3,
                    }}
                    disabled={values.guests.length >= values.maxGuest}
                    variant="outlined"
                    onClick={() => {
                      push({ id: uuid(), name: "" });
                    }}
                  >
                    Add guest
                  </CommonStyles.Button>
                </div>
              </Tooltip>
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default GuestInput;
