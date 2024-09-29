import { memo, useMemo } from "react";
import { cloneDeep } from "lodash";
import CommonSelect from "../../../../Components/CommonStyles/Select";
import useGetListGuest from "../../../../Hooks/useGetListGuest";

interface IGuestSelect {
  room?: string;
  house: string;
  setFilters: any;
  filters?: any;
}

const GuestSelect = (props: IGuestSelect) => {
  //! State
  const { room, house, setFilters , filters} = props;
  const { data, isLoading } = useGetListGuest();

  const options = useMemo(() => {
    const nextOptions = cloneDeep(data).map((guest) => ({
      value: guest._id,
      label: guest.name,
      ...guest,
    }));

    return nextOptions.filter((guest) => {
      let valid = true;
      if (room) {
        valid = guest.room?._id === room;
      }

      if (house) {
        valid = guest.house === house;
      }

      return valid;
    });
  }, [data, room, house]);
  //! Function

  //! Render
  return (
    <CommonSelect
      options={options}
      label="Guest"
      handleChange={(value) => {
        setFilters((prev: any) => ({
          ...prev,
          guest: value,
        }));
      }}
      value={filters?.guest}
      disabled={isLoading}
      sxContainer={{
        minWidth: "200px",
      }}
      placeholder="Select Guest"
    />
  );
};

export default memo(GuestSelect);
