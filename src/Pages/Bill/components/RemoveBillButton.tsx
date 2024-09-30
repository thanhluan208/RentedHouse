import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { BillResponse } from "@/Hooks/useGetBill";
import { useFormikContext } from "formik";
import { memo } from "react";
import { SchedulerInitialValue } from "./Scheduler/ActionSchedulerDialog";
import { isArray } from "lodash";

interface IRemoveBillButton {
  row: BillResponse;
}

const RemoveBillButton = (props: IRemoveBillButton) => {
  //! State
  const { row } = props;
  const { setFieldValue, values } = useFormikContext<SchedulerInitialValue>();

  //! Function
  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!isArray(values.bills) || !row?._id) return;
    const bills = values.bills.filter((bill) => bill._id !== row._id);
    setFieldValue("bills", bills);
  };

  //! Render
  return (
    <CommonStyles.Button
      isIcon
      tooltip="Remove bill"
      onClick={handleRemove}
      color="error"
    >
      <CommonIcons.Delete />
    </CommonStyles.Button>
  );
};

export default memo(RemoveBillButton);
