import CommonStyles from "@/Components/CommonStyles";
import { Box, Collapse, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import EachRoom from "./components/EachRoom";
import { House } from "../Home/interface";
import { useState } from "react";
import CommonIcons from "@/Components/CommonIcons";
import Mansory from "@mui/lab/Masonry";

interface IRoomList {
  data: House;
}

const RoomList = (props: IRoomList) => {
  //! State
  const { data } = props;
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  //! Function

  //! Render
  return (
    <Box
      sx={{
        display: "flex",
        gap: "20px",
        flexDirection: "column",
        borderRadius: "12px",
        margin:"30px auto",
        [theme.breakpoints.down("md")]: {
          background: "transparent",
        },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          [theme.breakpoints.down("md")]: {
            display: "none",
          },
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <CommonStyles.Typography type="bold24">Rooms</CommonStyles.Typography>

        <CommonIcons.ChevronLeft
          sx={{
            transform: open ? "rotate(-90deg)" : "rotate(90deg)",
            transition: "transform 0.3s",
          }}
        />
      </Box>

      <Collapse in={open}>
        <Box
          sx={{
            [theme.breakpoints.down("md")]: {
              padding: "20px",
            },
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
          <Mansory
            columns={{
              sm: 1,
              md: 2,
              lg: 3,
            }}
            spacing={2}
            sx={{
              margin: 0,
            }}
          >
            {data?.rooms?.map((room) => {
              if(room.isDefault) return null;
              return <EachRoom key={room._id} data={room} />;
            })}
          </Mansory>
        </Box>
      </Collapse>
    </Box>
  );
};

export default RoomList;
