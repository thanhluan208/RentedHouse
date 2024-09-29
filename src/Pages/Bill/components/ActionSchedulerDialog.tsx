import CommonField from "@/Components/CommonFields";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FastField, Field, Form, Formik } from "formik";
import { useMemo } from "react";
import RepeatEndDate from "./RepeatEnd/RepeatEndDate";
import moment, { Moment } from "moment";
import RepeatEndAfter from "./RepeatEnd/RepeatEndAfter";
import { RRule } from "rrule";
import RepeatText from "./RepeatEnd/RepeatText";
import { OptionCommon } from "@/Interfaces/common";
import { toast } from "react-toastify";
import httpServices from "@/Services/http.services";
import { baseSchedulerApi } from "@/Constants/api";
import { useGet } from "@/Stores/useStore";

interface IActionSchedulerDialog {
  toggle: () => void;
  billIds: string[];
}

export interface SchedulerInitialValue {
  repeatEvery: number;
  repeatType: OptionCommon;
  repeatEnd: string;
  repeatEndAfter: number;
  repeatEndDate: Moment;
  bills: string[];
  startDate: Moment;
  endRule: string;
  targetMail: string;
}

const repeatTypeOptions = [
  {
    value: RRule.DAILY,
    label: "Day",
  },
  {
    value: RRule.WEEKLY,
    label: "Week",
  },
  {
    value: RRule.MONTHLY,
    label: "Month",
  },
  {
    value: RRule.YEARLY,
    label: "Year",
  },
];

const repeatEndOptions = [
  {
    value: "never",
    label: "Never",
  },
  {
    value: "date",
    label: <RepeatEndDate />,
  },
  {
    value: "after",
    label: <RepeatEndAfter />,
  },
];

const ActionSchedulerDialog = (props: IActionSchedulerDialog) => {
  //! State
  const { toggle, billIds } = props;
  const initialValues: SchedulerInitialValue = useMemo(() => {
    return {
      repeatEvery: 1,
      repeatType: {
        value: RRule.MONTHLY,
        label: "Month",
      },
      repeatEnd: "never",
      repeatEndAfter: 1,
      repeatEndDate: moment().add(1, "day"),
      bills: billIds,
      startDate: moment(),
      endRule: "Every month",
      targetMail: "",
    };
  }, [billIds]);

  const refetchListBill = useGet('REFETCH_BILL_LIST')


  //! Function
  const handleSubmit = async (values: SchedulerInitialValue) => {
    const toastId = toast.loading("Processing...");

    try {
      const payload = {
        bills: values.bills,
        type: "Mail",
        targetMail: values.targetMail,
        endRule: values.endRule,
      };


      await httpServices.post(baseSchedulerApi, payload);

      refetchListBill && await refetchListBill()

      toast.update(toastId, {
        render: "Success",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  //! Render
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ setFieldValue, values }) => {
        return (
          <Form>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <CommonStyles.Typography type="bold24">
                  Create mail scheduler
                </CommonStyles.Typography>
                <CommonStyles.Button
                  isIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                  }}
                >
                  <CommonIcons.Close />
                </CommonStyles.Button>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <FastField
                  name="targetMail"
                  component={CommonField.InputField}
                  label="Target mail"
                  fullWidth
                  placeholder="Enter target mail"
                />
                <FastField
                  name="startDate"
                  component={CommonField.DatePickerField}
                  label="Start date"
                  fullWidth
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  margin: "20px 0",
                }}
              >
                <CommonStyles.Typography type="bold14">
                  Repeat every
                </CommonStyles.Typography>
                <FastField
                  name="repeatEvery"
                  type="number"
                  component={CommonField.InputField}
                  sxContainer={{
                    width: "60px",
                  }}
                  inputProps={{
                    min: 1,
                  }}
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
                      setFieldValue("repeatEvery", +values.repeatEvery + 1);
                    }}
                  />
                  <CommonIcons.KeyboardArrowDown
                    onClick={() => {
                      if (values.repeatEvery > 1) {
                        setFieldValue("repeatEvery", +values.repeatEvery - 1);
                      }
                    }}
                  />
                </Box>
                <FastField
                  name="repeatType"
                  component={CommonField.MuiSelectField}
                  options={repeatTypeOptions}
                />
              </Box>
              <Field
                name="repeatEnd"
                component={CommonField.RadioGroupField}
                options={repeatEndOptions}
                label={
                  <CommonStyles.Typography type="bold14" color="#000">
                    End
                  </CommonStyles.Typography>
                }
              />

              <RepeatText />
            </DialogContent>

            <DialogActions>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <CommonStyles.Button variant="outlined" onClick={toggle}>
                  Cancel
                </CommonStyles.Button>
                <CommonStyles.Button type="submit" variant="contained">
                  Submit
                </CommonStyles.Button>
              </Box>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ActionSchedulerDialog;
