import { Box, Switch, SwitchProps, useTheme } from "@mui/material";
import { FieldProps } from "formik";
import CommonStyles from "../CommonStyles";

interface ISwitchField {
  label?: string;
}

const SwitchField = (props: ISwitchField & SwitchProps & FieldProps) => {
  //! State
  const { field, form, label, ...otherProps } = props;
  const { name } = field;
  const { setFieldValue } = form;
  const theme: any = useTheme();

  //! Function
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, event.target.checked);
  };

  //! Render
  return (
    <Box sx={{display:'flex'}}>
      <Switch {...otherProps} {...field} onChange={handleChange} />
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
    </Box>
  );
};

export default SwitchField;
