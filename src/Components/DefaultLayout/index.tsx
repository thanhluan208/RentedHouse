import { Box, Divider, useTheme } from "@mui/material";
import CommonStyles from "../CommonStyles";
import Routes from "../../Constants/routes";
import { processNavLabel } from "../../Helpers";
import { Outlet } from "react-router-dom";
import { capitalize } from "lodash";
import NavItem from "./Components/NavItem";
import PerfectScrollbar from "react-perfect-scrollbar";
import CreateHouseButton from "./Components/CreateHouseButton";
import CommonIcons from "../CommonIcons";
import { useGet, useSave } from "@/Stores/useStore";

function DefaultLayout() {
  //! State
  const theme: any = useTheme();
  const save = useSave();

  const open = useGet("OPEN_SIDEBAR");
  const sidebarWidth = open ? 232 : 0;

  //! Function
  const setOpen = (value: boolean) => {
    save("OPEN_SIDEBAR", value);
  };

  //! Render
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        position: "relative",
      }}
    >
      {!open && (
        <Box
          sx={{
            position: "absolute",
            height: "100%",
            zIndex: 10000,
            left: 0,
            top: 0,
            opacity: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s",
            "&:hover": {
              opacity: 1,
              background: 'rgba(0, 0, 0, 0.6)',
            },
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '0 10px 10px 0',
            cursor: 'pointer'
          }}
          onClick={() => setOpen(true)}
        >
            <CommonIcons.KeyboardDoubleArrowRight />
        </Box>
      )}
      <PerfectScrollbar
        style={{
          maxHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: sidebarWidth,
            height: "100%",
            padding: open ? "24px 16px" : "0",
            transition: "all 0.3s",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                height: "40px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <CommonStyles.Typography type="bold24">
                Dashboard
              </CommonStyles.Typography>
              <CommonStyles.Button
                isIcon
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CommonIcons.KeyboardDoubleArrowLeft />
              </CommonStyles.Button>
            </Box>
            <Box sx={{ height: "40px" }}>
              <CreateHouseButton />
            </Box>
          </Box>
          <Box mt={2}>
            {Object.entries(Routes).map(([keyPar, valPar]) => {
              return (
                <Box
                  key={keyPar}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                  mt={2}
                >
                  {keyPar !== "common" && (
                    <CommonStyles.Typography
                      type="normal14"
                      pl={"15px"}
                      color={theme.colors.custom.colorDisabledTypo}
                    >
                      {capitalize(keyPar)}
                    </CommonStyles.Typography>
                  )}

                  {Object.entries(valPar).map(([keyChi, valChi]) => {
                    return (
                      <NavItem
                        icon={valChi.icon}
                        title={processNavLabel(keyChi)}
                        path={valChi.path}
                        key={keyChi}
                      />
                    );
                  })}

                  <Divider
                    sx={{
                      mt: "8px",
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>
      </PerfectScrollbar>
      <Box
        sx={{
          width: `calc(100vw - ${sidebarWidth}px)`,
          height: "100vh",
          overflowY: "auto",
          backgroundColor: theme.colors.custom.backgroundSecondary,
          transition: "all 0.3s",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default DefaultLayout;
