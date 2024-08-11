import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
  Box,
  TextField,
  TextFieldProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "../CommonStyles";
import { useState } from "react";
import { FieldProps, getIn } from "formik";

interface IAutocompleteField {
  textFieldProps: TextFieldProps;
  onChangeCustomize: (
    event: React.SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<any> | undefined
  ) => void;
  afterOnChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<any> | undefined
  ) => void;
}

function AutocompleteField(
  props: IAutocompleteField & AutocompleteProps<any, any, any, any> & FieldProps
) {
  //! State
  const {
    options,
    renderOption,
    textFieldProps,
    field,
    form,
    onChangeCustomize,
    afterOnChange,
  } = props;
  const { setFieldValue, errors, touched } = form;
  const { name, value, onBlur } = field;
  const [focus, setFocus] = useState(false);

  const isTouch = getIn(touched, name);
  const err = getIn(errors, name);

  const errMsg = isTouch && err ? err : "";
  const theme: any = useTheme();

  //! Function
  const handleChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: any,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<any> | undefined
  ) => {
    if (onChangeCustomize) {
      onChangeCustomize(event, value, reason, details);
    } else {
      setFieldValue(name, value);

      afterOnChange && afterOnChange(event, value, reason, details);
    }
  };

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: textFieldProps?.fullWidth ? "100%" : "fit-content",
        ".MuiInputBase-root": {
          paddingTop: "0 !important",
          paddingBottom: "0 !important",
          display: "flex",
          background:"#fff"
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
      {textFieldProps?.label && (
        <CommonStyles.Typography type="bold14" my={1}>
          {textFieldProps?.label}
          {textFieldProps?.required && (
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
      <Autocomplete
        id={name}
        options={options || []}
        autoHighlight
        onChange={handleChange}
        fullWidth={textFieldProps?.fullWidth}
        getOptionLabel={(option) => option?.label || ""}
        value={value}
        renderOption={
          renderOption
            ? renderOption
            : (props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  {option.label}
                </Box>
              )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            {...textFieldProps}
            error={errMsg}
            helperText={errMsg}
            onBlur={(e) => {
              onBlur(e);
              setFocus(false);
            }}
            onFocus={() => {
              setFocus(true);
            }}
            name={name}
            label=""
            sx={{
              div: {
                borderRadius: "10px",
                background: focus ? "#fff" : "transparent",
              },

              fieldset: {
                borderRadius: "10px",
              },
            }}
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password",
              style: {
                padding: "8px 16px",
              },
            }}
          />
        )}
      />
    </Box>
  );
}

export default AutocompleteField;
