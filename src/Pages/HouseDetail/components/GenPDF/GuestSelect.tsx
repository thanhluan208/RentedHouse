import { Field, useFormikContext } from "formik";
import CommonField from "../../../../Components/CommonFields";
import { PDFInitValues } from "./GenPdfButton";

const GuestSelect = () => {
  //! State
  const { values } = useFormikContext<PDFInitValues>();

  const options =
    values?.room?.guests.map((room) => ({
      value: room.id,
      label: room.name,
      ...room,
    })) || [];
  //! Function

  //! Render
  return (
    <Field
      name="guest"
      component={CommonField.MuiSelectField}
      label="Guest"
      options={options}
      required  
      placeholder="Select guest"
    />
  );
};

export default GuestSelect;
