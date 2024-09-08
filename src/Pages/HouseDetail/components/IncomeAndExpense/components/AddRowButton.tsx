import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import { useGet } from "@/Stores/useStore";

interface IAddRowButton {
  handleAddRow: () => void;
}
const AddRowButton = (props: IAddRowButton) => {
  //! State
  const { handleAddRow } = props;
  const isEditing = useGet("IS_EDITING_INCOME_EXPENSE");

  //! Function

  //! Render
  if (!isEditing) return null;
  return (
    <CommonStyles.Button
      sx={{
        marginTop: "20px",
      }}
      startIcon={<CommonIcons.Add />}
      variant="contained"
      onClick={handleAddRow}
    >
      Add row
    </CommonStyles.Button>
  );
};

export default AddRowButton;
