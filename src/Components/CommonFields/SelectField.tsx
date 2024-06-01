import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "../CommonStyles";
import { FieldProps, getIn } from "formik";
import React, { useState } from "react";

interface IMuiSelectField {
  onChangeCustomize: (
    event: SelectChangeEvent<any>,
    child: React.ReactNode
  ) => void;
  afterOnChange: (
    event: SelectChangeEvent<any>,
    child: React.ReactNode
  ) => void;
  options: any[];
  renderOption: (options: any) => React.ReactNode;
  customRenderValue: (value: any) => React.ReactNode;
}

function MuiSelectField(props: IMuiSelectField & SelectProps & FieldProps) {
  //! State
  const {
    field,
    form,
    options,
    renderOption,
    onChangeCustomize,
    afterOnChange,
    customRenderValue,
    ...otherProps
  } = props;
  const theme = useTheme();
  const { setFieldValue, errors, touched } = form;
  const { name, value, onBlur } = field;
  const [focus, setFocus] = useState(false);

  console.log("values", value);
  const isTouch = getIn(touched, name);
  const err = getIn(errors, name);

  const errMsg = isTouch && err ? err : "";
  //! Function
  const handleChange = (
    event: SelectChangeEvent<any>,
    child: React.ReactNode
  ) => {
    if (onChangeCustomize) {
      onChangeCustomize(event, child);
    } else {
      console.log("event", event.target.value);
    }
  };

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
        },
        ".MuiSelect-select": {
          padding: "8px 16px",
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
      <Select
        onBlur={(e) => {
          onBlur(e);
          setFocus(false);
        }}
        onFocus={(e) => {
          setFocus(true);
        }}
        {...otherProps}
        error={!!errMsg}
        label=""
        value={value}
        onChange={handleChange}
        sx={{
          padding: "8px 16px",

          div: {
            borderRadius: "10px",
            background: "#fff",
          },

          fieldset: {
            borderRadius: "10px",
          },
        }}
        inputProps={{
          style: {},
        }}
        renderValue={(selectedValue) => {
          if (customRenderValue) {
            return customRenderValue(value);
          } else {
            return selectedValue;
          }
        }}
        // input={<BootstrapInput />}
      >
        {options.map((op: { value: string; label: string }) => {
          if (renderOption) {
            return renderOption(op);
          }
          return (
            <MenuItem value={op?.value} key={op?.value}>
              {op?.label}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}

export default MuiSelectField;
