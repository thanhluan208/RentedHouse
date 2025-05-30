import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../../Hooks/useToggleDialog";
import CommonStyles from "../../../../Components/CommonStyles";
import { useCallback, useEffect, useMemo } from "react";
import * as yup from "yup";
import { Formik, Form, FastField, FormikHelpers, Field } from "formik";
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
import {
  Bill,
  BillQuantityType,
  BillStatus,
} from "../../../../Interfaces/common";
import FormikEffectPDF from "./FormikEffectPDF";
import { monthTextToNum, numberToVietnameseText, removeAllDot } from "../../../../Helpers";
import { toast } from "react-toastify";
import { compareBill } from "../../../../Constants/PDF.templates";
// @ts-ignore
import { generatePDF } from "../../../../Helpers/PDF";
import PerfectScrollbar from "react-perfect-scrollbar";
import BillServices from "../../../../Services/Bill.service";
import { GuestDetail } from "../../../../Hooks/useGetGuestDetail";
import { useGet, useSave } from "../../../../Stores/useStore";
import cachedKeys from "../../../../Constants/cachedKeys";
import FirebaseServices from "../../../../Services/Firebase.service";
import RepeatExpense from "./RepeatExpense";

interface IBillActionDialog {
  toggle: () => void;
  houseData?: House;
  refetchKey?: string;
}

export interface PDFInitValues {
  id?: string;
  room: RoomDetail | undefined;
  guest: GuestDetail | undefined;
  bill: Bill[];
  fromDate: Moment | undefined;
  toDate: Moment | undefined;
  images?: File[] | string[];
  status?: BillStatus;
  isExpense: boolean;
  repeats?: string[];
}

export const BillActionDialog = (props: IBillActionDialog) => {
  //! State
  const { toggle, houseData, refetchKey } = props;
  const save = useSave();
  const dataBill: PDFInitValues = useGet("BILL_DETAIL");
  const refetch = useGet(refetchKey as any);
  

  const isPaid = useMemo(() => {
    return dataBill?.status?.toLowerCase() === "paid";
  }, [dataBill]);

  const initialValues: PDFInitValues = useMemo(() => {
    return {
      id: dataBill?.id || undefined,
      room: dataBill?.room || undefined,
      guest: dataBill?.guest || undefined,
      bill: dataBill?.bill || [
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
      fromDate: dataBill?.fromDate || moment(),
      toDate: dataBill?.toDate || moment().add(1, "month"),
      images: dataBill?.images || [],
      isExpense: dataBill?.isExpense || false,
    };
  }, [dataBill]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      room: yup.object().required("Room is required"),
      guest: yup.object().when("isExpense", {
        is: false,
        then: (schema: any) => schema.required("Guest is required"),
      }),
      fromDate: yup.object().required("From date is required"),
      toDate: yup.object().required("To date is required"),
      bill: yup
        .array()
        .min(1, "Bill must have at least 1 item")
        .of(
          yup.object().shape({
            name: yup.string().required("Name is required"),
            unit: yup.string().required("Unit is required"),
            unitPrice: yup.string().required("Unit price is required"),
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
      if (dataBill?.id) {
        const response = await BillServices.genPDf(dataBill.id);

        generatePDF(response.data.template);
      } else {
        const dd = await compareBill(values);

        generatePDF(dd as any);
      }
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
      if (!formikHelpers || isPaid) return;
      const isUpdate = !!dataBill?.id;

      const toastLoadingText = isUpdate
        ? "Updating bill..."
        : "Creating new bill...";
      const toastID = toast.loading(toastLoadingText, {
        isLoading: true,
        autoClose: false,
      });

      try {
        const finalBill = {
          ...values,
        };

        if (values.images && values.images?.length > 0) {
          const needUploadImages = values.images.filter((item) => {
            return !isString(item);
          });

          const uploadList: any[] = [];

          needUploadImages.forEach((item) => {
            const promise = new Promise((res) => {
              FirebaseServices.uploadImage(
                item as File,
                {
                  contentType: "image/*",
                },
                (error) => {
                  console.log("err", error);
                },
                (url) => res(url),
                (progress) => {
                  toast.info(`Uploading ${progress}%`);
                },
                `bills/${values.room?.house}/${values.room?._id}/${values.guest?._id}`
              );
            });

            uploadList.push(promise);
          });

          const uploadedImages = await Promise.all(uploadList);

          finalBill.images = [
            ...values.images
              .filter((item) => isString(item))
              .map((item) => item as string),
            ...uploadedImages,
          ];
        }

        if (values.repeats) {
          delete finalBill.repeats;

          const promises: any[] = []
          
          values.repeats.forEach((item) => {
            const payload = {
              ...finalBill,
              fromDate: moment(finalBill.fromDate).set('month', monthTextToNum(item) - 1),
              toDate: moment(finalBill.fromDate).set('month', monthTextToNum(item) - 1),
            }

            promises.push(BillServices.createBill(payload));
          })

          const response = await Promise.allSettled(promises);

          response.forEach((item, index) => {
            if(item.status === "rejected") {
              toast.error(`Failed to create bill in ${values.repeats?.[index]}`);
            }
          })
        } else if (isUpdate) {
          await BillServices.updateBill(finalBill);
        } else {
          await BillServices.createBill(finalBill);
        }

        refetch && (await refetch());

        toast.update(toastID, {
          render: "Bill created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });

        toggle();
      } catch (error) {
        console.log("err", error);
        toast.update(toastID, {
          render: "Failed to create bill!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    },
    [toggle, refetch, isPaid]
  );

  //! Effect
  useEffect(() => {
    return () => {
      save(cachedKeys.BILL_DETAIL, undefined);
    };
  }, [save]);

  //! Render
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      validateOnMount
      enableReinitialize
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
                    <CommonStyles.Typography
                      type="bold18"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {dataBill?.id ? (
                        <Fragment>
                          Update bill{" "}
                          <CommonStyles.Chip
                            label={dataBill?.status || ""}
                            color={
                              dataBill?.status?.toLowerCase() === "paid"
                                ? "success"
                                : "warning"
                            }
                          />
                        </Fragment>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            gap: "24px",
                            alignItems: "center",
                          }}
                        >
                          Generate bill
                          <Box
                            sx={{
                              display: "flex",
                              padding: "4px 12px",
                              borderRadius: "12px",
                              border: "solid 1px #ccc",
                              gap: "8px",
                            }}
                          >
                            <CommonStyles.Button
                              variant={values.isExpense ? "contained" : "text"}
                              startIcon={<CommonIcons.MoneyOff />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldValue("isExpense", true);
                              }}
                            >
                              Expense bill
                            </CommonStyles.Button>
                            <CommonStyles.Button
                              variant={values.isExpense ? "text" : "contained"}
                              startIcon={<CommonIcons.AttachMoney />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFieldValue("isExpense", false);
                              }}
                            >
                              Income bill
                            </CommonStyles.Button>
                          </Box>
                        </Box>
                      )}
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
                    <RoomSelect
                      houseId={houseData?._id || dataBill?.room?.house || ""}
                      disabled={isPaid}
                    />
                    {!values.isExpense && (
                      <GuestSelect
                        houseId={houseData?._id || dataBill?.room?.house || ""}
                        disabled={isPaid}
                      />
                    )}
                    <Field
                      name="fromDate"
                      component={CommonField.DatePickerField}
                      label={values.isExpense ? "Pay date" : "From Date"}
                      disabled={isPaid}
                    />
                    {!values.isExpense && (
                      <FastField
                        name="toDate"
                        component={CommonField.DatePickerField}
                        label="To Date"
                        disabled={isPaid}
                      />
                    )}
                  </Box>
                  <TableBill disabled={isPaid} />
                  {!values.isExpense ? (
                    <CommonStyles.FilesUpload
                      label="Upload Images"
                      files={values.images}
                      dropzoneProps={{
                        onDrop: (acceptedFiles) => {
                          if (isPaid) return;
                          const newImages =
                            values.images?.concat(acceptedFiles);
                          setFieldValue("images", newImages);
                        },
                        accept: {
                          "image/*": [],
                        },
                        maxFiles: 10,
                      }}
                      handleDeleteFile={(index) => {
                        if (!values.images || isPaid) return;
                        const newFiles = values.images.filter(
                          (_, i) => i !== index
                        );
                        setFieldValue("images", newFiles);
                      }}
                    />
                  ) : !isPaid ? (
                    (
                      <RepeatExpense />
                    )
                  ) : null}
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
                      event.stopPropagation();

                      handleDownloadPDF(values, setSubmitting);
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
                  {!isPaid && (
                    <CommonStyles.Button
                      variant="contained"
                      sx={{
                        color: "#fff",
                      }}
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting || !isEmpty(errors) || !dirty}
                    >
                      {dataBill?.id ? "Update" : "Create"}
                    </CommonStyles.Button>
                  )}
                </Box>
              </DialogActions>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

interface ICreateBillButton {
  houseData: House;
}

const CreateBillButton = (props: ICreateBillButton) => {
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
          <BillActionDialog toggle={toggle} houseData={houseData} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button variant="contained" onClick={toggle}>
        Generate bill
      </CommonStyles.Button>
    </Fragment>
  );
};

export default CreateBillButton;
