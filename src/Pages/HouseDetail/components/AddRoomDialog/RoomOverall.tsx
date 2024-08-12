import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { RoomInitValues } from "../AddRoomButton";
import CommonStyles from "../../../../Components/CommonStyles";
import { useMemo } from "react";
import { removeAllDot } from "../../../../Helpers";

const RoomOverall = () => {
  //! State
  const { values } = useFormikContext<RoomInitValues>();
  const {
    price,
    waterFee,
    parkingFee,
    internetFee,
    electricityFee,
    livingExpense,
    expenditures,
  } = values;

  const totalRevenue = useMemo(() => {
    return (
      +removeAllDot(`${price}`) +
      +removeAllDot(`${waterFee}`) +
      +removeAllDot(`${parkingFee}`) +
      +removeAllDot(`${internetFee}`) +
      +removeAllDot(`${electricityFee}`) +
      +removeAllDot(`${livingExpense}`)
    );
  }, [price, waterFee, parkingFee, internetFee, electricityFee, livingExpense]);

  const totalExpenses = useMemo(() => {
    if (!expenditures) return 0;
    return expenditures.reduce((acc, cur) => {
      return acc + +removeAllDot(`${cur.price}`);
    }, 0);
  }, [expenditures]);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        padding: "0 20px",
      }}
    >
      <CommonStyles.Typography type="bold18">
        Total revenue:{" "}
        <CommonStyles.Typography component="span" type="bold18" color="#2dd298">
          {Number(totalRevenue).toLocaleString("vi-VN")} VND / month
        </CommonStyles.Typography>
      </CommonStyles.Typography>
      <CommonStyles.Typography type="bold18">
        Total expenses:{" "}
        <CommonStyles.Typography component="span" type="bold18" color="#d32f2f">
          {Number(totalExpenses).toLocaleString("vi-VN")} VND
        </CommonStyles.Typography>
      </CommonStyles.Typography>
    </Box>
  );
};

export default RoomOverall;
