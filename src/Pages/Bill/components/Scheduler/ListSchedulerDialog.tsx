import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { baseBillApi } from "@/Constants/api";
import cachedKeys from "@/Constants/cachedKeys";
import { BillResponse } from "@/Hooks/useGetBill";
import useGetListScheduler from "@/Hooks/useGetListScheduler";
import httpServices from "@/Services/http.services";
import { useGet, useSave } from "@/Stores/useStore";
import { Box, DialogContent, DialogTitle, useTheme } from "@mui/material";
import { capitalize, isEmpty } from "lodash";
import moment from "moment";
import { Fragment } from "react";
import { toast } from "react-toastify";
import { RRule } from "rrule";

interface IListSchedulerDialog {
  toggle: () => void;
  bill: BillResponse;
}

const ListSchedulerDialog = (props: IListSchedulerDialog) => {
  //! State
  const { toggle, bill } = props;
  const theme = useTheme();
  const save = useSave();

  console.log("bill", bill);

  const isRegisted = !!bill.scheduler;

  const { data, isLoading, refetch } = useGetListScheduler();
  const refetchListBill = useGet("REFETCH_BILL_LIST");

  //! Function
  const handleClick = async (e: any, scheduler: string, isAdd = true) => {
    e.stopPropagation();
    save(cachedKeys.LOADING_APP, true);
    const toastId = toast.loading("Processing...", {
      isLoading: true,
      autoClose: false,
    });

    const payload = {
      scheduler,
      isAdd,
    };
    try {
      if (isAdd) {
        await httpServices.post(
          `${baseBillApi}/${bill._id}/registSchedule`,
          payload
        );
      } else {
        await httpServices.post(
          `${baseBillApi}/${bill._id}/registSchedule`,
          payload
        );
      }
      await refetch();
      refetchListBill && (await refetchListBill());

      toast.update(toastId, {
        render: "Success",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      save(cachedKeys.LOADING_APP, false);
    } catch (error) {
      toast.update(toastId, {
        render: "Failed",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      save(cachedKeys.LOADING_APP, false);
    }
  };

  //! Render
  return (
    <Fragment>
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
            Mail scheduler
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
      <DialogContent
        sx={{
          position: "relative",
        }}
      >
        <CommonStyles.LoadingOverlay isLoading={isLoading} />
        <Box
          sx={{
            display: "grid",
            gap: "12px",
            rowGap: "20px",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            padding: "12px",
          }}
        >
          {!isEmpty(data) &&
            data.map((elm) => {
              const isRegistedToThis = elm._id === bill.scheduler;
              const rule = RRule.fromString(elm.endRule);
              return (
                <Box
                  key={elm._id}
                  sx={{
                    borderRadius: "12px",
                    border: `solid 1px ${
                      elm.isActive ? "#c1ffe7" : theme.palette.error.main
                    }`,
                    overflow: "hidden",
                    boxShadow: `0 0 8px rgba(0,0,0,0.1)`,
                    background: "#fff",
                    transition: "all 0.3s",
                    cursor: "pointer",
                    "&:hover": {
                      boxShadow: `0 0 12px rgba(0,0,0,0.3)`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      padding: "8px 16px",
                      background: elm.isActive
                        ? theme.palette.success.light
                        : theme.palette.error.light,
                      borderBottom: `solid 1px ${
                        elm.isActive ? "#c1ffe7" : theme.palette.error.main
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <CommonStyles.Typography type="bold14">
                      {capitalize(rule.toText())} in{" "}
                      {moment(rule.origOptions.dtstart).format("Do")}
                    </CommonStyles.Typography>
                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      {!isRegisted && (
                        <CommonStyles.Button
                          isIcon
                          onClick={(e) => handleClick(e, elm._id, true)}
                          tooltip="Register to this scheduler"
                        >
                          <CommonIcons.Add />
                        </CommonStyles.Button>
                      )}
                      {isRegistedToThis && (
                        <CommonStyles.Button
                          isIcon
                          onClick={(e) => handleClick(e, elm._id, false)}
                          tooltip="Unregister to this scheduler"
                        >
                          <CommonIcons.Remove />
                        </CommonStyles.Button>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      padding: "12px",
                    }}
                  >
                    <CommonStyles.Typography>
                      Send to: <b>{elm.targetMail}</b>
                    </CommonStyles.Typography>
                    <CommonStyles.Typography>Bills :</CommonStyles.Typography>
                    <ul
                      style={{
                        marginTop: "0",
                      }}
                    >
                      {elm.bills.map((bill) => {
                        return (
                          <li key={bill._id}>
                            <CommonStyles.Typography type="bold14">
                              {bill.room.name} :{" "}
                              {bill.contents
                                ?.reduce((acc: number, elm: any) => {
                                  return acc + elm.price;
                                }, 0)
                                ?.toLocaleString("vi-VN")}
                            </CommonStyles.Typography>
                          </li>
                        );
                      })}
                    </ul>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </DialogContent>
    </Fragment>
  );
};

export default ListSchedulerDialog;
