import { Box } from "@mui/material";
import CommonIcons from "../../CommonIcons";
import CommonStyles from "..";

interface IEmpty {
  content?: string;
}

const Empty = (props: IEmpty) => {
  //! State
  const { content } = props;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        height: "300px",
        width: "300px",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        svg: {
          width: "100%",
          height: "100%",
        },
      }}
    >
      <CommonIcons.EmptyIcon />
      <CommonStyles.Typography type="bold18" align="center" mt={"20px"}>
        {content || "No data"}
      </CommonStyles.Typography>
    </Box>
  );
};

export default Empty;
