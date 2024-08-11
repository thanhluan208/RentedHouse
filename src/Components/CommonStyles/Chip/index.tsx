import { Chip, ChipProps,  } from "@mui/material";

interface IMuiChip {
  label: string;
  color?: string;
}

function MuiChip(props: IMuiChip & ChipProps) {
  //! State

  //! Function

  //! Render
  return (
    <Chip
      {...props}
      sx={{
        span: {
          padding: "0 4px",
        },
        padding: "4px 12px",
        borderRadius: "8px",
        height: "fit-content",
        letterSpacing: "5px",
        textTransform: "uppercase",
        fontWeight: 700,
        ...props.sx,
      }}
    />
  );
}

export default MuiChip;
