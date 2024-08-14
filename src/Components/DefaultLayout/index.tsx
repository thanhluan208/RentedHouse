import { Box, Divider, useTheme } from "@mui/material";
import CommonStyles from "../CommonStyles";
import Routes from "../../Constants/routes";
import { processNavLabel } from "../../Helpers";
import { Outlet } from "react-router-dom";
import { capitalize } from "lodash";
import NavItem from "./Components/NavItem";
import PerfectScrollbar from "react-perfect-scrollbar";
import CreateHouseButton from "./Components/CreateHouseButton";

export const sidebarWidth = 232;

function DefaultLayout() {
  //! State
  const theme: any = useTheme();

  //! Function

  //! Render
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
      }}
    >
      <PerfectScrollbar
        style={{
          maxHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: sidebarWidth,
            height: "100%",
            padding: "24px 16px",
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
              }}
            >
              <CommonStyles.Typography type="bold24">Dashboard</CommonStyles.Typography>
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
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default DefaultLayout;
