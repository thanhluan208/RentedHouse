import { memo } from "react";
import CommonSelect from "../../../Components/CommonStyles/Select";
import { BillStatus } from "../../../Interfaces/common";

interface IStatusSelect {
  setFilters: any;
  filters?: any;
}

export const statusOptions = [
  {
    value: BillStatus.PAID,
    label: "Paid",
  },
  {
    value: BillStatus.UNPAID,
    label: "Unpaid",
  },
];

const StatusSelect = (props: IStatusSelect) => {
  //! State
  const { setFilters, filters } = props;

  //! Function

  //! Render
  return (
    <CommonSelect
      options={statusOptions}
      label="Status"
      handleChange={(value) => {
        setFilters((prev: any) => ({
          ...prev,
          status: value,
        }));
      }}
      value={filters?.status}
      sxContainer={{
        minWidth: "200px",
      }}
      placeholder="Select Status"
    />
  );
};

export default memo(StatusSelect);
