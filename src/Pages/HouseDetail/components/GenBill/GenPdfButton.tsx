import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../../Hooks/useToggleDialog";
import CommonStyles from "../../../../Components/CommonStyles";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Formik, Form, FastField, FormikHelpers } from "formik";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CommonIcons from "../../../../Components/CommonIcons";
import { capitalize, isArray, isEmpty, isString } from "lodash";
import { House } from "../../../Home/interface";
import RoomSelect from "./RoomSelect";
import GuestSelect from "./GuestSelect";
import { RoomDetail } from "../../../../Hooks/useGetRoomDetail";
import TableBill from "./TableBill";
import CommonField from "../../../../Components/CommonFields";
import moment, { Moment } from "moment";
import { Bill, BillQuantityType } from "../../../../Interfaces/common";
import FormikEffectPDF from "./FormikEffectPDF";
import { numberToVietnameseText, removeAllDot } from "../../../../Helpers";
import { toast } from "react-toastify";
import FirebaseServices from "../../../../Services/Firebase.service";
import { compareBill } from "../../../../Constants/PDF.templates";
import { generatePDF } from "../../../../Helpers/PDF";
import PerfectScrollbar from "react-perfect-scrollbar";
import { v4 as uuid } from "uuid";
import { GuestBill } from "../../../../Hooks/useGetBill";

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
  images?: File[];
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
          status: "unpaid",
          type: BillQuantityType.MONTH,
        },
      ],
      fromDate: moment(),
      toDate: moment().add(1, "month"),
      images: [],
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      room: yup.object().required("Room is required"),
      guest: yup.object().required("Guest is required"),
      fromDate: yup.object().required("From date is required"),
      toDate: yup.object().required("To date is required"),
      bill: yup.array().of(
        yup.object().shape({
          name: yup.string().required("Name is required"),
          unit: yup.string().required("Unit is required"),
          unitPrice: yup.string().required("Unit price is required"),
          status: yup.string().required("Status is required"),
          type: yup.string().required("Type is required"),
          quantity: yup.number().when("type", {
            is: BillQuantityType.MONTH,
            then: (schema: any) => schema.required("Quantity is required"),
          }),
          startMonthQuantity: yup.number().when("type", {
            is: BillQuantityType.START_END,
            then: (schema: any) =>
              schema.required("Start month quantity is required"),
          }),
          endMonthQuantity: yup.number().when("type", {
            is: BillQuantityType.START_END,
            then: (schema: any) =>
              schema.required("End month quantity is required"),
          }),
        })
      ),
    });
  }, []);

  //! Function
  const handleDownloadPDF = async (
    values: PDFInitValues,
    setSubmitting: any
  ) => {
    setSubmitting(true);
    try {
      const dd = await compareBill(values);

      generatePDF(dd as any);
    } catch (error) {
      console.log("err", error);
    }
    setSubmitting(false);
  };
  const handleSubmit = useCallback(
    async (
      values: PDFInitValues,
      formikHelpers?: FormikHelpers<PDFInitValues>
    ) => {
      if (!values.guest?.id || isString(values.room) || !values?.room?._id)
        return;

      if (!formikHelpers) return;

      const toastID = toast.loading("Creating new bill...", {
        isLoading: true,
        autoClose: false,
      });
      const finalBill: GuestBill = {
        id: uuid(),
        billDetails: values.bill,
        fromDate: values.fromDate?.startOf("day").valueOf(),
        toDate: values.toDate?.endOf("day").valueOf(),
        guest: values.guest.id,
        guestName: values.guest.name,
        house: houseData?._id,
        houseName: houseData?.name,
        roomName: values.room.name,
        room: values.room._id,
        total: values.bill.reduce(
          (acc, cur) => acc + +removeAllDot(`${cur.price}`),
          0
        ),
      };

      if (values.images && values.images?.length > 0) {
        const toastUploadImg = toast.loading("Uploading images...", {
          isLoading: true,
          autoClose: false,
        });
        const uploadImgsPromise: any[] = [];

        const onFailed = () => {
          toast.update(toastUploadImg, {
            render: "Failed to upload images!",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        };

        values.images.forEach((img) => {
          const promise = new Promise((res) => {
            FirebaseServices.uploadImage(
              img,
              {
                contentType: img.type,
              },
              onFailed,
              (url) => res(url),
              () => {},
              `bills/house_${houseData._id}/room_${finalBill.room}/guest_${finalBill.guest}/${finalBill.id}`
            );
          });

          uploadImgsPromise.push(promise);
        });

        const uploadImgResponse = await Promise.all(uploadImgsPromise);
        finalBill.images = uploadImgResponse;

        toast.update(toastUploadImg, {
          render: "Images uploaded successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }

      await FirebaseServices.updateGuestBill(
        values.guest?.id,
        finalBill,
        () => {
          toast.update(toastID, {
            render: "Failed to create bill!",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      );

      toast.update(toastID, {
        render: "Bill created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      toggle();
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
      {({
        isSubmitting,
        errors,
        dirty,
        values,
        setFieldValue,
        setSubmitting,
      }) => {
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
                >
                  <Box
                    sx={{ display: "flex", gap: "10px", alignItems: "center" }}
                  >
                    <CommonStyles.Typography type="bold18">
                      Generate bill
                    </CommonStyles.Typography>
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

              <PerfectScrollbar style={{ maxHeight: "70vh" }}>
                <DialogContent
                  sx={{
                    minHeight: "50vh",
                  }}
                >
                  <Box
                    sx={{ display: "flex", gap: "8px", marginBottom: "20px" }}
                  >
                    <RoomSelect houseId={houseData?._id} />
                    <GuestSelect houseId={houseData?._id}/>
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
                  <CommonStyles.FilesUpload
                    label="Upload Images"
                    files={values.images}
                    dropzoneProps={{
                      onDrop: (acceptedFiles) => {
                        const newImages = values.images?.concat(acceptedFiles);
                        setFieldValue("images", newImages);
                      },
                      accept: {
                        "image/*": [],
                      },
                      maxFiles: 10,
                    }}
                    handleDeleteFile={(index) => {
                      if (!values.images) return;
                      const newFiles = values.images.filter(
                        (_, i) => i !== index
                      );
                      setFieldValue("images", newFiles);
                    }}
                  />
                </DialogContent>
              </PerfectScrollbar>

              <DialogActions
                sx={{
                  justifyContent: "space-between",
                  padding: "10px 20px",
                  alignItems: "end",
                }}
              >
                <CommonStyles.Typography type="bold18">
                  Total:{" "}
                  <CommonStyles.Typography type="normal18" component="span">
                    {isArray(values.bill) &&
                      values.bill
                        .reduce(
                          (total, item) =>
                            total + Number(removeAllDot(`${item.price}`)),
                          0
                        )
                        .toLocaleString("vi-VN")}{" "}
                    VND
                  </CommonStyles.Typography>
                  <CommonStyles.Typography type="bold18">
                    In words:{" "}
                    <CommonStyles.Typography type="normal18" component="span">
                      {capitalize(
                        numberToVietnameseText(
                          isArray(values.bill)
                            ? +values.bill.reduce(
                                (total, item) =>
                                  total + Number(removeAllDot(`${item.price}`)),
                                0
                              )
                            : 0
                        )
                      )}{" "}
                      đồng.
                    </CommonStyles.Typography>
                  </CommonStyles.Typography>
                </CommonStyles.Typography>
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
                    variant="outlined"
                    onClick={(event) => {
                      handleDownloadPDF(values, setSubmitting);
                      event.stopPropagation();
                    }}
                    disabled={
                      isSubmitting || !values.room || !values.guest || !dirty
                    }
                    type="button"
                  >
                    Download PDF
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    variant="text"
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
