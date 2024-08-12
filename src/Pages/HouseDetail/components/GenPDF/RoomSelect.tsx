import { Field, useFormikContext } from "formik";
import useGetRoomsByHouse from "../../../../Hooks/useGetRoomsByHouse";
import CommonField from "../../../../Components/CommonFields";
import CommonStyles from "../../../../Components/CommonStyles";
import { useState } from "react";
import CommonIcons from "../../../../Components/CommonIcons";
import { useTheme } from "@mui/material";

interface IRoomSelect {
  houseId: string;
}

const SwitchLabel = ({
  isSelect,
  handleClick,
}: {
  isSelect?: boolean;
  handleClick: () => void;
}) => {
  const theme: any = useTheme();
  return (
    <span>
      Room{" "}
      <span
        style={{
          color: theme.colors.custom.colorErrorTypo,
          marginLeft: "4px",
        }}
      >
        *
      </span>
      <CommonStyles.Button
        isIcon
        onClick={handleClick}
        sx={{
          height: "18px",
          width: "18px",
          ml: "5px",
          svg: {
            height: "16px",
            width: "16px",
          },
        }}
      >
        {isSelect ? <CommonIcons.UnfoldLess /> : <CommonIcons.TextFormat />}
      </CommonStyles.Button>
    </span>
  );
};

const RoomSelect = (props: IRoomSelect) => {
  //! State
  const { houseId } = props;
  const { data, isLoading } = useGetRoomsByHouse(houseId, !!houseId);
  const [isSelect, setIsSelect] = useState(true);
  const { setFieldValue } = useFormikContext();

  const options = data.map((room) => ({
    value: room.id,
    label: room.name,
    ...room,
  }));
  //! Function

  //! Render
  return (
    <Field
      name="room"
      component={isSelect ? CommonField.MuiSelectField : CommonField.InputField}
      renderLabel={
        <SwitchLabel
          isSelect={isSelect}
          handleClick={() => {
            setIsSelect((prev) => {
              if (!prev) {
                setFieldValue('room', undefined)
              } else {
                setFieldValue("room", "");
              }
              return !prev;
            });
          }}
        />
      }
      sxContainer={{
        width: "140px",
      }}
      options={options}
      placeholder={isSelect ? "Select Room" : "Room Name"}
      disabled={isLoading}
    />
  );
};

export default RoomSelect;
