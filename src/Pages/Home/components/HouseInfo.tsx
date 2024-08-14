import { Box } from "@mui/material";
import CommonStyles from "../../../Components/CommonStyles";

interface IHouseInfo {
  label: string;
  value: string;
}

const HouseInfo = (props: IHouseInfo) => {
  //! State
  const { label, value } = props;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        margin: "10px 0",
      }}
    >
      <CommonStyles.Typography type="bold14" sx={{color:"#777575"}}>{label}:</CommonStyles.Typography>
      <CommonStyles.Typography type="bold14" textAlign={"right"} sx={{maxWidth:'60%'}}>{value || "-"}</CommonStyles.Typography>
    </Box>
  );
};

export default HouseInfo;
