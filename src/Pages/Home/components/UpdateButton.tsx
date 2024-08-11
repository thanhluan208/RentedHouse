import CommonStyles from "../../../Components/CommonStyles";
import { House } from "../interface";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { Fragment } from "react/jsx-runtime";
import { CreateHouseDialog } from "../../../Components/DefaultLayout/Components/CreateHouseButton";
import CommonIcons from "../../../Components/CommonIcons";

interface IUpdateButton {
  data: House;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

const UpdateButton = (props: IUpdateButton) => {
  //! State
  const { data, setAnchorEl } = props;
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

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
          <CreateHouseDialog
            toggle={() => {
              toggle();
              setAnchorEl(null);
            }}
            data={data}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        sx={{ width: "120px" }}
        color="info"
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        startIcon={<CommonIcons.Update />}
      >
        Update
      </CommonStyles.Button>
    </Fragment>
  );
};

export default UpdateButton;
