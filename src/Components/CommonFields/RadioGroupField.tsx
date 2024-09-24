import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FieldProps } from "formik";
import { isString } from "lodash";
import { ReactNode } from "react";

interface RadioGroupFieldProps {
  label?: string | ReactNode;
  options: {
    value: string;
    label: string | ReactNode;
  }[];
}

const RadioGroupField = (props: FieldProps & RadioGroupFieldProps) => {
  //! State
  const { field, form, label, options } = props;
  const { name } = field;
  const { touched, errors, setFieldValue } = form;

  const isTouched = !!touched[name];
  const errorMsg = touched[name] && errors[name];

  //! Function
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, (event.target as HTMLInputElement).value);
  };

  //! Render
  return (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        onChange={handleRadioChange}
        value={field.value}
      >
        {options.map((option) => {
          return (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          );
        })}
      </RadioGroup>
      {isTouched && isString(errorMsg) && (
        <FormHelperText>{errorMsg}</FormHelperText>
      )}
    </FormControl>
  );
};

export default RadioGroupField;
