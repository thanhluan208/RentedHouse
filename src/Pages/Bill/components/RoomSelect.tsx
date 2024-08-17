import { memo, useMemo } from "react";
import { cloneDeep } from "lodash";
import useGetRoomsByHouse from "../../../Hooks/useGetRoomsByHouse";
import CommonSelect from "../../../Components/CommonStyles/Select";

interface IRoomSelect {
  guest?: string;
  house: string;
  setFilters: any;
  filters?: any;
}

const RoomSelect = (props: IRoomSelect) => {
  //! State
  const { guest, house, setFilters, filters } = props;
  const { data, isLoading } = useGetRoomsByHouse();

  const options = useMemo(() => {
    const nextOptions = cloneDeep(data).map((room) => ({
      value: room._id,
      label: room.name,
      ...room,
    }));

    return nextOptions.filter((room) => {
      let valid = true;
      if (guest) {
        valid = room.guests.some((elm) => elm._id === guest);
      }

      if (house) {
        valid = room.house === house;
      }

      return valid;
    });
  }, [data, guest, house]);
  //! Function

  //! Render
  return (
    <CommonSelect
      options={options}
      label="Room"
      handleChange={(value) => {
        setFilters((prev: any) => ({
          ...prev,
          room: value,
        }));
      }}
      value={filters?.room}
      disabled={isLoading}
      sxContainer={{
        minWidth: "200px",
      }}
      placeholder="Select Room"
    />
  );
};

export default memo(RoomSelect);
