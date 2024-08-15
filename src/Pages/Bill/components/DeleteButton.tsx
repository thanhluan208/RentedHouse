import { Fragment } from "react/jsx-runtime";
import CommonIcons from "../../../Components/CommonIcons";
import CommonStyles from "../../../Components/CommonStyles";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { toast } from "react-toastify";
import BillServices from "../../../Services/Bill.service";
import { useGet } from "../../../Stores/useStore";

interface IDeleteButton {
  billId: string;
}

const DeleteButton = (props: IDeleteButton) => {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();
  const refetchListBill = useGet("REFETCH_BILL_LIST");

  //! Function
  const handleDelete = async () => {
    const loading = toast.loading("Deleting...", {
      isLoading: true,
      autoClose: false,
    });
    try {
      await BillServices.deleteBill(props.billId);

      refetchListBill && (await refetchListBill());

      toast.update(loading, {
        render: "Delete successfully!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      console.log("Delete bill failed!", error);
      toast.update(loading, {
        render: "Delete failed!",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog toggle={toggle} open={open} onClose={(e: any) => {
            e.stopPropagation();
            toggle();
        }}>
          <CommonStyles.ConfirmDialog
            toggle={toggle}
            content="Do you want to delete this bill?"
            handleConfirm={handleDelete}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button isIcon color="error" onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}>
        <CommonIcons.Delete />
      </CommonStyles.Button>
    </Fragment>
  );
};

export default DeleteButton;
