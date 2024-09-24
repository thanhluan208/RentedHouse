import { useGet, useSave } from "@/Stores/useStore";
import CommonStyles from "..";
import CommonIcons from "@/Components/CommonIcons";
import cachedKeys from "@/Constants/cachedKeys";
import { Box } from "@mui/material";

const OpenSidebarButton = ({ title }: { title: string }) => {
  //! State
  const save = useSave();
  const openSidebar = useGet("OPEN_SIDEBAR");

  //! Function

  //! Render

  return (
    <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
      {!openSidebar && (
        <CommonStyles.Button
          isIcon
          onClick={() => {
            save(cachedKeys.OPEN_SIDEBAR, true);
          }}
        >
          <CommonIcons.KeyboardDoubleArrowLeft />
        </CommonStyles.Button>
      )}
      <Box>
        <CommonStyles.Typography type="bold18">{title}</CommonStyles.Typography>
      </Box>
    </Box>
  );
};

export default OpenSidebarButton;
