import CommonStyles from "@/Components/CommonStyles";
import { Column } from "@/Components/CommonStyles/Table";
import cachedKeys from "@/Constants/cachedKeys";
import { BillResponse } from "@/Hooks/useGetBill";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { BillActionDialog } from "@/Pages/HouseDetail/components/GenBill/CreateBillButton";
import BillServices from "@/Services/Bill.service";
import { useSave } from "@/Stores/useStore";
import { Box } from "@mui/material";
import moment from "moment";
import { useCallback, useMemo } from "react";
import RemoveBillButton from "../RemoveBillButton";

const SchedulerBills = ({ bills }: { bills: BillResponse[] }) => {
  //! State
  const { open, shouldRender, toggle: toggleBillDetail } = useToggleDialog();
  const save = useSave();
  //! Function
  const clickRow = useCallback(
    (row: BillResponse) => {
      save(cachedKeys.BILL_DETAIL, BillServices.parseResponseBill(row));
      toggleBillDetail();
    },
    [save, toggleBillDetail]
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
              {row?.room?.name}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "start",
        label: "Start Date",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row?.startDate
                ? moment(row?.startDate).format("DD/MM/YYYY")
                : "Unpaid"}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "end",
        label: "End Date",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row?.endDate
                ? moment(row?.endDate).format("DD/MM/YYYY")
                : "Unpaid"}
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
              {row?.contents
                ?.reduce((acc, elm) => {
                  return acc + elm.price;
                }, 0)
                ?.toLocaleString("vi-VN")}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "action",
        label: "Action",
        width: 100,
        customRender: (row) => {
          return (
            <Box>
              <RemoveBillButton row={row} />
            </Box>
          );
        },
      },
    ];
  }, []);

  return (
    <Box mt="20px">
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
      <CommonStyles.Table
        data={bills}
        columns={columns}
        onClickRow={clickRow}
        styleBody={{
          minHeight: "unset",
          height: "fit-content",
        }}
      />
    </Box>
  );
};

export default SchedulerBills;
