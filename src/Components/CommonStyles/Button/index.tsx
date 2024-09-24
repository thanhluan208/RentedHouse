import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";

interface IMuiButton {
  children: React.ReactNode;
  isIcon?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

function MuiButton(props: IMuiButton & ButtonProps) {
  //! State
  const { children, isIcon, isLoading, ...otherProps } = props;

  //! Function

  //! Render
  if (isIcon) {
    return (
      <Tooltip title={props.tooltip}>
        <div>
          <IconButton
            {...otherProps}
            sx={{
              height: "32px",
              width: "32px",
              "&:focus": {
                outline: "none",
              },
              ...props.sx,
            }}
          >
            {children}
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <Button
      {...otherProps}
      sx={{
        padding: "6px 15px",
        borderRadius: "8px",
        textTransform: "none",
        height: "32px",
        fontWeight: 600,
        fontSize: "14px",
        "&:focus": {
          outline: "none",
        },
        ...props.sx,
      }}
    >
      {isLoading ? <CircularProgress size={24} /> : children}
    </Button>
  );
}

export default MuiButton;
