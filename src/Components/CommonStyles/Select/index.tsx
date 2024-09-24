import {
  Box,
  ListSubheader,
  MenuItem,
  Select,
  SelectProps,
  SxProps,
  useTheme,
} from "@mui/material";
import CommonStyles from "..";

interface ISelect {
  options: any[];
  value?: any;
  renderOption?: (options: any) => React.ReactNode;
  customRenderValue?: (value: any) => React.ReactNode;
  handleChange?: (value: any) => void;
  sxContainer?: SxProps;
}

const CommonSelect = (props: ISelect & SelectProps) => {
  //! State
  const {
    options,
    renderOption,
    customRenderValue,
    handleChange,
    value,
    sxContainer,
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
        ...sxContainer,
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
        displayEmpty={true}
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
          const renderValue = selectedValue || value;
          if (!renderValue) {
            return <em>{props.placeholder}</em>;
          }
          if (customRenderValue) {
            return customRenderValue(value);
          } else {
            return options.find((op) => op.value === renderValue)?.label;
          }
        }}
      >
        {props?.placeholder && (
          <MenuItem disabled value={""}>
            <em>{props?.placeholder}</em>
          </MenuItem>
        )}
        {options.map((op: { value: string; label: string; group?: string }) => {
          if (renderOption) {
            return <Box key={op?.value}>{renderOption(op)}</Box>;
          }
          return (
            <Box key={op?.value}>
              {op?.group && <ListSubheader>{op?.group}</ListSubheader>}
              <MenuItem
                value={op?.value}
                onClick={() => {
                  handleChange && handleChange(op.value);
                }}
              >
                {op?.label}
              </MenuItem>
            </Box>
          );
        })}
      </Select>
    </Box>
  );
};

export default CommonSelect;
