import { Box } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";
import { useNavigate } from "react-router-dom";
import { Fragment, useCallback, useMemo } from "react";
import { Paths } from "../../../Constants/routes";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import cachedKeys from "../../../Constants/cachedKeys";
import { BillActionDialog } from "../../HouseDetail/components/GenBill/CreateBillButton";
import { CommonFilter } from "../../Home/interface";
import { GuestDetail } from "../../../Hooks/useGetGuestDetail";
import { Column } from "../../../Components/CommonStyles/Table";
import DeleteGuest from "./DeleteGuest";
import moment from "moment";

interface IGuestTable {
  data: GuestDetail[];
  filters?: CommonFilter;
  total?: number;
  changePage?: (page: number) => void;
  changePageSize?: (pageSize: number) => void;
}

const GuestTable = (props: IGuestTable) => {
  //! State
  const { data } = props;
  const navigate = useNavigate();
  const { open, toggle, shouldRender } = useToggleDialog();

  //! Function
  const onClickRow = useCallback(
    (row: GuestDetail) => {
      navigate(`${Paths.guest}/${row._id}`);
    },
    [navigate]
  );

  //! Render
  const columns: Column<GuestDetail>[] = useMemo(() => {
    return [
      {
        id: "name",
        label: "Name",
      },
      {
        id: "room",
        label: "Room",
        customRender: (row) => {
          return (
            <CommonStyles.Typography>{row?.room?.name}</CommonStyles.Typography>
          );
        },
      },
      {
        id: "phone",
        label: "Phone",
      },
      {
        id: "gender",
        label: "Gender",
      },
      {
        id: "dob",
        label: "Date of Birth",
        customRender: (row) => {
          return (
            <CommonStyles.Typography>
              {row?.dob ? moment(row.dob).format('DD/MM/YYYY') : ''}
            </CommonStyles.Typography>
          )
        }
      },
      {
        id:'action',
        label: '',
        customRender: (row) => {
          return(
            <DeleteGuest data={row} />
          )
        },
        width:50
      }
    ];
  }, []);

  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          onClose={toggle}
          maxWidth="lg"
        >
          <BillActionDialog
            toggle={toggle}
            refetchKey={cachedKeys.REFETCH_BILL_LIST}
          />
        </CommonStyles.Dialog>
      )}
      <Box sx={{ width: "100%" }}>
        <CommonStyles.Table
          columns={columns}
          data={data}
          onClickRow={onClickRow}
          filters={props.filters}
          total={props.total}
          changePage={props.changePage}
          changePageSize={props.changePageSize}
        />
      </Box>
    </Fragment>
  );
};

export default GuestTable;
