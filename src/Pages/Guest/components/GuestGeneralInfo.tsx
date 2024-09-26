import { FastField, Field, useFormikContext } from "formik";
import CommonField from "../../../Components/CommonFields";
import { Box } from "@mui/material";
import vietnameCityData from "../../../Constants/vietnam-city.json";
import { GuestInitValue } from "./AddGuestButton";
import { gender } from "../../../Constants/options";
import { Fragment } from "react/jsx-runtime";

const GuestGeneralInfo = () => {
  //! State
  const { values, setFieldValue } = useFormikContext<GuestInitValue>();
  const districtOption = vietnameCityData?.district?.filter((el) => {
    if (values.city) {
      return el.idCity === values.city.value;
    }
  });

  const communeOption = vietnameCityData.commune.filter((el) => {
    if (values.district) {
      return el.idDistrict === values.district?.value;
    }
  });

  //! Function

  //! Render
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <FastField
          name="name"
          component={CommonField.InputField}
          fullWidth
          label="Guest name"
          required
          placeholder="Enter guest name"
          maxChar={50}
        />
        <FastField
          name="gender"
          component={CommonField.MuiSelectField}
          fullWidth
          options={gender}
          label="Gender"
          placeholder="Select gender"
          onChangeCustomize={(e: any) => {
            setFieldValue("gender", e.target.value);
          }}
        />
        <FastField
          name="dob"
          component={CommonField.DatePickerField}
          fullWidth
          label="Birthday"
          disableFuture
        />
        <FastField
          name="phone"
          type="number"
          component={CommonField.InputField}
          fullWidth
          label="Phone"
          maxChar={10}
          placeholder="Enter phone number"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <FastField
          name="checkIn"
          component={CommonField.DatePickerField}
          fullWidth
          label="Check in"
        />
        <FastField
          name="checkOut"
          component={CommonField.DatePickerField}
          fullWidth
          label="Check out"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <FastField
          name="city"
          component={CommonField.MuiSelectField}
          fullWidth
          options={vietnameCityData.province}
          label="City"
          placeholder="Select city"
        />
        <Field
          name="district"
          component={CommonField.MuiSelectField}
          fullWidth
          options={districtOption}
          label="District"
          placeholder="Select district"
        />
        <Field
          name="commune"
          component={CommonField.MuiSelectField}
          fullWidth
          options={communeOption}
          label="Commune"
          placeholder="Select commune"
        />
      </Box>
      <FastField
        name="address"
        component={CommonField.InputField}
        fullWidth
        label="Address"
        placeholder="Enter address"
        maxChar={50}
      />
    </Fragment>
  );
};

export default GuestGeneralInfo;
