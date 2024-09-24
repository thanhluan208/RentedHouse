import CommonField from "@/Components/CommonFields";
import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { Field, useFormikContext } from "formik";

const RepeatEndDate = () => {
  //! State
  const { values } = useFormikContext<any>();
  const { repeatEnd } = values;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "120px 1fr",
      }}
    >
      <CommonStyles.Typography>On</CommonStyles.Typography>
      <Field
        name="repeatEndDate"
        component={CommonField.DatePickerField}
        disablePast
        disabled={repeatEnd !== "date"}
      />
    </Box>
  );
};

export default RepeatEndDate;
