import { Box } from "@mui/material";
import CommonStyles from "../../Components/CommonStyles";
import useGetListBill from "../../Hooks/useGetBill";
import BillTable from "./components/BillTable";
import { useCallback, useEffect, useMemo } from "react";
import { useSave } from "../../Stores/useStore";
import cachedKeys from "../../Constants/cachedKeys";
import AddBillButton from "./components/AddBillButton";
import useFilters from "../../Hooks/useFilters";
import useGetTotalBill from "../../Hooks/useGetTotalBill";
import FilterBill from "./components/FilterBill";

const Bill = () => {
  //! State
  const { filters, changePage, changePageSize, setFilters, resetFilter } =
    useFilters({
      page: 0,
      pageSize: 10,
    });

  const totalFilters = useMemo(() => {
    const { page, pageSize, ...rest } = filters;
    return rest;
  }, [filters]);

  const { data, isLoading, refetch } = useGetListBill(filters);
  const { data: total, refetch: refetchTotal } = useGetTotalBill(totalFilters);
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
        <CommonStyles.OpenSidebarButton title="Bill" />
        <Box>
          <AddBillButton />
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
        <FilterBill
          filters={filters}
          setFilter={setFilters}
          resetFilter={resetFilter}
        />
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
