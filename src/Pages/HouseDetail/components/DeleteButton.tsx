import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import ConfirmDialog from "../../../Components/CommonStyles/ConfirmDialog";
import { toast } from "react-toastify";
import CommonIcons from "../../../Components/CommonIcons";
import FirebaseServices from "../../../Services/Firebase.service";
import { useGet } from "../../../Stores/useStore";
import { RoomDetail } from "../../../Hooks/useGetRoomDetail";
import { Tooltip } from "@mui/material";

interface IDeleteButton {
  data: RoomDetail;
}

function DeleteButton(props: IDeleteButton) {
  //! State
  const { data } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const refetchHouseList = useGet("REFETCH_HOUSE_LIST");

  //! Function
  const handleDelete = async () => {
    if (!data?.id) return;

    const toastId = toast.loading(`Deleting room ${data.name}...`, {
      isLoading: true,
      autoClose: false,
    });

    const onFailed = (err: any) => {
      toast.update(toastId, {
        render: `Delete room ${data.name} failed: ` + err,
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
    };

    await FirebaseServices.deleteRoom(data.id, data.house_id, onFailed);

    await refetchHouseList();

    toast.update(toastId, {
      render: `Delete room ${data.name} successfully`,
      type: "success",
      autoClose: 3000,
      isLoading: false,
    });

    toggle();
  };

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
          disableClickOutside
        >
          <ConfirmDialog
            handleConfirm={handleDelete}
            content={`Confirm delete room ${data.name}`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}
      <Tooltip
        title={data.guests.length > 0 ? "Remove all guests to delete room" : ""}
      >
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <CommonStyles.Button
            fullWidth
            startIcon={<CommonIcons.Delete />}
            onClick={(event) => {
              if (data.guests?.length > 0) return;
              event.stopPropagation();
              toggle();
            }}
            disabled={data.guests?.length > 0}
            color="error"
            isIcon
          >
            <CommonIcons.Delete />
          </CommonStyles.Button>
        </div>
      </Tooltip>
    </Fragment>
  );
}

export default DeleteButton;
