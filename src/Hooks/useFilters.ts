import { useCallback, useState } from "react";

const useFilters = (initialFilters: any) => {
  const [filters, setFilters] = useState<any>(initialFilters);

  const setFilter = (newFilters: any) => {
    setFilters((prevFilters: any) => ({ ...prevFilters, ...newFilters }));
  };

  const resetFilter = () => {
    setFilters(initialFilters);
  };

  const changePage = useCallback((page: number) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      page,
    }));
  }, []);

  const changePageSize = useCallback(
    (pageSize: number) => {
      setFilters((prevFilters: any) => ({
        ...prevFilters,
        page: initialFilters?.page || 0,
        pageSize,
      }));
    },
    [initialFilters.page]
  );

  return { filters, setFilter, resetFilter, changePage, changePageSize };
};

export default useFilters;
