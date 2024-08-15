import { Box } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import useGetListBill from "../../Hooks/useGetBill";
import { isEmpty } from "lodash";
import BillTable from "./components/BillTable";
import { useCallback, useEffect } from "react";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import AddBillButton from "./components/AddBillButton";
import useFilters from "../../Hooks/useFilters";
import useGetTotalBill from "../../Hooks/useGetTotalBill";

const Bill = () => {
  //! State
  const { filters, changePage, changePageSize } = useFilters({
    page: 0,
    pageSize: 10,
  });
  const { data, isLoading, refetch } = useGetListBill(filters);
  const { data: total, refetch: refetchTotal } = useGetTotalBill();
  const save = useSave();

  const refetchBill = useCallback(async () => {
    await refetch();
    await refetchTotal();
  }, [refetch, refetchTotal]);

  //! Function
  useEffect(() => {
    save(cachedKeys.REFETCH_BILL_LIST, refetchBill);
  }, [save, refetchBill]);

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
        <CommonStyles.Typography type="bold24">Bill</CommonStyles.Typography>
        <Box>
          <AddBillButton />
        </Box>
      </Box>
      {isEmpty(data) && !isLoading && (
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
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          rowGap: "10px",
        }}
      >
        <BillTable
          data={data || []}
          filters={filters}
          total={total}
          changePage={changePage}
          changePageSize={changePageSize}
        />
      </Box>
    </Box>
  );
};

export default Bill;
