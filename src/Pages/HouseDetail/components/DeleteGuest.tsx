import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import ConfirmDialog from "../../../Components/CommonStyles/ConfirmDialog";
import { toast } from "react-toastify";
import CommonIcons from "../../../Components/CommonIcons";
import FirebaseServices from "../../../Services/Firebase.service";
import { useGet } from "../../../Stores/useStore";
import { GuestInit } from "./AddRoomButton";
import { RoomDetail } from "../../../Hooks/useGetRoomDetail";

interface IDeleteGuest {
  data: GuestInit;
  roomData: RoomDetail;
}

function DeleteGuest(props: IDeleteGuest) {
  //! State
  const { data, roomData } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const refetchRoomOverView = useGet("REFETCH_ROOM_OVERVIEW");

  //! Function
  const handleDelete = async () => {
    if (!data?.id) return;

    const toastId = toast.loading(
      `Removing ${data.name} from ${roomData.name}...`,
      {
        isLoading: true,
        autoClose: false,
      }
    );

    const onFailed = (err: any) => {
      toast.update(toastId, {
        render: `Remove ${data.name} failed: ` + err,
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
    };

    await FirebaseServices.removeGuestFromRoom(data.id, roomData, onFailed);

    await refetchRoomOverView();

    toast.update(toastId, {
      render: `Remove ${data.name} successfully`,
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
            content={`Confirm remove ${data.name} from ${roomData.name} ?`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}

      <CommonStyles.Button
        fullWidth
        startIcon={<CommonIcons.Delete />}
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        color="error"
        isIcon
      >
        <CommonIcons.Delete />
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteGuest;
