import CommonStyles from "@/Components/CommonStyles";
import { SchedulerResponse } from "@/Hooks/useGetListScheduler";
import { Box, Tooltip, useTheme } from "@mui/material";
import moment, { Moment } from "moment";
import { Fragment } from "react/jsx-runtime";

interface WeekDayProps {
  day: Moment;
  notSameMonth: boolean;
  index: number;
  monthDays: Moment[];
  isWeekend: boolean;
  event: SchedulerResponse | undefined;
}

const WeekDay = ({
  day,
  notSameMonth,
  index,
  monthDays,
  isWeekend,
  event,
}: WeekDayProps) => {
  //! State
  const theme = useTheme();
  console.log("event", event);

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
          background: event
            ? theme.palette.success.main
            : day.format("DDMMYYYY") === moment().format("DDMMYYYY")
            ? theme.palette.primary.light
            : notSameMonth
            ? "#f1f1f1"
            : "#fff",
          borderRight: (index + 1) % 7 === 0 ? "unset" : ".5px solid #36363645",
          borderBottom:
            monthDays.length - (index + 1) < 7
              ? "unset"
              : ".5px solid #36363645",
          transition: "background .3s",
          "&:hover": {
            background: event
              ? theme.palette.success.light
              : day.format("DDMMYYYY") === moment().format("DDMMYYYY")
              ? theme.palette.primary.light
              : "#f1f1f1",
          },
        }}
      >
        <CommonStyles.Typography
          color={isWeekend ? "red" : ""}
          padding="12px 12px 6px 12px"
        >
          {day.format(notSameMonth ? "DD/MM" : "DD")}
        </CommonStyles.Typography>
        {event && (
          <Box
            sx={{
              display: "flex",
              padding: "0px 12px",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {event.bills.map((bill) => {
              return (
                <Box
                  key={`${bill._id}_${day.format("DDMMYYYY")}`}
                  sx={{
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                    background: "#68a378",
                    borderRadius: "8px",
                    color: "#fff",
                    padding: "4px 8px",
                  }}
                >
                  <Tooltip
                    title={`${bill.room?.name}: ${bill.contents
                      .reduce((acc, cur) => acc + cur.price, 0)
                      .toLocaleString()} đ`}
                  >
                    <div
                      style={{
                        width: "100%",
                      }}
                    >
                      <CommonStyles.Typography
                        type="bold12"
                        sx={{
                          maxWidth: "100%",
                          textWrap: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {`${bill.room?.name}: ${bill.contents
                          .reduce((acc, cur) => acc + cur.price, 0)
                          .toLocaleString()} đ`}
                      </CommonStyles.Typography>
                    </div>
                  </Tooltip>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Fragment>
  );
};

export default WeekDay;
