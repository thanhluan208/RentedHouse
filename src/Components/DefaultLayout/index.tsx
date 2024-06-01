import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import Logo from "./Components/Logo";
import Name from "./Components/Name";
import CommonStyles from "../CommonStyles";
import CommonIcons from "../CommonIcons";
import Routes from "../../Constants/routes";
import { processNavLabel } from "../../Helpers";
import { Outlet } from "react-router-dom";
import { capitalize } from "lodash";
import NavItem from "./Components/NavItem";
import AddTeam from "./Components/AddTeams";
import ListTeam from "./Components/ListTeam";
import UserButton from "./Components/UserButton";
import PerfectScrollbar from "react-perfect-scrollbar";
import CreateBotButton from "./Components/CreateBotButton";

export const sidebarWidth = 232;

function DefaultLayout() {
  //! State
  const theme = useTheme();

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
              <Logo />
              <Name />
            </Box>
            <Box sx={{ height: "40px" }}>
              <CreateBotButton />
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
            <Box mt={1} display="flex" flexDirection={"column"}>
              <Box display="flex" justifyContent={"space-between"}>
                <CommonStyles.Typography
                  type="normal14"
                  pl={"15px"}
                  color={theme.colors.custom.colorDisabledTypo}
                >
                  Teams
                </CommonStyles.Typography>
                <AddTeam />
              </Box>

              <ListTeam />
            </Box>
            <Divider
              sx={{
                mt: "8px",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              mt: "8px",
            }}
          >
            <NavItem
              icon={<CommonIcons.SettingsInputHdmi />}
              title="Coze API"
              path="/api"
              navActive
            />
            <NavItem
              icon={<CommonIcons.Token />}
              title="Coze Token"
              path="/token"
              navActive
              endNum={10}
            />
          </Box>

          <Box>
            <UserButton />
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
