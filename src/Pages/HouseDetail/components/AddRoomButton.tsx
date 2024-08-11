import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import { FastField, Formik, Form } from "formik";

import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CommonIcons from "../../../Components/CommonIcons";
import CommonField from "../../../Components/CommonFields";
import { HouseStatus } from "../../../Constants/options";
import { isEmpty } from "lodash";
import GuestsSelect from "./GuessInput";
import { useGet } from "../../../Stores/useStore";
import FirebaseServices from "../../../Services/Firebase.service";
import { House } from "../../Home/interface";
import FormikEffect from "./FormikEffect";

interface IRoomActionDialog {
  toggle: () => void;
  houseData: House;
  data?: any;
}

export interface RoomInitValues {
  id?: string;
  house_id: string;
  name: string;
  price: number;
  size: number;
  maxGuest: number;
  status: {
    value: string;
    label: string;
  };
  guests: GuestInit[] | [];
}

export interface GuestInit {
  id: string;
  name: string;
}

export const RoomActionDialog = (props: IRoomActionDialog) => {
  //! State
  const { toggle, data, houseData } = props;
  const isEdit = !!data;
  const refetchHouseDetail = useGet("REFETCH_HOUST_DETAIL");

  const initialValues: RoomInitValues = useMemo(() => {
    return {
      house_id: houseData.id,
      name: data?.name ? data.name : "",
      price: data?.price ? data.price : 0,
      maxGuest: data?.maxGuest ? data.maxGuest : 0,
      size: data?.size ? data.size : 0,
      status: data?.status
        ? data.status
        : { value: "available", label: "Available" },
      guests: data?.guests ? data.guests : [],
    };
  }, [data, houseData.id]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
      price: yup.number().required("Price is required field"),
      maxGuest: yup.number().required("Max guest is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(
    async (values: RoomInitValues) => {
      const toastId = toast.loading("Processing...");

      const nextValues = {
        ...values,
        guests: values.guests.filter((elm) => elm.name),
      };

      await FirebaseServices.addGuests(nextValues.guests);

      await FirebaseServices.addRoom(nextValues, (error) => {
        toast.update(toastId, {
          render: error?.message || "Error!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });

      await refetchHouseDetail();

      toggle();

      toast.update(toastId, {
        render: "Success!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    },
    [data]
  );

  //! Render
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      validateOnMount
    >
      {({ isSubmitting, errors, dirty }) => {
        return (
          <Form
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "column",
            }}
          >
            <FormikEffect />
            <Box>
              <DialogTitle>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={2}
                >
                  <CommonStyles.Typography type="bold18">
                    {isEdit ? "Update room" : "Create new room"}
                  </CommonStyles.Typography>
                  <CommonStyles.Button
                    isIcon
                    onClick={(event) => {
                      event.stopPropagation();
                      toggle();
                    }}
                  >
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent
                sx={{
                  minHeight: "50vh",
                }}
              >
                <FastField
                  name="name"
                  component={CommonField.InputField}
                  fullWidth
                  label="Room name"
                  required
                  placeholder="Give the room a unique name"
                  maxChar={50}
                />
                <FastField
                  name="status"
                  component={CommonField.MuiSelectField}
                  fullWidth
                  options={HouseStatus}
                  label="Status"
                  placeholder="Select status"
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <FastField
                    name="price"
                    component={CommonField.InputField}
                    fullWidth
                    label="Price"
                    placeholder="Enter price"
                  />
                  <FastField
                    name="size"
                    component={CommonField.InputField}
                    fullWidth
                    label="Size"
                    InputProps={{
                      endAdornment: (
                        <CommonStyles.Typography type="bold14" marginRight='5px'>
                          m²
                        </CommonStyles.Typography>
                      ),
                    }}
                    placeholder="Enter size"
                  />
                  <FastField
                    name="maxGuest"
                    component={CommonField.InputField}
                    fullWidth
                    label="Max guest"
                    placeholder="Enter max guest"
                  />
                </Box>
                <GuestsSelect />
              </DialogContent>

              <DialogActions>
                <Box
                  display="flex"
                  justifyContent={"end"}
                  gap="16px"
                  sx={{
                    button: {
                      fontWeight: "550",
                      padding: "6px 20px",
                    },
                  }}
                >
                  <CommonStyles.Button
                    variant="contained"
                    sx={{
                      background: "#fff",
                      color: "#000",
                      "&:hover": {
                        background: "#fff",
                      },
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggle();
                    }}
                    disabled={isSubmitting}
                    type="button"
                  >
                    Cancel
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    variant="contained"
                    sx={{
                      color: "#fff",
                    }}
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isEmpty(errors) || !dirty}
                  >
                    Confirm
                  </CommonStyles.Button>
                </Box>
              </DialogActions>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

interface IAddRoomButton {
  houseData: House;
}

const AddRoomButton = (props: IAddRoomButton) => {
  //! State
  const { houseData } = props;
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
        >
          <RoomActionDialog toggle={toggle} houseData={houseData} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        variant="contained"
        startIcon={<CommonIcons.Add />}
        onClick={toggle}
      >
        Create new room
      </CommonStyles.Button>
    </Fragment>
  );
};

export default AddRoomButton;
