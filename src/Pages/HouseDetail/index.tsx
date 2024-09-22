import { Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import AddRoomButton from "./components/AddRoomButton";
import GenPdfButton from "./components/GenBill/GenPdfButton";
import { useSave } from "@/Stores/useStore";
import useGetHouse from "@/Hooks/useGetHouse";
import cachedKeys from "@/Constants/cachedKeys";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import RoomList from "./RoomList";
import IncomeAndExpense from "./components/IncomeAndExpense";

const HouseDetail = () => {
  //! State
  const params = useParams();
  const save = useSave();
  const navigate = useNavigate();
  const id = params.id;
  const { data, isLoading, refetch } = useGetHouse(id as string, !!id);

  //! Function
  useEffect(() => {
    save(cachedKeys.REFETCH_HOUST_DETAIL, refetch);
  }, [refetch]);

  //! Render

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data) {
    return null;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 25px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <CommonStyles.Button isIcon onClick={() => navigate(-1)}>
            <CommonIcons.ArrowBack />
          </CommonStyles.Button>
          <CommonStyles.Typography type="bold24">
            {data?.name || `House ${data?._id}`}
          </CommonStyles.Typography>
        </Box>
        {data?._id && (
          <Box sx={{ display: "flex", gap: "8px" }}>
            <AddRoomButton houseId={data._id} />
            <GenPdfButton houseData={data} />
          </Box>
        )}
      </Box>

      <Box
        sx={{
          padding: "0 20px",
        }}
      >
        <IncomeAndExpense />
      </Box>

      <Box padding="0 20px">{data && <RoomList data={data} />}</Box>
    </Box>
  );
};

export default HouseDetail;
