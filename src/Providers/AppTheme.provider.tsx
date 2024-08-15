import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { CssBaseline } from "@mui/material";
import { GlobalStyles } from "@mui/material";

import cachedKeys from "../Constants/cachedKeys";
import { useSave } from "../Stores/useStore";

const lightTheme: any = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  typography: {
    // fontFamily: ['Epilogue, sans-serif'].join(','),
    fontFamily: "SegoeUI",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Light"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf) format("truetype");
        font-weight: 100;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Semilight"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf) format("truetype");
        font-weight: 200;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf) format("truetype");
        font-weight: 400;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Bold"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf) format("truetype");
        font-weight: 600;
    }
    
    @font-face {
        font-family: SegoeUI;
        src:
            local("Segoe UI Semibold"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2) format("woff2"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff) format("woff"),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf) format("truetype");
        font-weight: 700;
    }
      `,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#4e40e5",
      light: "#4d53e826",
    },
    success: {
      main: "#e8faf3",
      contrastText: "#2dd298",
    },
    warning: {
      main: "#fff7e6",
      contrastText: "#ff9e43",
    }
  },
  colors: {
    custom: {
      //* Main
      backgroundSecondary: "#e5ebf9",

      //* Button
      backgroundButtonHover: "#1976d214",

      //* Typo
      primaryColorTypo: "#1f1e7d",
      colorDisabledTypo: "#06070980",
      semiColorTypo: "#383743",
      colorErrorTypo: "#ff1515",

      //* Dialog
      backgroundDialog: "#f5f7fa",
    },
  } as any,
} as any);

const darkTheme = createTheme({
  typography: {
    // fontFamily: ['Epilogue,  sans-serif'].join(','),
    fontFamily: "Plus Jakarta Sans",
  },
});

export enum Theme {
  light = "light",
  dark = "dark",
}

export const keyTheme = "theme-mode";

const switchTheme = {
  [Theme.dark]: darkTheme,
  [Theme.light]: lightTheme,
};

export default function AppThemeProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const save = useSave();
  const [theme, setTheme] = useState<Theme>(
    (localStorage?.getItem(keyTheme) as Theme) || Theme.light
  );

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === Theme.light ? Theme.dark : Theme.light;
      localStorage?.setItem(keyTheme, nextTheme);
      return nextTheme;
    });
  }, []);

  useEffect(() => {
    save(cachedKeys.TOGGLE_THEME, toggleTheme);
  }, [save, toggleTheme]);

  return (
    <ThemeProvider theme={switchTheme[theme]}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            // fontFamily: 'Epilogue, sans-serif',
            fontFamily: "Plus Jakarta Sans",
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
}
