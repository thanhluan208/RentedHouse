import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ReactNode } from "react";
import CommonStyles from "..";
import CommonIcons from "../../CommonIcons";

interface IConfirmDialog {
  handleConfirm: () => void;
  toggle: () => void;
  content: ReactNode | string;
}

const ConfirmDialog = (props: IConfirmDialog) => {
  //! State
  const { toggle, handleConfirm, content } = props;

  //! Function

  //! Render
  return (
    <Box>
      <DialogTitle>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <CommonStyles.Typography type="bold18">
            Confirm delete
          </CommonStyles.Typography>
          <CommonStyles.Button isIcon onClick={toggle}>
            <CommonIcons.Clear />
          </CommonStyles.Button>
        </Box>
      </DialogTitle>

      <DialogContent>
        <CommonStyles.Typography type="bold16">
          {content || "Do you want to delete ?"}
        </CommonStyles.Typography>
      </DialogContent>

      <DialogActions>
        <Box
          display="flex"
          justifyContent={"end"}
          gap="16px"
          sx={{
            button: {
              fontWeight: "550",
              padding: "6px 20px",
            },
          }}
        >
          <CommonStyles.Button
            variant="contained"
            sx={{
              background: "#fff",
              color: "#000",
              "&:hover": {
                background: "#fff",
              },
            }}
            onClick={toggle}
            type="button"
          >
            Cancel
          </CommonStyles.Button>
          <CommonStyles.Button
            variant="contained"
            sx={{
              color: "#fff",
            }}
            type="submit"
            color="error"
            onClick={handleConfirm}
          >
            Confirm
          </CommonStyles.Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default ConfirmDialog;
