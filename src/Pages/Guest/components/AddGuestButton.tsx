import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";

import { useMemo } from "react";
import * as yup from "yup";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FastField, Field, Form, Formik } from "formik";
import { isEmpty } from "lodash";
import FirebaseServices from "../../../Services/Firebase.service";
import { toast } from "react-toastify";
import vietnameCityData from "../../../Constants/vietnam-city.json";
import { useGet } from "../../../Stores/useStore";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import CommonField from "../../../Components/CommonFields";
import { RoomDetail } from "../../../Hooks/useGetRoomDetail";

interface IActionGuestDialog {
  toggle: () => void;
  data?: any;
  refetchKey: string;
  roomData?: RoomDetail;
}

export interface GuestInitValue {
  id?: string;
  address?: string;
  name: string;
  dob?: string;
  city?: {
    value: string;
    label: string;
  };
  district?: {
    value: string;
    label: string;
    idCity: string;
  };
  commune?: {
    value: string;
    label: string;
    idDistrict: string;
  };
  houseId?: string;
  gender?: string;
  room?: {
    id: string;
    name: string;
  };
  citizenIdFront?: File | string;
  citizenIdBack?: File | string;
  contractData?: File[] | string[];
  history?: string;
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
      //   dob: data?.dob ? data.dob : undefined,
      city: data?.city ? data.city : undefined,
      district: data?.district ? data.district : undefined,
      commune: data?.commune ? data.commune : undefined,
      citizenIdFront: data?.citizenIdFront ? data.citizenIdFront : undefined,
      citizenIdBack: data?.citizenIdBack ? data.citizenIdBack : undefined,
      contractData: data?.contractData ? data.contractData : [],
    };
  }, [data]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = async (values: GuestInitValue) => {
    const toastId = toast.loading("Creating new guest...", {
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

    const uploadFront = new Promise((res) => {
      const citizenIdFront = values.citizenIdFront as File;
      const toastId = toast.loading("Uploading citizen ID (Front)...", {
        isLoading: true,
        autoClose: 0,
      });
      if (!citizenIdFront) return res(null);
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
      const toastId = toast.loading("Uploading citizen ID (Back)...", {
        isLoading: true,
        autoClose: 0,
      });
      if (!citizenBack) return res(null);
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

    const uploadContracts: Promise<any>[] = [];

    const toastIdContract = toast.loading("Uploading contracts...", {
      isLoading: true,
      autoClose: 0,
    });

    values.contractData?.forEach((file) => {
      const uploadContract = new Promise((res) => {
        const contractFile = file as File;
        FirebaseServices.uploadImage(
          contractFile,
          { contentType: contractFile.type },
          onFailed,
          (url) => {
            res(url);
          },
          () => {},
          `contracts/${values.name}`
        );
      });
      uploadContracts.push(uploadContract);
    });

    const citizenId = await Promise.all([
      uploadFront,
      uploadBack,
      ...uploadContracts,
    ]);

    toast.update(toastIdContract, {
      isLoading: false,
      type: "success",
      render: "Upload contracts success!",
      autoClose: 3000,
    });

    const newGuest = {
      ...values,
      citizenIdFront: citizenId[0] as string,
      citizenIdBack: citizenId[1] as string,
      contractData: citizenId.slice(2) as string[],
    };

    if (roomData?.id) {
      newGuest.room = {
        id: roomData.id,
        name: roomData.name,
      };
    }

    const response = await FirebaseServices.addGuest(newGuest, onFailed);

    if (!response) return;

    if (roomData) {
      const newRoom = {
        ...roomData,
        guests: [...roomData.guests, { id: response.id, name: values.name }],
      };

      await FirebaseServices.updateRoom(newRoom, onFailed);
    }

    await refetch();

    toast.update(toastId, {
      isLoading: false,
      type: "success",
      render: `Add ${values.name} success!`,
      autoClose: 3000,
    });
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
                  mb={2}
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

              <DialogContent
                sx={{
                  minHeight: "50vh",
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
                <FastField
                  name="address"
                  component={CommonField.InputField}
                  fullWidth
                  label="Address"
                  placeholder="Enter address"
                  maxChar={50}
                />
                <Box sx={{ display: "flex", gap: "16px" }}>
                  <CommonStyles.ImageUpload
                    label="Upload citizen ID (Front)"
                    dropzoneProps={{
                      onDrop: (acceptedFile) => {
                        setFieldValue("citizenIdFront", acceptedFile[0]);
                      },
                    }}
                  />
                  <CommonStyles.ImageUpload
                    label="Upload citizen ID (Back)"
                    dropzoneProps={{
                      onDrop: (acceptedFile) => {
                        setFieldValue("citizenIdBack", acceptedFile[0]);
                      },
                    }}
                  />
                </Box>

                <CommonStyles.FilesUpload
                  label="Upload contract"
                  files={values.contractData}
                  dropzoneProps={{
                    onDrop: (acceptedFiles) => {
                      setFieldValue("contractData", [
                        ...(values?.contractData as File[]),
                        ...acceptedFiles,
                      ]);
                    },
                  }}
                  handleDeleteFile={(index) => {
                    if (!values.contractData) return;
                    const newFiles = values.contractData.filter(
                      (_, i) => i !== index
                    );
                    setFieldValue("contractData", newFiles);
                  }}
                />
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
  roomData?: RoomDetail;
}

function AddGuestButton(props: IAddGuestButton) {
  //! State
  const { buttonProps, refetchKey, roomData } = props;
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
