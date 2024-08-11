import { House } from "../interface";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import { Box, Paper, Popover } from "@mui/material";
import React, { useId } from "react";
import DeleteButton from "./DeleteButton";
import UpdateButton from "./UpdateButton";

interface IMoreButton {
  data: House;
}

const MoreButton = (props: IMoreButton) => {
  //! State
  const { data } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const id = useId();

  //! Function
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  //! Render
  const open = Boolean(anchorEl);

  return (
    <Box>
      <CommonStyles.Button
        onClick={handleOpen}
        sx={{
          transform: "translateX(35%)",
        }}
      >
        <CommonIcons.MoreHoriz
          sx={{
            color: "#000",
          }}
        />
      </CommonStyles.Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper
          sx={{
            padding: "10px 20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <UpdateButton data={data} setAnchorEl={setAnchorEl}/>
          <DeleteButton data={data} setAnchorEl={setAnchorEl}/>
        </Paper>
      </Popover>
    </Box>
  );
};

export default MoreButton;
