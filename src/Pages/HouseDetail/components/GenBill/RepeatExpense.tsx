import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { memo } from "react";
import { PDFInitValues } from "./CreateBillButton";
import moment from "moment";
import { monthTextToNum } from "@/Helpers";

const month = [
  "Janurary",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RepeatExpense = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const { repeats } = values;
  //! Function

  console.log(
    "test",
    moment()
      .set("month", monthTextToNum("October") - 1)
      .format("YYYY-MM-DD")
  );

  //! Render
  return (
    <Box>
      <CommonStyles.Typography type="bold16">
        Repeat in:
      </CommonStyles.Typography>
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {month.map((item) => {
          return (
            <CommonStyles.Button
              key={item}
              variant={
                (repeats ?? [])?.includes(item) ? "contained" : "outlined"
              }
              onClick={() => {
                const newRepeats = (repeats ?? []).includes(item)
                  ? repeats?.filter((i) => i !== item)
                  : [...(repeats ?? []), item];
                setFieldValue("repeats", newRepeats);
              }}
            >
              {item}
            </CommonStyles.Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default memo(RepeatExpense);
