import { Chip, useTheme } from "@mui/material";

interface IMuiChip {
  label: string;
}

function MuiChip(props: IMuiChip) {
  //! State
  const { label } = props;
  const theme = useTheme();

  //! Function

  //! Render
  return (
    <Chip
      label={label}
      sx={{
        span: {
          padding: "0 4px",
        },
        padding: "4px 12px",
        borderRadius: "8px",
        height: "fit-content",
        background: theme.palette.primary.light,
        color: theme.colors.custom.primaryColorTypo,
      }}
    />
  );
}

export default MuiChip;
