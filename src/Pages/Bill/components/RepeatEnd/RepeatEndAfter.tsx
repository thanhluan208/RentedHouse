import CommonField from "@/Components/CommonFields";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { Field, useFormikContext } from "formik";

const RepeatEndAfter = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<any>();
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
      <CommonStyles.Typography>After</CommonStyles.Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Field
          name="repeatEndAfter"
          component={CommonField.InputField}
          type="number"
          inputProps={{
            min: 1,
          }}
          disabled={repeatEnd !== "after"}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            svg: {
              width: "15px",
              height: "15px",
              cursor: "pointer",
            },
          }}
        >
          <CommonIcons.KeyboardArrowUp
            onClick={() => {
              if(repeatEnd !== "after") return;
              setFieldValue("repeatEvery", +values.repeatEvery + 1);
            }}
          />
          <CommonIcons.KeyboardArrowDown
            onClick={() => {
              if (values.repeatEvery > 1 && repeatEnd === "after") {
                setFieldValue("repeatEvery", +values.repeatEvery - 1);
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RepeatEndAfter;
