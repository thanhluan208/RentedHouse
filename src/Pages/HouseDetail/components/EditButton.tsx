import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import { Tooltip } from "@mui/material";
import { Room } from "../../Home/interface";
import { RoomActionDialog } from "./AddRoomButton";
import { useParams } from "react-router-dom";

interface IEditButton {
  data: Room;
}

function EditButton(props: IEditButton) {
  //! State
  const { data } = props;
  const { open, shouldRender, toggle } = useToggleDialog();
  const { id } = useParams();

  //! Function
  
  //! Render
  return (
    <Fragment>
      {shouldRender && id && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="lg"
          fullWidth
          disableClickOutside
        >
          <RoomActionDialog data={data} toggle={toggle} houseId={id} />
        </CommonStyles.Dialog>
      )}
      <Tooltip title={"Edit room"}>
        <div
          style={{
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <CommonStyles.Button
            onClick={(event) => {
              event.stopPropagation();
              toggle();
            }}
            isIcon
            color="primary"
          >
            <CommonIcons.Edit />
          </CommonStyles.Button>
        </div>
      </Tooltip>
    </Fragment>
  );
}

export default EditButton;
