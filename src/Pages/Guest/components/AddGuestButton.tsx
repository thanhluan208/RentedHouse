import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";

import { useMemo } from "react";
import * as yup from "yup";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, Formik } from "formik";
import { capitalize, isEmpty, isString } from "lodash";
import FirebaseServices from "../../../Services/Firebase.service";
import { toast } from "react-toastify";
import { useGet } from "../../../Stores/useStore";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import { GuestDetail } from "../../../Hooks/useGetGuestDetail";
import PerfectScollBar from "react-perfect-scrollbar";
import GuestGeneralInfo from "./GuestGeneralInfo";
import moment, { Moment } from "moment";
import { Room } from "../../Home/interface";
import GuestService from "../../../Services/Guest.service";
import { OptionCommon } from "@/Interfaces/common";

interface IActionGuestDialog {
  toggle: () => void;
  data?: GuestDetail;
  refetchKey: string;
  roomData?: Room;
}

export interface GuestInitValue {
  id?: string;
  address?: string;
  name: string;
  dob?: Moment;
  city?: OptionCommon;
  district?: OptionCommon;
  commune?: OptionCommon;
  gender?: string;
  citizenIdFront?: File | string;
  citizenIdBack?: File | string;
  contract?: File[] | string[];
  history?: string;
  phone?: string;
  checkIn?: Moment;
  checkOut?: Moment;
}

export const ActionGuestDialog = (props: IActionGuestDialog) => {
  //! State
  const { toggle, data, refetchKey, roomData } = props;
  const refetch = useGet(refetchKey as any);
  const isEdit = !!data;

  const initialValues: GuestInitValue = useMemo(() => {
    return {
      name: data?.name ? data.name : "",
      address: data?.address ? data.address : "",
      dob: data?.dob ? moment(data.dob) : undefined,
      city: data?.city ? data.city : undefined,
      district: data?.district ? data.district : undefined,
      commune: data?.commune ? data.commune : undefined,
      citizenIdFront: data?.citizenIdFront ? data.citizenIdFront : undefined,
      citizenIdBack: data?.citizenIdBack ? data.citizenIdBack : undefined,
      checkIn: data?.checkIn ? moment(data.checkIn) : moment(),
      checkOut: data?.checkOut ? moment(data.checkOut) : moment(),  
      phone: data?.phone ? data.phone : undefined,
      gender: data?.gender ? capitalize(data?.gender) : undefined,
    };
  }, [data]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = async (values: GuestInitValue) => {
    const toastMsg = isEdit ? "Updating guest..." : "Creating new guest...";
    const toastId = toast.loading(toastMsg, {
      isLoading: true,
      autoClose: 0,
    });
    const onFailed = (error: any) => {
      toast.update(toastId, {
        isLoading: false,
        type: "error",
        render: error.message,
        autoClose: 3000,
      });
    };

    try {
      const uploadFront = new Promise((res) => {
        const citizenIdFront = values.citizenIdFront as File;
        if (!citizenIdFront || isString(citizenIdFront)) return res(null);
        const toastId = toast.loading("Uploading citizen ID (Front)...", {
          isLoading: true,
          autoClose: 0,
        });
        FirebaseServices.uploadImage(
          citizenIdFront as File,
          { contentType: citizenIdFront.type },
          onFailed,
          (url) => {
            toast.update(toastId, {
              isLoading: false,
              type: "success",
              render: "Upload citizen ID (Front) success!",
              autoClose: 3000,
            });
            res(url);
          },
          (progress) => {
            toast.update(toastId, {
              isLoading: true,
              render: `Uploading citizen ID (Front)... ${progress}%`,
              autoClose: 0,
            });
          }
        );
      });

      const uploadBack = new Promise((res) => {
        const citizenBack = values.citizenIdBack as File;
        if (!citizenBack || isString(citizenBack)) return res(null);
        const toastId = toast.loading("Uploading citizen ID (Back)...", {
          isLoading: true,
          autoClose: 0,
        });
        FirebaseServices.uploadImage(
          citizenBack,
          { contentType: citizenBack.type },
          onFailed,
          (url) => {
            toast.update(toastId, {
              isLoading: false,
              type: "success",
              render: "Upload citizen ID (Back) success!",
              autoClose: 3000,
            });
            res(url);
          },
          (progress) => {
            toast.update(toastId, {
              isLoading: true,
              render: `Uploading citizen ID (Back)... ${progress}%`,
              autoClose: 0,
            });
          }
        );
      });

      const citizenId = await Promise.all([uploadFront, uploadBack]);

      const newGuest = {
        ...values,
        dob: values?.dob ? new Date(values.dob?.toDate()) : undefined,
        gender: values?.gender ? values?.gender.toUpperCase() : undefined,
        room: roomData?._id as string,
      };

      if (citizenId[0]) {
        newGuest.citizenIdFront = citizenId[0] as string;
      }

      if (citizenId[1]) {
        newGuest.citizenIdBack = citizenId[1] as string;
      }

      if (isEdit) {
        GuestService.updateGuestInfo(data?._id as string, newGuest);
      } else {
        await GuestService.createGuest(newGuest);
      }

      await refetch();

      toast.update(toastId, {
        isLoading: false,
        type: "success",
        render: isEdit
          ? `Update ${values.name} success!`
          : `Add ${values.name} success!`,
        autoClose: 3000,
      });

      toggle();
    } catch (error) {
      console.log("Error", error);
      onFailed(error);
    }
  };

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
      {({ isSubmitting, errors, values, dirty, setFieldValue, submitForm }) => {
        return (
          <Form
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "column",
            }}
          >
            <Box>
              <DialogTitle>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <CommonStyles.Typography type="bold18">
                    {isEdit ? "Update guest infos" : "Create new guest"}
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

              <PerfectScollBar style={{ maxHeight: "70vh" }}>
                <DialogContent
                  sx={{
                    minHeight: "50vh",
                  }}
                >
                  <GuestGeneralInfo />
                  <Box sx={{ display: "flex", gap: "16px" }}>
                    <CommonStyles.ImageUpload
                      initImage={values.citizenIdFront as string}
                      label="Upload citizen ID (Front)"
                      dropzoneProps={{
                        onDrop: (acceptedFile) => {
                          setFieldValue("citizenIdFront", acceptedFile[0]);
                        },
                      }}
                    />
                    <CommonStyles.ImageUpload
                      initImage={values.citizenIdBack as string}
                      label="Upload citizen ID (Back)"
                      dropzoneProps={{
                        onDrop: (acceptedFile) => {
                          setFieldValue("citizenIdBack", acceptedFile[0]);
                        },
                      }}
                    />
                  </Box>

                  
                </DialogContent>
              </PerfectScollBar>

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
                    onClick={submitForm}
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

interface IAddGuestButton {
  buttonProps?: any;
  refetchKey: string;
  roomData?: Room;
  guestData?: GuestDetail;
}

function AddGuestButton(props: IAddGuestButton) {
  //! State
  const { buttonProps, refetchKey, roomData, guestData } = props;
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
          <ActionGuestDialog
            toggle={toggle}
            refetchKey={refetchKey}
            roomData={roomData}
            data={guestData}
          />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        fullWidth
        variant="contained"
        startIcon={<CommonIcons.Add />}
        onClick={toggle}
        {...buttonProps}
      >
        {buttonProps?.content || "Add new guest"}
      </CommonStyles.Button>
    </Fragment>
  );
}

export default AddGuestButton;
