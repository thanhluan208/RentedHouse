import { ReactNode } from "react";
import CommonStyles from "../..";

interface IPaginationButton {
  content: string | ReactNode;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const PaginationButton = (props: IPaginationButton) => {
  //! State
  const { content, onClick, isActive } = props;

  //! Function

  //! Render
  return (
    <CommonStyles.Button
      variant={isActive ? "contained" : "text"}
      onClick={onClick}
      sx={{
        padding: 0,
        minWidth: "unset",
        aspectRatio: 1,
      }}
      disabled={props.disabled}
    >
      {content}
    </CommonStyles.Button>
  );
};

export default PaginationButton;
