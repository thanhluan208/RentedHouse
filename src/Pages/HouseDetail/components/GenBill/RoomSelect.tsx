import { Field, useFormikContext } from "formik";
import useGetRoomsByHouse from "../../../../Hooks/useGetRoomsByHouse";
import CommonField from "../../../../Components/CommonFields";
import { useMemo } from "react";
import { cloneDeep } from "lodash";
import { PDFInitValues } from "./GenPdfButton";

interface IRoomSelect {
  houseId: string;
  disabled?: boolean;
}

const RoomSelect = (props: IRoomSelect) => {
  //! State
  const { houseId, disabled } = props;
  const { values } = useFormikContext<PDFInitValues>();
  const { data, isLoading } = useGetRoomsByHouse(houseId);
  const { guest } = values;

  const options = useMemo(() => {
    const nextOptions = cloneDeep(data).map((room) => ({
      value: room._id,
      label: room.name,
      ...room,
    }));

    return nextOptions.filter((room) => {
      if (!guest?._id) return true;
      return room.guests.some((elm) => elm._id === guest._id);
    });
  }, [data, guest]);
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
      disabled={isLoading || disabled}
    />
  );
};

export default RoomSelect;
