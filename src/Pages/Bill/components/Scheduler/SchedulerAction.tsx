import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { Fragment, useEffect } from "react";
import CommonIcons from "@/Components/CommonIcons";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { BillResponse } from "@/Hooks/useGetBill";
import ListSchedulerDialog from "./ListSchedulerDialog";

const SchedulerAction = ({
  scheduler,
  bill
}: {
  bill: BillResponse;
  scheduler?: string;
}) => {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();
  const save = useSave();
  //! Function
  useEffect(() => {
    save(cachedKeys.DIALOG_OPEN, open);

    return () => save(cachedKeys.DIALOG_OPEN, false);
  }, [save]);

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          toggle={toggle}
          open={open}
          fullWidth
          maxWidth="lg"
          onClick={(e) => e.stopPropagation()}
        >
          <ListSchedulerDialog toggle={toggle} bill={bill}/>
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        isIcon
        tooltip={scheduler ? "Already scheduled" : "Scheduler"}
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <CommonIcons.Schedule />
      </CommonStyles.Button>
    </Fragment>
  );
};

export default SchedulerAction;
