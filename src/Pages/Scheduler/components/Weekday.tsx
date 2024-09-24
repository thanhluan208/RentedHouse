import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { Moment } from "moment";
import { Fragment } from "react/jsx-runtime";

interface WeekDayProps {
  day: Moment;
  notSameMonth: boolean;
  index: number;
  monthDays: Moment[];
  isWeekend: boolean;
}

const WeekDay = ({
  day,
  notSameMonth,
  index,
  monthDays,
  isWeekend,
}: WeekDayProps) => {
  //! State

  //! Function

  //! Render
  return (
    <Fragment>
      <Box
        key={day.format("ddmmyyyy")}
        sx={{
          cursor: notSameMonth ? "default" : "pointer",
          width: "100%",
          aspectRatio: "1/1",
          padding: "12px",
          background: notSameMonth ? "#f1f1f1" : "#fff",
          borderRight: (index + 1) % 7 === 0 ? "unset" : ".5px solid #36363645",
          borderBottom:
            monthDays.length - (index + 1) < 7
              ? "unset"
              : ".5px solid #36363645",
          "&:hover": {
            background: "#f1f1f1",
          },
        }}
      >
        <CommonStyles.Typography color={isWeekend ? "red" : ""}>
          {day.format("DD")}
        </CommonStyles.Typography>
      </Box>
    </Fragment>
  );
};

export default WeekDay;
