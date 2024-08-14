import { Box } from "@mui/material";
import { Fragment } from "react/jsx-runtime";
import CommonStyles from "..";
import { useState } from "react";
import CommonIcons from "../../CommonIcons";
import { isString } from "lodash";
import { Collapse as MUICollapse } from "@mui/material";

interface ICollapse {
  title: string | React.ReactNode;
  children: React.ReactNode;
}

const Collapse = (props: ICollapse) => {
  //! State
  const [open, setOpen] = useState(true);

  //! Function

  //! Render
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {isString(props.title) ? (
          <CommonStyles.Typography type="bold16" mb={2}>
            {props.title}
          </CommonStyles.Typography>
        ) : (
          props.title
        )}
        <CommonIcons.KeyboardArrowDown
          sx={{
            cursor: "pointer",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        />
      </Box>
      <MUICollapse in={open}>{props.children}</MUICollapse>
    </Fragment>
  );
};

export default Collapse;
