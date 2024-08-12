import { Field, useFormikContext } from "formik";
import CommonField from "../../../../Components/CommonFields";
import { PDFInitValues } from "./GenPdfButton";
import { useEffect, useMemo } from "react";
import { cloneDeep, isString } from "lodash";
import useGetListGuest from "../../../../Hooks/useGetListGuest";
import { RoomDetail } from "../../../../Hooks/useGetRoomDetail";

const GuestSelect = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const { data } = useGetListGuest();

  const options = useMemo(() => {
    const nextOptions = cloneDeep(data).map((elm) => {
      return {
        value: elm.id,
        label: elm.name,
        ...elm,
      };
    });

    if (!values?.room) {
      return nextOptions;
    }
    return nextOptions.filter((elm) => {
      const room: RoomDetail = values.room as RoomDetail;
      return room.guests.some((guest) => guest.id === elm.id);
    });
  }, [values.room]);

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
      placeholder={"Select Guest"}
    />
  );
};

export default GuestSelect;
