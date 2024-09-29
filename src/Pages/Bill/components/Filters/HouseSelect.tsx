import { memo, useMemo } from "react";
import { cloneDeep } from "lodash";
import CommonSelect from "../../../../Components/CommonStyles/Select";
import useGetListHouses from "../../../../Hooks/useGetListHouse";

interface IHouseSelect {
  room: string;
  filters?: any;
  setFilters: any;
}

const HouseSelect = (props: IHouseSelect) => {
  //! State
  const { room, setFilters, filters } = props;
  const { data, isLoading } = useGetListHouses();

  const options = useMemo(() => {
    const nextOptions = cloneDeep(data).map((house) => ({
      value: house._id,
      label: house.name,
      ...house,
    }));

    return nextOptions.filter((house) => {
      let valid = true;
      if (room) {
        valid = house.rooms.some((elm) => elm._id === room);
      }

      return valid;
    });
  }, [data, room]);
  //! Function

  //! Render
  return (
    <CommonSelect
      options={options}
      label="House"
      handleChange={(value) => {
        setFilters((prev: any) => ({
          ...prev,
          house: value,
        }));
      }}
      value={filters?.house}
      disabled={isLoading}
      sxContainer={{
        minWidth: "200px",
      }}
      placeholder="Select House"
    />
  );
};

export default memo(HouseSelect);
