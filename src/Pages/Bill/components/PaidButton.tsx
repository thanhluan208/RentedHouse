import { Fragment } from "react/jsx-runtime";
import { BillResponse } from "../../../Hooks/useGetBill";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";
import BillServices, { PayBill } from "../../../Services/Bill.service";
import { useGet } from "../../../Stores/useStore";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import { memo, useMemo } from "react";
import FirebaseServices from "../../../Services/Firebase.service";
import { FastField, Form, Formik, FormikHelpers } from "formik";
import moment from "moment";
import CommonField from "../../../Components/CommonFields";

interface IPayBillDialog {
  onConfirm: (value: PayBill) => void;
  toggle: () => void;
  data: BillResponse;
}

type PayBillInitValue = {
  files: File[];
  paidDate: moment.Moment;
};

const PaybillDialog = memo((props: IPayBillDialog) => {
  //! State
  const { onConfirm, toggle, data } = props;

  const initialValue: PayBillInitValue = useMemo(() => {
    return {
      files: [],
      paidDate: moment(),
    };
  }, []);

  //! Function
  const handleSubmit = async (
    values: PayBillInitValue,
    formikHelper: FormikHelpers<PayBillInitValue>
  ) => {
    const { files } = values;
    const { setSubmitting } = formikHelper;
    setSubmitting(true);
    const toastId = toast.loading("Saving...", {
      autoClose: false,
      isLoading: true,
    });

    try {
      const listPromise: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const promise = new Promise((res, rej) => {
          FirebaseServices.uploadImage(
            files[i],
            {
              contentType: files[i].type,
            },
            (error) => {
              toast.error("Upload failed" + error.message);
              rej(error);
            },
            (url) => res(url),
            () => {},
            `bills/house_${data.room.house}/room_${data.room._id}/guest_${data.guest._id}/${files[i].name}`
          );
        });
        listPromise.push(promise);
      }

      const listFile = await Promise.all(listPromise);

      toast.update(toastId, {
        render: "Save successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      onConfirm({
        proves: listFile,
        payDate: values.paidDate.toDate(),
      });
    } catch (error: any) {
      toast.error("Save failed" + error.message);
    }
  };

  //! Render
  return (
    <Formik initialValues={initialValue} onSubmit={handleSubmit}>
      {({ values, setFieldValue, isSubmitting }) => {
        return (
          <Form
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DialogTitle>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <CommonStyles.Typography type="bold18">
                  Pay bill
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
                width: "100vw",
                maxWidth: "100%",
              }}
            >
              <FastField
                name="paidDate"
                component={CommonField.DatePickerField}
                label="Pay date"
                views={["month", "year"]}
              />
              <CommonStyles.FilesUpload
                label="Upload Images"
                files={values.files}
                dropzoneProps={{
                  onDrop: (acceptedFiles) => {
                    const nextFile = [...values.files, ...acceptedFiles];
                    setFieldValue("files", nextFile);
                  },
                  accept: {
                    "image/*": [],
                  },
                  maxFiles: 10,
                }}
                handleDeleteFile={(index) => {
                  const nextFile = values.files.filter(
                    (_, idx) => idx !== index
                  );

                  setFieldValue("files", nextFile);
                }}
              />
            </DialogContent>

            <DialogActions>
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
                  disabled={isSubmitting}
                >
                  Confirm
                </CommonStyles.Button>
              </Box>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
});

interface IPaidButton {
  data: BillResponse;
}

const PaidButton = (props: IPaidButton) => {
  //! State
  const { data } = props;
  const refetchBillList = useGet("REFETCH_BILL_LIST");
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function
  const onClick = async (value: PayBill) => {
    const toastId = toast.loading("Processing...", {
      autoClose: false,
      isLoading: true,
    });
    try {
      await BillServices.payBill(data._id, value);

      await refetchBillList();

      toast.update(toastId, {
        render: "Paid successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Paid failed!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          onClose={(e: any) => {
            e.stopPropagation();
            toggle();
          }}
          maxWidth="sm"
          toggle={toggle}
        >
          <PaybillDialog onConfirm={onClick} data={data} toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        isIcon
        tooltip="Pay bill"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
      >
        <CommonIcons.Payment />
      </CommonStyles.Button>
    </Fragment>
  );
};

export default PaidButton;
