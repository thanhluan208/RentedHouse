import {
  Avatar,
  Box,
  ClickAwayListener,
  Fade,
  Paper,
  Popper,
} from "@mui/material";
import NavItem from "./NavItem";
import React, { Fragment } from "react";
import CommonStyles from "../../CommonStyles";

interface IUserButton {}

function UserButton(props: IUserButton) {
  //! State
  const {} = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const open = !!anchorEl;

  //! Function

  //! Render
  return (
    <Fragment>
      <Box onBlur={() => setAnchorEl(null)}>
        <NavItem
          icon={
            <Avatar src="https://lh3.googleusercontent.com/ogw/AF2bZyiUe-0HqdEyjNfKkkYM8ULbAwTiS0y9gqiDuJ8cvadeXw=s32-c-mo" />
          }
          title="Thanh Luan"
          navActive
          buttonSx={{
            mt: "12px",
            height: "fit-content",
          }}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            setAnchorEl(event.currentTarget);
          }}
        />
      </Box>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={"top-start"}
        transition
        keepMounted={false}
        onBlur={() => setAnchorEl(null)}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              sx={{
                padding: "8px ",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                button: {
                  color: "#000",
                  fontWeight: 500,
                },
              }}
            >
              <CommonStyles.Button onClick={() => alert("hehe")}>
                Settings
              </CommonStyles.Button>
              <CommonStyles.Button>Log out</CommonStyles.Button>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Fragment>
  );
}

export default UserButton;
