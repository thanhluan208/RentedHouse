import { Box, SxProps, useTheme } from "@mui/material";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import CommonStyles from "..";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateValidationError, PickerChangeHandlerContext } from "@mui/x-date-pickers/models";

interface IDatePickerCommon {
  fullWidth?: boolean;
  label?: string;
  required?: boolean;
  handleChange: (value: any, context: PickerChangeHandlerContext<DateValidationError>) => void
  sxContainer?: SxProps;
}

const DatePickerCommon = (props: IDatePickerCommon & DatePickerProps<any>) => {
  //! State
  const { label, required, value, handleChange,sxContainer ,...otherProps } = props;
  const theme: any = useTheme();
  //! Function

  //! Render
  return (
    <Box
      sx={{
        width: otherProps.fullWidth ? "100%" : "fit-content",
        input: {
          padding: "8px 32px 8px 16px",
        },
        ...sxContainer
      }}
    >
      {label && (
        <CommonStyles.Typography type="bold14" my={1}>
          {label}
          {required && (
            <span
              style={{
                color: theme.colors.custom.colorErrorTypo,
                marginLeft: "4px",
              }}
            >
              *
            </span>
          )}
        </CommonStyles.Typography>
      )}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          {...otherProps}
          value={value}
          onChange={handleChange}
          sx={{
            div: {
              borderRadius: "10px",
              background: "#fff",
            },
            button: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            fieldset: {
              borderRadius: "10px",
            },
          }}
          slotProps={{
            yearButton: {
              sx: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DatePickerCommon;
