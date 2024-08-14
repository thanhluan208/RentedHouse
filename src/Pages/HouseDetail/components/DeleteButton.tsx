import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import ConfirmDialog from "../../../Components/CommonStyles/ConfirmDialog";
import { toast } from "react-toastify";
import CommonIcons from "../../../Components/CommonIcons";
import { useGet } from "../../../Stores/useStore";
import { Tooltip } from "@mui/material";
import { Room } from "../../Home/interface";
import RoomServices from "../../../Services/Room.service";

interface IDeleteButton {
  data: Room;
}

function DeleteButton(props: IDeleteButton) {
  //! State
  const { data } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const refetchListRoom = useGet("REFETCH_HOUST_DETAIL");

  //! Function
  const handleDelete = async () => {
    if (!data?._id) return;

    const toastId = toast.loading(`Deleting room ${data.name}...`, {
      isLoading: true,
      autoClose: false,
    });

    try {
      await RoomServices.deleteRoom(data._id);
      
      await refetchListRoom();

      toast.update(toastId, {
        render: `Delete room ${data.name} successfully`,
        type: "success",
        autoClose: 3000,
        isLoading: false,
      });

      toggle();
    } catch (error: any) {
      console.log("err", error);
      toast.update(toastId, {
        render: `Delete room ${data.name} failed: ` + error.message,
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
    }
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
