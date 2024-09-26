import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonIcons from "../../CommonIcons";
import CommonStyles from "../../CommonStyles";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FastField, Field, Form, Formik } from "formik";
import CommonField from "../../CommonFields";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";
import vietnameCityData from "../../../Constants/vietnam-city.json";
import { House } from "../../../Pages/Home/interface";
import { HouseStatus } from "../../../Constants/options";
import { useGet } from "../../../Stores/useStore";
import HouseServices, {
  CreateHouse,
  HouseStatusEnum,
} from "../../../Services/House.service";

interface ICreateHouseDialog {
  toggle: () => void;
  data?: House;
}

export const CreateHouseDialog = (props: ICreateHouseDialog) => {
  //! State
  const { toggle, data } = props;
  const refetchHouseList = useGet("REFETCH_HOUSE_LIST");
  const isEdit = !!data;

  const initialValues: CreateHouse = useMemo(() => {
    return {
      address: data?.address ? data.address : "",
      name: data?.name ? data.name : "",
      city: data?.city ? data?.city : undefined,
      district: data?.district ? data?.district : undefined,
      commune: data?.commune ? data?.commune : undefined,
      status: data?.status ? data.status : HouseStatusEnum.AVAILABLE,
    };
  }, [data]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
      address: yup.string().required("Address is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(
    async (values: CreateHouse) => {
      const toastLoadingText = isEdit
        ? `Updating ${data?.name}...`
        : "Creating new house...";
      const toastId = toast.loading(toastLoadingText, {
        autoClose: false,
        isLoading: true,
      });
      try {
        await HouseServices.createHouse(values);

        await refetchHouseList();

        const toastSuccess = isEdit
          ? `Update ${data?.name} success!`
          : `${values.name} created !`;
        toast.update(toastId, {
          type: "success",
          render: toastSuccess,
          autoClose: 3000,
          isLoading: false,
        });
        toggle();
      } catch (error: any) {
        const toastFailedText = isEdit
          ? `Update ${data?.name} failed!`
          : "Create new house failed!";
        toast.update(toastId, {
          type: "error",
          render: toastFailedText + error?.message,
          autoClose: 3000,
          isLoading: false,
        });
      }
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
      {({ isSubmitting, errors, values, dirty }) => {
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
                    {isEdit ? "Update house" : "Create new house"}
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
                  label="House name"
                  required
                  placeholder="Give the house a unique name"
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
                  required
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

function CreateHouseButton() {
  //! State

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
          <CreateHouseDialog toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        fullWidth
        variant="contained"
        startIcon={<CommonIcons.Add />}
        onClick={toggle}
        sx={{
          overflow:'hidden',
          textWrap:"nowrap"
        }}
      >
        Create new house
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateHouseButton;
