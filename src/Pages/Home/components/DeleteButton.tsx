import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import ConfirmDialog from "../../../Components/CommonStyles/ConfirmDialog";
import { House } from "../interface";
import { toast } from "react-toastify";
import CommonIcons from "../../../Components/CommonIcons";
import FirebaseServices from "../../../Services/Firebase.service";
import { useGet } from "../../../Stores/useStore";

interface IDeleteButton {
  data: House;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function DeleteButton(props: IDeleteButton) {
  //! State
  const { data, setAnchorEl } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const refetchHouseList = useGet('REFETCH_HOUSE_LIST')

  //! Function
  const handleDelete = async () => {
    if (!data?.id) return;

    const toastId = toast.loading(`Deleting ${data.name}...`, {
      isLoading: true,
      autoClose: false,
    });

    const onFailed = (err: any) => {
      toast.update(toastId, {
        render: `Delete ${data.name} failed: ` + err,
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
    };

    await FirebaseServices.deleteHouse(data.id, onFailed);

    await refetchHouseList();

    toast.update(toastId, {
      render: `Delete ${data.name} successfully`,
      type: "success",
      autoClose: 3000,
      isLoading: false,
    });

    toggle();
    setAnchorEl(null);
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
            content={`Confirm delete ${data.name}`}
            toggle={toggle}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        fullWidth
        startIcon={<CommonIcons.Delete />}
        onClick={(event) => {
          event.stopPropagation();
          toggle()
        }}
        color="error"
      >
        Delete
      </CommonStyles.Button>
    </Fragment>
  );
}

export default DeleteButton;
