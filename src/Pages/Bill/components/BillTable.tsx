import { Box } from "@mui/material";
import { BillResponse } from "../../../Hooks/useGetBill";
import CommonStyles from "../../../Components/CommonStyles";
import { Column } from "../../../Components/CommonStyles/Table";
import { useNavigate } from "react-router-dom";
import { Fragment, useCallback, useMemo } from "react";
import { Paths } from "../../../Constants/routes";
import moment from "moment";
import PaidButton from "./PaidButton";
import { BillStatus } from "../../../Interfaces/common";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";
import { BillActionDialog } from "../../HouseDetail/components/GenBill/GenPdfButton";
import BillServices from "../../../Services/Bill.service";
import DeleteButton from "./DeleteButton";
import { CommonFilter } from "../../Home/interface";

interface IBillTable {
  data: BillResponse[];
  filters?: CommonFilter;
  total?: number;
  changePage?: (page: number) => void;
  changePageSize?: (pageSize: number) => void;
}

const BillTable = (props: IBillTable) => {
  //! State
  const { data } = props;
  const navigate = useNavigate();
  const save = useSave();
  const { open, toggle, shouldRender } = useToggleDialog();

  //! Function
  const onClickGuest = useCallback(
    (id: string) => {
      navigate(`${Paths.guest}/${id}`);
    },
    [navigate]
  );

  const onClickRoom = useCallback(
    (id: string) => {
      navigate(`${Paths.room}/${id}`);
    },
    [navigate]
  );

  const clickRow = useCallback(
    (row: BillResponse) => {
      save(cachedKeys.BILL_DETAIL, BillServices.parseResponseBill(row));
      toggle();
    },
    [save]
  );

  //! Render
  const columns: Column<BillResponse>[] = useMemo(() => {
    return [
      {
        id: "STT",
        label: "STT",
        width: 50,
        customRender: (_, rowIndex) => {
          return (
            <CommonStyles.Typography type="bold14" ml={1}>
              {rowIndex + 1 + (props.filters?.page || 0) * (props.filters?.pageSize || 0)}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "guest",
        label: "Guest",
        customRender: (row) => {
          return (
            <CommonStyles.Typography
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#4e40e5",
                  fontWeight: "600",
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClickGuest(row.guest._id);
              }}
            >
              {row.guest.name}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "room",
        label: "Room",
        customRender: (row) => {
          return (
            <CommonStyles.Typography
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                  color: "#4e40e5",
                  fontWeight: "600",
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClickRoom(row.room._id);
              }}
            >
              {row.room.name}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "status",
        label: "Status",
        customRender: (row) => {
          const color =
            row.status.toLowerCase() === "paid" ? "success" : "warning";
          return (
            <CommonStyles.Chip
              color={color}
              label={row.status}
              sx={{
                width: "fit-content",
              }}
            />
          );
        },
      },
      {
        id: "payDate",
        label: "Pay Date",
        customRender: (row) => {
          return (
            <CommonStyles.Typography>
              {row.payDate ? moment(row.payDate).format("DD/MM/YYYY") : ""}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "startDate",
        label: "Start Date",
        customRender: (row) => {
          return (
            <CommonStyles.Typography>
              {moment(row.startDate).format("DD/MM/YYYY")}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "endDate",
        label: "End Date",
        customRender: (row) => {
          return (
            <CommonStyles.Typography>
              {moment(row.endDate).format("DD/MM/YYYY")}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "createdAt",
        label: "Created At",
        customRender: (row) => {
          return (
            <CommonStyles.Typography>
              {moment(row.createdAt).format("DD/MM/YYYY")}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "action",
        label: "",
        customRender: (row) => {
          return (
            <Box
              sx={{
                display: "flex",
                gap: "10px",
              }}
            >
              {row.status.toLowerCase() === BillStatus.UNPAID && (
                <PaidButton data={row} />
              )}
              <DeleteButton billId={row?._id} />
            </Box>
          );
        },
      },
    ];
  }, [onClickGuest, onClickRoom, props.filters?.page, props.filters?.pageSize, data]);

  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          onClose={toggle}
          maxWidth="lg"
        >
          <BillActionDialog toggle={toggle} refetchKey={cachedKeys.REFETCH_BILL_LIST}/>
        </CommonStyles.Dialog>
      )}
      <Box sx={{ width: "100%" }}>
        <CommonStyles.Table
          columns={columns}
          data={data}
          onClickRow={clickRow}
          filters={props.filters}
          total={props.total}
          changePage={props.changePage}
          changePageSize={props.changePageSize}
        />
      </Box>
    </Fragment>
  );
};

export default BillTable;
