import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../../Hooks/useToggleDialog";
import CommonStyles from "../../../../Components/CommonStyles";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Formik, Form, FastField } from "formik";

import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CommonIcons from "../../../../Components/CommonIcons";
import { isEmpty, isString } from "lodash";
import { House } from "../../../Home/interface";
import RoomSelect from "./RoomSelect";
import GuestSelect from "./GuestSelect";
import { RoomDetail } from "../../../../Hooks/useGetRoomDetail";
import TableBill from "./TableBill";
import { generatePDF } from "../../../../Helpers/PDF";
import CommonField from "../../../../Components/CommonFields";
import moment, { Moment } from "moment";
import { Bill } from "../../../../Interfaces/common";
import FormikEffectPDF from "./FormikEffectPDF";
import { monthlyBill } from "../../../../Constants/PDF.templates";
import { genPDFCompare, } from "../../../../Helpers";

interface IPDFActionDialog {
  toggle: () => void;
  houseData: House;
}

export interface PDFInitValues {
  room: RoomDetail | undefined;
  guest:
    | {
        id: string;
        name: string;
      }
    | undefined;
  bill: Bill[];
  fromDate: Moment | undefined;
  toDate: Moment | undefined;
  isCompare?: boolean;
}

export const PDFActionDialog = (props: IPDFActionDialog) => {
  //! State
  const { toggle, houseData } = props;

  const initialValues: PDFInitValues = useMemo(() => {
    return {
      room: undefined,
      guest: undefined,
      bill: [
        {
          id: "1",
          name: "Tiền điện",
          price: 0,
          unit: "kWh",
          unitPrice: 0,
          quantity: 0,
        },
      ],
      fromDate: moment(),
      toDate: moment().add(1, "month"),
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({});
  }, []);

  //! Function

  const handleSubmit = useCallback(
    async (values: PDFInitValues) => {
      if (!values.guest?.id || isString(values.room) || !values?.room?.id)
        return;
      !values.isCompare && generatePDF(monthlyBill(values) as any);

      // const toastID = toast.loading("Creating new bill...", {
      //   isLoading: true,
      //   autoClose: false,
      // });
      // const finalBill = {
      //   billDetails: values.bill,
      //   fromDate: values.fromDate?.startOf("day").valueOf(),
      //   toDate: values.toDate?.endOf("day").valueOf(),
      //   guest: JSON.stringify({
      //     id: values.guest.id,
      //     name: values.guest.name,
      //   }),
      //   room: JSON.stringify({
      //     id: values.room.id,
      //     name: values.room.name,
      //   }),
      //   total: values.bill.reduce(
      //     (acc, cur) => acc + +removeAllDot(`${cur.price}`),
      //     0
      //   ),
      // };

      // await FirebaseServices.updateGuestBill(
      //   values.guest?.id,
      //   finalBill,
      //   () => {
      //     toast.update(toastID, {
      //       render: "Failed to create bill!",
      //       type: "error",
      //       isLoading: false,
      //       autoClose: 3000,
      //     });
      //   }
      // );

      // toast.update(toastID, {
      //   render: "Bill created successfully!",
      //   type: "success",
      //   isLoading: false,
      //   autoClose: 3000,
      // });

      // toggle();

      values.isCompare && genPDFCompare(values);
    },
    [toggle]
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
            <FormikEffectPDF />
            <Box>
              <DialogTitle>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={2}
                >
                  <Box
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <CommonStyles.Typography type="bold18">
                      Generate bill
                    </CommonStyles.Typography>
                    <FastField
                      name="isCompare"
                      component={CommonField.SwitchField}
                      label="Compare last month"
                    />
                  </Box>
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
                <Box sx={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  <RoomSelect houseId={houseData?.id} />
                  <GuestSelect />
                  <FastField
                    name="fromDate"
                    component={CommonField.DatePickerField}
                    label="From Date"
                  />
                  <FastField
                    name="toDate"
                    component={CommonField.DatePickerField}
                    label="To Date"
                  />
                </Box>
                <TableBill />
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

interface IGenPdfButton {
  houseData: House;
}

const GenPdfButton = (props: IGenPdfButton) => {
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
          <PDFActionDialog toggle={toggle} houseData={houseData} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button variant="outlined" onClick={toggle}>
        Generate bill PDF
      </CommonStyles.Button>
    </Fragment>
  );
};

export default GenPdfButton;
