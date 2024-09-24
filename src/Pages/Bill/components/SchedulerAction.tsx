import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { Fragment, useEffect } from "react";
import ActionSchedulerDialog from "./ActionSchedulerDialog";
import CommonIcons from "@/Components/CommonIcons";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";

const SchedulerAction = ({billId}: {billId:string}) => {
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
          maxWidth="sm"
        >
          <ActionSchedulerDialog toggle={toggle} billIds={[billId]}/>
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        isIcon
        tooltip="Scheduler"
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
