import TypographyMui, { TypographyProps } from "@mui/material/Typography";
import { useMemo } from "react";

interface ITypography {
  type?: string;
}

const Typography = (props: ITypography & TypographyProps) => {
  //! State
  const { type = "normal14", sx, ...restProps } = props;
  const sxCustomize = useMemo(() => {
    const styles = new Map();

    styles.set("normal14", {
      fontSize: "14px",
      fontWeight: 400,
    });

    styles.set("normal12", {
      fontSize: "12px",
      fontWeight: 400,
    });

    styles.set("bold14", {
      fontSize: "14px",
      fontWeight: 600,
    });

    styles.set("normal16", {
      fontSize: "16px",
      fontWeight: 400,
    });
    
    styles.set("bold16", {
      fontSize: "16px",
      fontWeight: 600,
    });

    styles.set("bold18", {
      fontSize: "18px",
      fontWeight: 600,
    });

    styles.set("normal18", {
      fontSize: "18px",
      fontWeight: 500,
    });

    styles.set("bold24", {
      fontSize: "24px",
      fontWeight: 600,
    });

    styles.set("bold32", {
      fontSize: "32px",
      fontWeight: 600,
    });

    return styles.get(type);
  }, [type]);

  //! Render
  return (
    <TypographyMui
      sx={{
        ...sxCustomize,
        ...sx,
      }}
      {...restProps}
    >
      {props.children}
    </TypographyMui>
  );
};

export default Typography;
