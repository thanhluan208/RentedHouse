import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import { BillActionDialog } from "../../HouseDetail/components/GenBill/CreateBillButton";
import cachedKeys from "../../../Constants/cachedKeys";


const AddBillButton = () => {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          toggle={toggle}
          open={open}
          onClose={(e: any) => {
            e.stopPropagation();
            toggle();
          }}
          maxWidth="lg"
        >
          <BillActionDialog toggle={toggle} refetchKey={cachedKeys.REFETCH_BILL_LIST}/>
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button onClick={toggle} variant="contained">Add Bill</CommonStyles.Button>
    </Fragment>
  );
};

export default AddBillButton;
