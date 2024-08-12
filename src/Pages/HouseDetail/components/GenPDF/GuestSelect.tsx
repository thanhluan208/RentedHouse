import { Field, useFormikContext } from "formik";
import CommonField from "../../../../Components/CommonFields";
import { PDFInitValues } from "./GenPdfButton";
import { useEffect, useMemo } from "react";
import { isString, isUndefined } from "lodash";

const GuestSelect = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<PDFInitValues>();
  const isText = isString(values.room) && !isUndefined(values.room);


  const options = useMemo(() => {
    if (isString(values.room) || !values?.room) {
      return [];
    }
    return values.room?.guests.map((guest) => ({
      value: guest.id,
      label: guest.name,
      ...guest,
    }));
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
      component={isText ? CommonField.InputField : CommonField.MuiSelectField}
      label="Guest"
      options={options}
      required
      sxContainer={{
        width: "150px",
      }}
      placeholder={isText ? "Guest Name" : "Select Guest"}
    />
  );
};

export default GuestSelect;
