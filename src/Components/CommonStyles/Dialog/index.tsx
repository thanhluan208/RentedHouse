import {
  Dialog,
  DialogProps,
  useTheme,
} from "@mui/material";
import React from "react";

interface IMUIDialog {
  children: React.ReactNode;
  toggle: () => void;
  disableClickOutside?: boolean;
}

function MUIDialog(props: IMUIDialog & DialogProps) {
  //! State
  const { children, toggle, disableClickOutside } = props;
  const theme: any = useTheme();
  //! Function

  //! Render
  return (
    <Dialog
      onClose={(event: any, reason) => {
        event.stopPropagation();
        if (reason === "backdropClick" && disableClickOutside) return;
        toggle()
      }}
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
