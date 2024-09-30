import CommonStyles from "@/Components/CommonStyles";
import { useFormikContext } from "formik";
import { SchedulerInitialValue } from "../Scheduler/ActionSchedulerDialog";
import { Frequency, RRule } from "rrule";
import { useEffect } from "react";
import moment from "moment";
import { cloneDeep } from "lodash";

const RepeatText = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<SchedulerInitialValue>();
  const {
    repeatEnd,
    repeatEndAfter,
    repeatType,
    repeatEvery,
    repeatEndDate,
    startDate,
  } = values;

  const rule = new RRule({
    freq: repeatType.value as Frequency,
    interval: repeatEvery,
    dtstart: cloneDeep(startDate).startOf("day").toDate(),
  });


  if (repeatEnd === "after") {
    rule.options.count = repeatEndAfter;
    rule.options.until = null;
  }
  if (repeatEnd === "date") {
    rule.options.until = repeatEndDate.toDate();
    rule.options.count = null;
  }

  useEffect(() => {
    setFieldValue("endRule", rule.toString());
  }, [rule.toString()]);

  //! Function

  //! Render
  return (
    <CommonStyles.Typography mt="20px">
      This schedule start in <b>{moment(startDate).format("DD/MM/YYYY")}</b> and
      repeat: <b>{rule.toText()}</b>
    </CommonStyles.Typography>
  );
};

export default RepeatText;
