import { Box, CircularProgress } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import useGetHouse from "../../Hooks/useGetHouse";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import CommonIcons from "../../Components/CommonIcons";
import AddRoomButton from "./components/AddRoomButton";
import EachRoom from "./components/EachRoom";
import { isEmpty } from "lodash";
import GenPdfButton from "./components/GenBill/GenPdfButton";

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
            <AddRoomButton houseData={data} />
            <GenPdfButton houseData={data} />
          </Box>
        )}
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
      >
        {isEmpty(data?.rooms) && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "600px",
              position: "relative",
            }}
          >
            <CommonStyles.Empty content="No room found, Create one!" />
          </Box>
        )}
        {data?.rooms?.map((room) => {
          return <EachRoom key={room._id} data={room} />;
        })}
      </Box>
    </Box>
  );
};

export default HouseDetail;
