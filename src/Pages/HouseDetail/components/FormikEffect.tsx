import { useFormikContext } from "formik";
import { GuestInit, RoomInitValues } from "./AddRoomButton";
import { useEffect } from "react";
import { cloneDeep } from "lodash";

const FormikEffect = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<RoomInitValues>();
  const { maxGuest, guests } = values;

  const stringifyGuests = JSON.stringify(guests);
  //! Function
  useEffect(() => {
    const guests = JSON.parse(stringifyGuests);
    if (cloneDeep(guests).filter((elm: GuestInit) => elm.name).length >= maxGuest) {
      setFieldValue("status", { value: "full", label: "Full" });
    } else {
      setFieldValue("status", { value: "available", label: "Available" });
    }
  }, [maxGuest, stringifyGuests]);

  //! Render
  return null;
};

export default FormikEffect;
