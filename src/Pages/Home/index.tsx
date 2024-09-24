import { Box, CircularProgress } from "@mui/material";
import useGetListHouses from "../../Hooks/useGetListHouse";
import { House } from "./interface";
import EachHouse from "./components/EachHouse";
import { useEffect } from "react";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import CommonStyles from "../../Components/CommonStyles";
import { isEmpty } from "lodash";

function Home() {
  //! State
  const save = useSave();
  const { data, isLoading, refetch } = useGetListHouses();

  //! Function
  useEffect(() => {
    if (refetch) {
      save(cachedKeys.REFETCH_HOUSE_LIST, refetch);
    }
  }, [refetch, save]);

  //! Render
  if (isLoading) {
    return <CircularProgress />;
  }

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
        <CommonStyles.OpenSidebarButton title="House" />
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
        {isEmpty(data) && (
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
            <CommonStyles.Empty content="No house found!" />
          </Box>
        )}
        {data.map((elm: House) => {
          return <EachHouse data={elm} key={elm._id} />;
        })}
      </Box>
    </Box>
  );
}

export default Home;
