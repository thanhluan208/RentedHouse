import { Box, Divider } from "@mui/material";
import { House } from "../interface";
import CommonStyles from "../../../Components/CommonStyles";
import MoreButton from "./MoreButton";
import HouseInfo from "./HouseInfo";
import { useMemo } from "react";
import { HouseStatusEnum } from "../../../Constants/options";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../../Constants/routes";
import { useGet } from "../../../Stores/useStore";
import useGetListRoomOfHouse from "../../../Hooks/useGetListRoomOfHouse";
import { isEmpty } from "lodash";
import { formatDate } from "../../../Helpers";

interface IEachHouse {
  data: House;
}

const EachHouse = (props: IEachHouse) => {
  //! State
  const { data } = props;
  const navigate = useNavigate();
  const dialogOpen = useGet("DIALOG_OPEN");
  const { data: roomData, isLoading } = useGetListRoomOfHouse(
    data.rooms,
    !isEmpty(data.rooms)
  );

  const roomInfo = useMemo(() => {
    let active = 0;
    let count = 0;
    let guests = 0;

    if (!roomData) return { active, count, guests };
    roomData.forEach((room) => {
      if (room?.guests?.length > 0) {
        active++;
        guests += room?.guests?.length;
      }
      count++;
    });
    return {
      active,
      count,
      guests,
    };
  }, [roomData]);

  const color = useMemo(() => {
    if (data.status.value === HouseStatusEnum.available) {
      return {
        backgroundColor: "#e8faf3",
        color: "#2dd298",
      };
    }
    if (data.status.value === HouseStatusEnum.full) {
      return {
        backgroundColor: "#fde8e8",
        color: "#f44336",
      };
    }
    if (data.status.value === HouseStatusEnum.inactive) {
      return {
        backgroundColor: "#f7f8f9",
        color: "#838698",
      };
    }
    if (data.status.value === HouseStatusEnum.under_construction) {
      return {
        backgroundColor: "#ffead9",
        color: "#ed6c02",
      };
    }
  }, [data.status.value]);

  //! Function

  //! Render
  return (
    <Box
      sx={{
        width: "350px",
        borderRadius: "10px",
        border: "solid 1px #90b1ff",
        padding: "10px 15px 50px",
        background: "#fff",
        cursor: "pointer",
        transition: " all 0.3s",
        position: "relative",
        "&:hover": {
          boxShadow: "0 0 10px 0px #90b1ff",
        },
      }}
      onClick={(e) => {
        if (dialogOpen) return;
        e.preventDefault();
        e.stopPropagation();
        navigate(`${Paths.house}/${data.id}`);
      }}
    >
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <CommonStyles.Chip label={data.status.label || ""} sx={color} />
      <Box
        sx={{
          padding: "5px 25px",
        }}
      >
        <Box
          sx={{
            margin: "15px 0 20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CommonStyles.Typography type="bold18">
            {data.name}
          </CommonStyles.Typography>
          <MoreButton data={data} />
        </Box>
        <Divider />
        <Box
          sx={{
            marginTop: "10px",
          }}
        >
          <HouseInfo
            label="Created at"
            value={formatDate(data.createdAt) || "-"}
          />
          <HouseInfo
            label="Active rooms"
            value={`${roomInfo.active} of ${roomInfo.count}`}
          />
          <HouseInfo label="Guest" value={`${roomInfo.guests}`} />
          <Box>
            <CommonStyles.Typography type="bold14" sx={{ color: "#777575" }}>
              Address:
            </CommonStyles.Typography>
            <CommonStyles.Typography type="normal14">{`${data.address}, ${data.commune.label} ${data.district.label} ${data.city.label}`}</CommonStyles.Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EachHouse;
