import { useEffect } from "react";
import useGetListGuest from "../../Hooks/useGetListGuest";
import AddGuestButton from "./components/AddGuestButton";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import CommonStyles from "../../Components/CommonStyles";
import { Box } from "@mui/material";
import GuestTable from "./components/GuestTable";


const GuestList = () => {
  //! State
  const { data, refetch, isLoading } = useGetListGuest();
  const save = useSave();


  //! Function
  useEffect(() => {
    save(cachedKeys.REFETCH_GUEST_LIST, refetch);
  }, [save, refetch]);

  //! Render
  return (
    <Box>
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 25px",
        }}
      >
        <CommonStyles.Typography type="bold24">Guest</CommonStyles.Typography>
        <Box>
          <AddGuestButton refetchKey={cachedKeys.REFETCH_GUEST_LIST} />
        </Box>
      </Box>

      <Box
        sx={{
          padding: "20px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          rowGap: "10px",
        }}
      >
        <GuestTable data={data} />
      </Box>
    </Box>
  );
};

export default GuestList;
