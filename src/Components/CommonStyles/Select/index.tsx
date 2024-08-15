import {
  Box,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "..";
import { Fragment } from "react/jsx-runtime";

interface ISelect {
  options: any[];
  value?: any;
  renderOption?: (options: any) => React.ReactNode;
  customRenderValue?: (value: any) => React.ReactNode;
  handleChange?: (value: any) => void;
}

const CommonSelect = (props: ISelect & SelectProps) => {
  //! State
  const {
    options,
    renderOption,
    customRenderValue,
    handleChange,
    value,
    ...otherProps
  } = props;

  const theme: any = useTheme();

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: otherProps.fullWidth ? "100%" : "fit-content",
        padding: "1px",
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
        {...otherProps}
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
          console.log(selectedValue);
          if (customRenderValue) {
            return customRenderValue(value);
          } else {
            return options.find((op) => op.value === selectedValue)?.label;
          }
        }}
      >
        {options.map((op: { value: string; label: string; group?: string }) => {
          if (renderOption) {
            return <Fragment key={op?.value}>{renderOption(op)}</Fragment>;
          }
          return (
            <Fragment key={op?.value}>
              {op?.group && <ListSubheader>{op?.group}</ListSubheader>}
              <MenuItem
                value={op?.value}
                onClick={() => {
                  handleChange && handleChange(op.value);
                }}
              >
                {op?.label}
              </MenuItem>
            </Fragment>
          );
        })}
      </Select>
    </Box>
  );
};

export default CommonSelect;
