import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FieldProps } from "formik";
import {
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers/models";
import { Box, useTheme } from "@mui/material";
import CommonStyles from "../CommonStyles";

interface IDatePickerField {
  fullWidth?: boolean;
  required?: boolean;
}

const DatePickerField = (
  props: IDatePickerField & DatePickerProps<any> & FieldProps
) => {
  //! State
  const { form, field, onChange, label, ...otherProps } = props;
  const { name, value } = field;
  const theme: any = useTheme();

  //! Function
  const handleChange = (
    value: moment.Moment | null,
    _: PickerChangeHandlerContext<DateValidationError>
  ) => {
    form.setFieldValue(name, value);
  };

  //! Render
  return (
    <Box
      sx={{
        width: otherProps.fullWidth ? "100%" : "fit-content",
        input: {
          padding: "8px 32px 8px 16px",
        },
      }}
    >
      {label && (
        <CommonStyles.Typography type="bold14" my={1}>
          {label}
          {otherProps?.required && (
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
            textField: {
              fullWidth: props.fullWidth,
            },
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

export default DatePickerField;
