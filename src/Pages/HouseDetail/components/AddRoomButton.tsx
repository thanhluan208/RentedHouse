import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";

import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CommonIcons from "../../../Components/CommonIcons";
import { isEmpty } from "lodash";
import { useGet } from "../../../Stores/useStore";
import { House } from "../../Home/interface";
import FormikEffect from "./FormikEffect";
import RoomInformations from "./AddRoomDialog/RoomInformations";
import RoomFee from "./AddRoomDialog/RoomFee";
import PerfectScrollBar from "react-perfect-scrollbar";
import TableExpenditure from "./AddRoomDialog/TableExpenditure";
import RoomOverall from "./AddRoomDialog/RoomOverall";
import RoomServices from "../../../Services/Room.service";
import { Expenditure } from "../../../Hooks/useGetRoomDetail";

interface IRoomActionDialog {
  toggle: () => void;
  houseData: House;
  data?: any;
}

export interface RoomInitValues {
  house: string;
  name: string;
  price: string;
  size: number;
  maxGuest: number;
  status: {
    value: string;
    label: string;
  };
  guests:
    | {
        name: string;
      }[]
    | [];
  electricityFee: string;
  waterFee: string;
  internetFee: string;
  livingExpense: string;
  parkingFee: string;
  expenditures?: Expenditure[];
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
      house: houseData._id,
      name: data?.name ? data.name : "",
      price: data?.price ? data.price : 0,
      maxGuest: data?.maxGuest ? data.maxGuest : 0,
      size: data?.size ? data.size : 0,
      status: data?.status
        ? data.status
        : { value: "available", label: "Available" },
      guests: data?.guests ? data.guests : [],
      electricityFee: data?.electricityFee ? data.electricityFee : 0,
      waterFee: data?.waterFee ? data.waterFee : 0,
      internetFee: data?.internetFee ? data.internetFee : 0,
      livingExpense: data?.livingExpense ? data.livingExpense : 0,
      parkingFee: data?.parkingFee ? data.parkingFee : 0,
      expenditures: data?.expenditures
        ? data.expenditures
        : [
            {
              id: "1",
              name: "Brokerage fee",
              price: 0,
              unit: "",
              unitPrice: 0,
              quantity: 0,
            },
          ],
    };
  }, [data, houseData._id]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
      price: yup.string().required("Price is required field"),
      maxGuest: yup.string().required("Max guest is required field"),
      size: yup.string().required("Size is required field"),
      status: yup.object().required("Status is required field"),
      guests: yup.array().of(
        yup.object().shape({
          name: yup.string().required("Name is required field"),
        })
      ),
      electricityFee: yup
        .string()
        .required("Electricity fee is required field"),
      waterFee: yup.string().required("Water fee is required field"),
      internetFee: yup.string().required("Internet fee is required field"),
      livingExpense: yup.string().required("Living expense is required field"),
      parkingFee: yup.string().required("Parking fee is required field"),
      expenditures: yup.array().of(
        yup.object().shape({
          name: yup.string().required("Name is required field"),
          price: yup.string().required("Price is required field"),
          unitPrice: yup.string().required("Unit price is required field"),
          quantity: yup.string().required("Quantity is required field"),
        })
      ),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(
    async (values: RoomInitValues) => {
      const toastId = toast.loading("Processing...");

      try {
        await RoomServices.createRoom(values);

        await refetchHouseDetail();

        toggle();

        toast.update(toastId, {
          render: "Success!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (error) {
        console.log('error', error);
        toast.update(toastId, {
          render: "Failed!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    },
    [data, houseData]
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
              <PerfectScrollBar style={{ maxHeight: "70vh" }}>
                <DialogContent
                  sx={{
                    minHeight: "50vh",
                  }}
                >
                  <RoomInformations />
                  <RoomFee />
                  <TableExpenditure />
                </DialogContent>
              </PerfectScrollBar>

              <DialogActions>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <RoomOverall />
                  <Box
                    display="flex"
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
          maxWidth="lg"
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
