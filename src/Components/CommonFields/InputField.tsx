import {
  Box,
  InputAdornment,
  TextField,
  TextFieldProps,
  useTheme,
} from "@mui/material";
import { FieldProps, getIn } from "formik";
import { useCallback,  } from "react";
import CommonStyles from "../CommonStyles";
import { removeAllDot } from "../../Helpers";

interface IInputField {
  onChangeCustomize: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  afterOnChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  maxChar: number;
  isPrice?: boolean;
}

function InputField(props: IInputField & FieldProps & TextFieldProps) {
  //! Stat
  const {
    field,
    form,
    afterOnChange,
    onChangeCustomize,
    maxChar,
    isPrice,
    ...otherProps
  } = props;
  const theme: any = useTheme();
  const { setFieldValue, errors, touched } = form;
  const { name, value, onBlur } = field;

  const isTouch = getIn(touched, name);
  const err = getIn(errors, name);

  const errMsg = isTouch && err ? err : "";

  //! Function
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (onChangeCustomize) {
        onChangeCustomize(event);
        return;
      } else if (isPrice) {
      const value = removeAllDot(event.target.value).replace(/[^0-9]/g, '');
        setFieldValue(name, Number(value).toLocaleString("vi-VN"));
      } else {
        if (maxChar && event?.target?.value?.length >= maxChar) {
          setFieldValue(name, event.target.value.substring(0, maxChar));
          return;
        }

        setFieldValue(name, event.target.value);

        afterOnChange && afterOnChange(event);
      }
    },
    [onChangeCustomize, afterOnChange, maxChar, value]
  );

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: otherProps.fullWidth ? "100%" : "fit-content",
        ".MuiInputBase-root": {
          padding: 0,
          display: "flex",
          alignItems: otherProps?.multiline ? "end" : "center",
        },
        input: {
          "&:hover": {
            input: {
              background: "#fff !important",
            },
          },
        },
      }}
    >
      {otherProps?.label && (
        <CommonStyles.Typography type="bold14" my={1}>
          {otherProps?.label}
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
      <TextField
        name={name}
        value={value}
        onBlur={onBlur}
        {...otherProps}
        error={errMsg}
        helperText={errMsg}
        label=""
        onChange={handleChange}
        sx={{
          div: {
            borderRadius: "10px",
            background: "#fff",
          },

          fieldset: {
            borderRadius: "10px",
          },
        }}
        inputProps={{
          style: {
            padding: "8px 16px",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                height: "100%",
                mr: "5px",
                mb: otherProps.multiline ? "5px" : 0,
                fontSize: "10px",
              }}
            >
              <CommonStyles.Typography type="normal12">
                {maxChar && `${value?.length || 0}/${maxChar}`}
              </CommonStyles.Typography>
            </InputAdornment>
          ),
          ...otherProps.InputProps,
        }}
      />
    </Box>
  );
}

export default InputField;
