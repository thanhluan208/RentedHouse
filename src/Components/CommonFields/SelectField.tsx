import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  SxProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "../CommonStyles";
import { FieldProps, getIn } from "formik";
import React from "react";
import { isString } from "lodash";

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
  renderLabel?: React.ReactNode;
  sxContainer?: SxProps;
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
    sxContainer,
    ...otherProps
  } = props;
  const theme: any = useTheme();
  const { setFieldValue, errors, touched } = form;
  const { name, value, onBlur } = field;

  const isTouch = getIn(touched, name);
  const err = getIn(errors, name);

  const errMsg = isTouch && err ? err : "";
  //! Function
  const handleChange = (
    event: SelectChangeEvent<any>,
    child: React.ReactNode
  ) => {
    event.stopPropagation()
    if (onChangeCustomize) {
      onChangeCustomize(event, child);
    } else {
      setFieldValue(
        name,
        options.find((elm) => elm.value == event.target.value)
      );
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
        ...sxContainer,
      }}
    >
      {(otherProps?.label || otherProps?.renderLabel) && (
        <CommonStyles.Typography type="bold14" my={1}>
          {otherProps?.renderLabel || otherProps?.label}
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
        onBlur={onBlur}
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
        displayEmpty={true}
        renderValue={(selectedValue) => {
          if (customRenderValue) {
            return customRenderValue(value);
          } else {
            if (!selectedValue) {
              return <em>{props.placeholder}</em>;
            }
            if (isString(selectedValue)) {
              return (
                options.find((elm) => elm.value == selectedValue)?.label ||
                selectedValue ||
                ""
              );
            }
            return selectedValue?.label || selectedValue?.name || selectedValue || "";
          }
        }}
      >
        {props?.placeholder && (
          <MenuItem disabled value={""}>
            <em>{props?.placeholder}</em>
          </MenuItem>
        )}
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
