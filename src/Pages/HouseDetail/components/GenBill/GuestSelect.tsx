import { Field, useFormikContext } from "formik";
import CommonField from "../../../../Components/CommonFields";
import { PDFInitValues } from "./GenPdfButton";
import { useEffect, useMemo } from "react";
import { cloneDeep, isString } from "lodash";
import useGetListGuest from "../../../../Hooks/useGetListGuest";
import { RoomDetail } from "../../../../Hooks/useGetRoomDetail";

interface IGuestSelect {
  houseId: string;
}

const GuestSelect = (props: IGuestSelect) => {
  //! State
  const { houseId } = props;
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const { data, isLoading } = useGetListGuest(houseId, !!houseId);

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
      return room.guests.some((guest) => guest._id === elm._id);
    });
  }, [values.room, data]);

  //! Function

  useEffect(() => {
    if (isString(values.room)) {
      setFieldValue("guest", "");
    } else {
      setFieldValue("guest", undefined);
    }
  }, [JSON.stringify(values.room)]);

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
      disabled={isLoading}
      placeholder={"Select Guest"}
    />
  );
};

export default GuestSelect;
