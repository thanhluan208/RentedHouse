import { Field } from "formik";
import useGetRoomsByHouse from "../../../../Hooks/useGetRoomsByHouse";
import CommonField from "../../../../Components/CommonFields";

interface IRoomSelect {
  houseId: string;
}

const RoomSelect = (props: IRoomSelect) => {
  //! State
  const { houseId } = props;
  const { data, isLoading } = useGetRoomsByHouse(houseId, !!houseId);

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
      component={CommonField.MuiSelectField}
      label="Room"
      required
      options={options}
      placeholder={"Select Room"}
      disabled={isLoading}
    />
  );
};

export default RoomSelect;
