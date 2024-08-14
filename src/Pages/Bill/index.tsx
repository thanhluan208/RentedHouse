import { Box } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";


const Bill = () => {
  //! State
  

  //! Function

  //! Render
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          padding: "10px 25px",
        }}
      >
        <CommonStyles.Typography type="bold24">Bill</CommonStyles.Typography>
      </Box>
      <Box
        sx={{
          padding: "20px",
          maxWidth: "1400px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          rowGap: "10px",
        }}
      ></Box>
    </Box>
  );
};

export default Bill;
