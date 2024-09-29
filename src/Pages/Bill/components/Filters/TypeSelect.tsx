import CommonSelect from "@/Components/CommonStyles/Select";
import { isObject } from "lodash";

export const BillType = [
  {
    value: "all",
    label: "All",
  },
  {
    value: false,
    label: "Income",
  },
  {
    value: true,
    label: "Expense",
  },
];

interface IStatusSelect {
  setFilters: any;
  filters?: any;
}

const TypeSelect = (props: IStatusSelect) => {
  //! State
  const { setFilters, filters } = props;

  //! Function

  //! Render
  return (
    <CommonSelect
      options={BillType}
      label="Status"
      handleChange={(value) => {
        setFilters((prev: any) => ({
          ...prev,
          isExpense: isObject(value) ? "all" : value,
        }));
      }}
      value={filters?.isExpense}
      sxContainer={{
        minWidth: "200px",
      }}
      placeholder="Select Bill Type"
    />
  );
};

export default TypeSelect;
