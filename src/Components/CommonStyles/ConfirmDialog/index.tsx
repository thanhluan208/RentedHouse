import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ReactNode, useEffect } from "react";
import CommonStyles from "..";
import CommonIcons from "../../CommonIcons";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";

interface IConfirmDialog {
  handleConfirm: () => void;
  toggle: () => void;
  content: ReactNode | string;
  title?: ReactNode | string;
}

const ConfirmDialog = (props: IConfirmDialog) => {
  //! State
  const { toggle, handleConfirm, content, title = "Confirm delete" } = props;
  const save = useSave();
  //! Function
  useEffect(() => {
    save(cachedKeys.DIALOG_OPEN, true);

    return () => {
      save(cachedKeys.DIALOG_OPEN, false);
    };
  }, []);

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
            {title}
          </CommonStyles.Typography>
          <CommonStyles.Button
            isIcon
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
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
            onClick={(e) => {
              e.stopPropagation();
              handleConfirm();
            }}
          >
            Confirm
          </CommonStyles.Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default ConfirmDialog;
