import { Box, Button, useTheme } from "@mui/material";
import { FieldProps, getIn } from "formik";
import PlaceholderImg from "../../assets/team.png";
import CommonIcons from "../CommonIcons";
import Typography from "../CommonStyles/Typography";
import { useCallback } from "react";
import { values } from "lodash";

interface IButtonUploadField {}

function ButtonUploadField(props: IButtonUploadField & FieldProps) {
  //! State
  const { field, form } = props;
  const { setFieldValue, errors, touched } = form;
  const { name, value } = field;
  const theme = useTheme();

  const isTouch = getIn(touched, name);
  const err = getIn(errors, name);

  const errMsg = isTouch && err ? err : "";

  //! Function
  const handleChange = useCallback(
    (e: any) => {
      try {
        const file = e.target.files[0];

        const url = URL.createObjectURL(file);

        setFieldValue(name, url);
      } catch (error) {
        console.log("err", error);
      }
    },
    [setFieldValue]
  );

  //! Render
  return (
    <Box>
      <Button
        component="label"
        role={undefined}
        tabIndex={-1}
        sx={{
          height: "100px",
          width: "100px",
          borderRadius: "10px",
          padding: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100px",
            width: "100px",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
            transition: "all .25s ease-in-out",
            "&:hover": {
              opacity: 1,
            },
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <CommonIcons.Edit
            sx={{
              color: "#fff",
            }}
          />
        </Box>
        <img
          src={value || PlaceholderImg}
          style={{
            height: "100px",
            width: "100px",
            borderRadius: "10px",
          }}
        />
        <input
          style={{
            clip: "rect(0 0 0 0)",
            clipPath: "inset(50%)",
            height: 1,
            overflow: "hidden",
            position: "absolute",
            bottom: 0,
            left: 0,
            whiteSpace: "nowrap",
            width: 1,
          }}
          onChange={handleChange}
          type="file"
          accept="image/*"
        />
      </Button>
      <Typography type="normal14" color={theme.colors.custom.colorErrorTypo}>
        {errMsg}
      </Typography>
    </Box>
  );
}

export default ButtonUploadField;
