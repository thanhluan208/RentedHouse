import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import OpenSidebarButton from "@/Components/CommonStyles/OpenSidebarButton/OpenSidebarButton";
import { Box } from "@mui/material";
import moment from "moment";
import { useMemo, useState } from "react";
import WeekDay from "./components/Weekday";
import useGetListScheduler from "@/Hooks/useGetListScheduler";
import { RRule } from "rrule";

const weekDay = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const index = () => {
  //! State
  const [currentMonth, setCurrentMonth] = useState(moment());

  const { data, isLoading } = useGetListScheduler();
  console.log(data);

  const monthDays = useMemo(() => {
    const startOfMonth = currentMonth.clone().startOf("month").startOf("week");
    const endOfMonth = currentMonth.clone().endOf("month").endOf("week");

    const days = [];

    let day = startOfMonth.clone();
    while (day.isBefore(endOfMonth)) {
      days.push(day.clone());
      day.add(1, "day");
    }
    return days;
  }, [currentMonth]);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        dislay: "flex",
        padding: "24px",
      }}
    >
      <OpenSidebarButton title="Scheduler" />

      <Box
        sx={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          alignItems: "center",
          button: {
            borderRadius: "8px",
          },
          marginTop: "40px",
        }}
      >
        <CommonStyles.Button
          variant="contained"
          startIcon={<CommonIcons.KeyboardDoubleArrowLeft />}
          onClick={() => {
            setCurrentMonth(currentMonth.clone().subtract(1, "month"));
          }}
        >
          Previous month
        </CommonStyles.Button>
        <CommonStyles.DatePickerCommon
          value={currentMonth}
          views={["month", "year"]}
          handleChange={(value) => setCurrentMonth(value)}
        />
        <CommonStyles.Button
          variant="contained"
          endIcon={<CommonIcons.KeyboardDoubleArrowRight />}
          onClick={() => {
            setCurrentMonth(currentMonth.clone().add(1, "month"));
          }}
        >
          Next month
        </CommonStyles.Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, calc(100% / 7))",
          padding: "12px",
          borderRadius: " 12px",
          background: "#363636",
          marginTop: "20px",
        }}
      >
        {weekDay.map((day) => {
          return (
            <Box key={day} sx={{ textAlign: "center" }}>
              <CommonStyles.Typography type="bold14" color="#fff">
                {day}
              </CommonStyles.Typography>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, calc(100% / 7))",
          borderRadius: " 8px",
          marginTop: "20px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <CommonStyles.LoadingOverlay isLoading={isLoading} />
        {monthDays.map((day, index) => {
          const notSameMonth = day.month() !== currentMonth.month();
          const isWeekend = day.day() === 0 || day.day() === 6;
          const event = data.find((elm) => RRule.fromString(elm.endRule)?.origOptions?.dtstart?.getDate() === day.date());
          return (
            <WeekDay
              key={day.format("DDMMYYYY")}
              day={day}
              notSameMonth={notSameMonth}
              index={index}
              monthDays={monthDays}
              isWeekend={isWeekend}
              event={event}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default index;
