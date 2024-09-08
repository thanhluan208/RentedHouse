import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import cachedKeys from "@/Constants/cachedKeys";
import { useGet, useSave } from "@/Stores/useStore";
import { Fragment } from "react";

const EditButton = () => {
  //! State
  const save = useSave();
  const isEditing = useGet("IS_EDITING_INCOME_EXPENSE");

  //! Function

  const handleSave = () => {
    document.getElementById("incomeAndExpensesForm")?.click();
  };

  //! Render
  if (isEditing) {
    return (
      <Fragment>
        <CommonStyles.Button
          variant="outlined"
          startIcon={<CommonIcons.Cancel />}
          onClick={() => {
            save(cachedKeys.IS_EDITING_INCOME_EXPENSE, false);
          }}
          disabled={isEditing === "loading"}
        >
          Cancel
        </CommonStyles.Button>
        <CommonStyles.Button
          variant="contained"
          startIcon={<CommonIcons.Save />}
          onClick={handleSave}
          isLoading={isEditing === "loading"}
        >
          Save
        </CommonStyles.Button>
      </Fragment>
    );
  }

  return (
    <CommonStyles.Button
      variant="contained"
      startIcon={<CommonIcons.Edit />}
      onClick={() => {
        save(cachedKeys.IS_EDITING_INCOME_EXPENSE, true);
      }}
    >
      Edit
    </CommonStyles.Button>
  );
};

export default EditButton;
