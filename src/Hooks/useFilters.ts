import { isFunction } from "lodash";
import { useCallback, useState } from "react";

const useFilters = (initialFilters: any) => {
  const [filters, setFilters] = useState<any>(initialFilters);

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

  const updateFilter = useCallback(
    (value: any) => {
      setFilters((prevFilters: any) => {
        if (isFunction(value)) {
          return {
            ...value(prevFilters),
            page: initialFilters?.page || 0,
            pageSize: initialFilters?.pageSize || 10,
          };
        } else {
          return value;
        }
      });
    },
    [initialFilters?.page, initialFilters?.pageSize]
  );

  return {
    filters,
    setFilters: updateFilter,
    resetFilter,
    changePage,
    changePageSize,
  };
};

export default useFilters;
