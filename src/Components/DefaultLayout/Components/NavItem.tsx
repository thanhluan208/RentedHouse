import React from "react";
import CommonStyles from "../../CommonStyles";
import { processNavLabel } from "../../../Helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Tooltip, useTheme } from "@mui/material";

interface INavItem {
  icon: React.ReactNode;
  title?: string;
  path?: string;
  children?: React.ReactNode;
  navActive?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonSx?: any;
  endNum?: number;
}

function NavItem(props: INavItem) {
  //! State
  const { icon, title, path, children, navActive, onClick, buttonSx, endNum } =
    props;
  const theme: any = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname === path || navActive;

  //! Function

  //! Render
  return (
    <Tooltip title={title}>
      <div>
        <CommonStyles.Button
          fullWidth
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (path) {
              navigate(path);
              return;
            }
            if (onClick) {
              onClick(event);
            }
          }}
          sx={{
            justifyContent: "flex-start",
            color: !isActive ? theme.colors.custom.colorDisabledTypo : "#000",

            backgroundColor:
              isActive && !navActive
                ? theme.colors.custom.backgroundButtonHover
                : "transparent",
            ...buttonSx,
          }}
          startIcon={icon}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box>
              <CommonStyles.Typography
                sx={{
                  maxWidth: "120px",
                  textOverflow: "ellipsis",
                  textWrap: "nowrap",
                  fontWeight: isActive ? 600 : 500,
                  overflow: "hidden",
                }}
              >
                {title ? processNavLabel(title) : children}
              </CommonStyles.Typography>
            </Box>
            {endNum && (
              <Box>
                <CommonStyles.Typography>{endNum}</CommonStyles.Typography>
              </Box>
            )}
          </Box>
        </CommonStyles.Button>
      </div>
    </Tooltip>
  );
}

export default NavItem;
