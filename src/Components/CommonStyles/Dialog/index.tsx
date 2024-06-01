import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  useTheme,
} from "@mui/material";
import React from "react";
import CommonStyles from "..";

interface IMUIDialog {
  children: React.ReactNode;
  toggle: () => void;
}

function MUIDialog(props: IMUIDialog & DialogProps) {
  //! State
  const { children, toggle } = props;
  const theme = useTheme();
  //! Function

  //! Render
  return (
    <Dialog
      onClose={toggle}
      {...props}
      PaperProps={{
        sx: {
          background: theme.colors.custom.backgroundDialog,
        },
      }}
    >
      {children}
    </Dialog>
  );
}

export default MUIDialog;
