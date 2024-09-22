import { Field, useFormikContext } from "formik";
import CommonField from "../../../../Components/CommonFields";
import { PDFInitValues } from "./GenPdfButton";
import { useMemo } from "react";
import { cloneDeep } from "lodash";
import useGetListGuest from "../../../../Hooks/useGetListGuest";
import { RoomDetail } from "../../../../Hooks/useGetRoomDetail";

interface IGuestSelect {
  houseId: string;
  disabled?: boolean;
}

const GuestSelect = (props: IGuestSelect) => {
  //! State
  const { houseId, disabled } = props;
  const { values } = useFormikContext<PDFInitValues>();
  const { data, isLoading } = useGetListGuest(houseId);

  const options = useMemo(() => {
    const nextOptions = cloneDeep(data).map((elm) => {
      return {
        value: elm._id,
        label: elm.name,
        ...elm,
      };
    });

    return nextOptions.filter((elm) => {
      const room: RoomDetail = values.room as RoomDetail;
      if (!room) return true;
      return room.guests.some(
        (guest) => guest._id === elm._id || String(guest) === elm._id
      );
    });
  }, [values.room, data]);

  //! Function

  //! Render
  return (
    <Field
      name="guest"
      component={CommonField.MuiSelectField}
      label="Guest"
      options={options}
      required
      sxContainer={{
        width: "150px",
      }}
      disabled={isLoading || disabled}
      placeholder={"Select Guest"}
    />
  );
};

export default GuestSelect;
