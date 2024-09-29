import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Column } from "@/Components/CommonStyles/Table";
import cachedKeys from "@/Constants/cachedKeys";
import { monthTextToNum } from "@/Helpers";
import useGetListBill, { BillResponse } from "@/Hooks/useGetBill";
import useToggleDialog from "@/Hooks/useToggleDialog";
import BillServices from "@/Services/Bill.service";
import { useGet, useSave } from "@/Stores/useStore";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { capitalize, cloneDeep, isEmpty } from "lodash";
import moment, { Moment } from "moment";
import { useCallback, useMemo } from "react";
import { Fragment } from "react/jsx-runtime";
import { BillActionDialog } from "../../GenBill/CreateBillButton";

interface IEachCellDetail {
  month: string;
  content: string;
  type: "income" | "expense";
  toggle: () => void;
}
const EachCellDetail = (props: IEachCellDetail) => {
  //! State
  const { month, content, type, toggle } = props;
  const { open, shouldRender, toggle: toggleBillDetail } = useToggleDialog();
  const year: Moment = useGet("YEAR");
  const theme = useTheme();
  const save = useSave();
  const payload = useMemo(() => {
    const payDate = year.set("month", monthTextToNum(capitalize(month)) - 1);

    return {
      payDate: payDate.startOf("month").toDate(),
      isExpense: type === "expense",
      page: 0,
      pageSize: 20,
    };
  }, [year, month]);

  const { data, isLoading } = useGetListBill(payload);

  const filterData: BillResponse[] = useMemo(() => {
    if (isEmpty(data)) return [];

    return cloneDeep(data)
      .map((item) => {
        return {
          ...item,
          contents: cloneDeep(item.contents).filter((elm) => {
            if (content) {
              return elm.name === content;
            }
            return elm;
          }),
        };
      })
      .filter((item) => !isEmpty(item.contents))
      .sort((a, b) => {
        return a.room?.name.localeCompare(b.room?.name);
      });
  }, [data]);

  //! Function
  const clickRow = useCallback(
    (row: BillResponse) => {
      const bill = data.find((elm) => elm._id === row._id);
      if (!bill) return;
      save(cachedKeys.BILL_DETAIL, BillServices.parseResponseBill(bill));
      toggleBillDetail();
    },
    [save, data, toggleBillDetail]
  );

  //! Render
  const columns: Column<BillResponse>[] = useMemo(() => {
    return [
      {
        id: "id",
        label: "STT",
        width: 50,
        customRender: (_, rowIndex: number) => {
          return (
            <CommonStyles.Typography type="bold14">
              {rowIndex + 1}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "guest",
        label: "Guest",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row?.guest?.name ?? "--"}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "room",
        label: "Room",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row.room.name}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "payDate",
        label: "Pay Date",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {moment(row.payDate).format("DD/MM/YYYY")}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "price",
        label: "Price",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row.contents
                .reduce((acc, elm) => {
                  return acc + elm.price;
                }, 0)
                .toLocaleString("vi-VN")}
            </CommonStyles.Typography>
          );
        },
      },
    ];
  }, []);

  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggleBillDetail}
          onClose={toggleBillDetail}
          maxWidth="lg"
          fullWidth
        >
          <BillActionDialog
            toggle={toggleBillDetail}
            refetchKey={cachedKeys.REFETCH_BILL_LIST}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <CommonStyles.Typography type="bold24">
              {content || `Total ${capitalize(type)}`} -{" "}
              {monthTextToNum(capitalize(month))}/{year.format("YYYY")}
            </CommonStyles.Typography>
            {content && (
              <Box
                sx={{
                  background:
                    type === "expense"
                      ? theme.palette.error.main
                      : theme.palette.success.main,
                  width: "fit-content",
                  padding: "4px 12px",
                  height: "fit-content",
                  borderRadius: "8px",
                  color: theme.palette.error.contrastText,
                }}
              >
                <CommonStyles.Typography type="bold12">
                  {capitalize(type)}
                </CommonStyles.Typography>
              </Box>
            )}
          </Box>
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
        <CommonStyles.Table
          data={filterData}
          columns={columns}
          onClickRow={clickRow}
        />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-start",
            padding: "20px 24px 10px",
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <CommonStyles.Typography type="normal18">
            <b>Total</b> :{" "}
            {filterData
              .reduce((acc, elm) => {
                return (
                  acc +
                  elm.contents.reduce((acc2, elm2) => {
                    return acc2 + elm2.price;
                  }, 0)
                );
              }, 0)
              .toLocaleString("vi-VN")}
          </CommonStyles.Typography>
        </Box>
      </DialogActions>
    </Fragment>
  );
};

export default EachCellDetail;
