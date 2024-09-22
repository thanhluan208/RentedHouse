import { Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonStyles from "../../../Components/CommonStyles";
import { useMemo } from "react";
import HouseInfo from "../../Home/components/HouseInfo";
import { formatDate } from "../../../Helpers";
import DeleteButton from "./DeleteButton";
import CommonIcons from "../../../Components/CommonIcons";
import DeleteGuest from "./DeleteGuest";
import cachedKeys from "../../../Constants/cachedKeys";
import AddGuestButton from "../../Guest/components/AddGuestButton";
import { Paths } from "../../../Constants/routes";
import { HouseStatusEnum } from "../../../Services/House.services";
import { Room } from "../../Home/interface";
import EditButton from "./EditButton";

interface IEachRoom {
  data: Room;
}

const EachRoom = (props: IEachRoom) => {
  //! State
  const { data } = props;
  const navigate = useNavigate();

  const color = useMemo(() => {
    if (!data) return {};
    if (data.status === HouseStatusEnum.AVAILABLE) {
      return {
        backgroundColor: "#e8faf3",
        color: "#2dd298",
      };
    }
    if (data.status === HouseStatusEnum.FULL) {
      return {
        backgroundColor: "#fde8e8",
        color: "#f44336",
      };
    }

    if (data.status === HouseStatusEnum.UNDER_CONSTRUCTION) {
      return {
        backgroundColor: "#ffead9",
        color: "#ed6c02",
      };
    }
  }, [data?.status]);
  //! Function

  //! Effect

  //! Render
  if (!data?._id) return null;

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
        // if (dialogOpen) return;
        e.preventDefault();
        e.stopPropagation();
        // navigate(`${Paths.house}/${data.id}`);
      }}
    >
      <CommonStyles.Chip label={data?.status || ""} sx={color} />
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
            Room: {data.name}
          </CommonStyles.Typography>
          <Box sx={{
            display:'flex',
            gap:'8px'
          }}>
            <EditButton data={data} />
            <DeleteButton data={data} />
          </Box>
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
            label="Price"
            value={`${data.price.toLocaleString("vn-VN")} VND`}
          />
          <HouseInfo label="Room size" value={`${data.size} m²`} />
          <CommonStyles.Typography type="bold14" sx={{ color: "#777575" }}>
            Guests: {data.guests.length} / {data.maxGuest}
          </CommonStyles.Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              padding: "0 16px",
              marginTop: "16px",
            }}
          >
            {data.guests.map((guest) => {
              return (
                <Box
                  key={guest._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      "&:hover": {
                        color: "#90b1ff",
                        cursor: "pointer",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${Paths.guest}/${guest._id}`);
                    }}
                  >
                    <CommonIcons.Person />
                    <CommonStyles.Typography type="bold14" key={guest._id}>
                      {guest.name}
                    </CommonStyles.Typography>
                  </Box>
                  <DeleteGuest data={guest} roomData={data} />
                </Box>
              );
            })}
            {data.guests.length < data.maxGuest && data._id && (
              <AddGuestButton
                refetchKey={cachedKeys.REFETCH_HOUST_DETAIL}
                roomData={data}
                buttonProps={{
                  startIcon: null,
                  variant: "text",
                  content: "Add guest",
                  sx: {
                    justifyContent: "flex-start",
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EachRoom;
