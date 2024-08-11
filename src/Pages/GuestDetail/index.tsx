import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import useGetGuestDetail from "../../Hooks/useGetGuestDetail";
import CommonStyles from "../../Components/CommonStyles";
import HouseInfo from "../Home/components/HouseInfo";
import { formatDate } from "../../Helpers";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import CommonIcons from "../../Components/CommonIcons";
import { useSave } from "../../Stores/useStore";
import { useEffect } from "react";
import cachedKeys from "../../Constants/cachedKeys";


const GuestDetail = () => {
  //! State
  const params = useParams();
  const save = useSave();
  const { guestId } = params;
  const { data, isLoading, refetch } = useGetGuestDetail(
    guestId as string,
    !!guestId
  );

  //! Function

  //! Effect
  useEffect(() => {
    save(cachedKeys.REFETCH_GUEST_DETAIL, refetch);
  }, [refetch, save]);

  //! Render
  if (!data) {
    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        <CommonStyles.LoadingOverlay isLoading={isLoading} />
      </Box>
    );
  }

  if (!data?.name && !isLoading) {
    console.log("hehe");
    return (
      <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
        <CommonStyles.Empty content="Guest not found !" />
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <Box
        sx={{
          margin: "0 25px",
          padding: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <CommonStyles.Typography type="bold24">
            {data?.name}
          </CommonStyles.Typography>
          <CommonStyles.Chip
            label={data?.room ? "Renting" : "Not renting"}
            sx={{
              backgroundColor: data?.room ? "#e8faf3" : "#fde8e8",
              color: data?.room ? "#2dd298" : "#f44336",
              padding: "5px 10px",
              borderRadius: "8px",
              margin: "10px 0",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          padding: "0 20px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            background: "#fff",
            borderRadius: "8px",
            border: "solid 1px #ccc",
          }}
        >
          <CommonStyles.Typography type="bold18" sx={{ padding: "10px 20px" }}>
            General information
          </CommonStyles.Typography>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "30px",
              padding: "0px 20px",
            }}
          >
            <HouseInfo label="Room" value={data.room?.name || "-"} />
            <HouseInfo label="House" value={data.houseId || "-"} />
            <HouseInfo
              label="Date of birth"
              value={data.dob || moment().format("Do MMM YYYY")}
            />
            <HouseInfo label="Gender" value={data?.gender || "-"} />
            <HouseInfo
              label="Adress"
              value={
                `${data?.address}, ${data?.commune?.label} ${data?.district?.label} ${data?.city?.label}` ||
                "-"
              }
            />
            <HouseInfo
              label="Created At"
              value={formatDate(data?.createdAt as Timestamp) || "-"}
            />
          </Box>
          <Box
            sx={{
              padding: "0px 20px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              mt: "20px",
            }}
          >
            <CommonStyles.Typography type="bold14" sx={{ color: "#777575" }}>
              Citizen ID:
            </CommonStyles.Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                padding: "0 10px",
              }}
            >
              <img
                src={(data?.citizenIdFront as string) || ""}
                alt="citizenIdFront"
                width="100%"
                style={{ borderRadius: "8px" }}
              />
              <img
                src={(data?.citizenIdBack as string) || ""}
                alt="citizenIdBack"
                width="100%"
                style={{ borderRadius: "8px" }}
              />
            </Box>
            <CommonStyles.Typography type="bold14" sx={{ color: "#777575" }}>
              Contract:
              <CommonStyles.Button isIcon sx={{ color: "#000" }}>
                <CommonIcons.Download />
              </CommonStyles.Button>
            </CommonStyles.Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GuestDetail;
