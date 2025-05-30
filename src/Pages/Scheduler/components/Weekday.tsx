import CommonStyles from "@/Components/CommonStyles";
import { SchedulerResponse } from "@/Hooks/useGetListScheduler";
import useToggleDialog from "@/Hooks/useToggleDialog";
import ActionSchedulerDialog, { repeatTypeOptions } from "@/Pages/Bill/components/Scheduler/ActionSchedulerDialog";

import { Box, Tooltip, useTheme } from "@mui/material";
import moment, { Moment } from "moment";
import { memo, useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { RRule } from "rrule";

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
  const { open, shouldRender, toggle } = useToggleDialog();

  const parseData = useMemo(() => {
    const rule = RRule.fromString(event?.endRule || "").origOptions;

    const endRule: any = {
      repeatEvery: rule.interval || 1,
      repeatType:
        repeatTypeOptions.find((elm) => elm.value === rule.freq) ||
        repeatTypeOptions[0],
      repeatEnd: rule.count ? "after" : rule.until ? "date" : "never",
    };

    if (rule.count) {
      endRule.repeatEndAfter = rule.count;
    }

    if (rule.until) {
      endRule.repeatEndDate = moment(rule.until);
    }

    return {
      ...endRule,
      id: event?._id,
      bills: event?.bills || [],
      startDate: moment(rule.dtstart),
      targetMail: event?.targetMail || "",
    };
  }, [event]);
  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && event && (
        <CommonStyles.Dialog
          toggle={toggle}
          open={open}
          fullWidth
          maxWidth="lg"
        >
          <ActionSchedulerDialog toggle={toggle} initData={parseData} />
        </CommonStyles.Dialog>
      )}
      <Box
        onClick={event ? toggle : undefined}
        key={day.format("ddmmyyyy")}
        sx={{
          cursor: !event ? "default" : "pointer",
          width: "100%",
          aspectRatio: "1/1",
          maxHeight: "100%",
          overflowY: "auto",
          paddingBottom: "12px",
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
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(1000px)",
          }}
        >
          {day.format(notSameMonth ? "DD/MM" : "DD")}
        </CommonStyles.Typography>
        {event && day.isAfter(moment()) && (
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

export default memo(WeekDay);
