import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonIcons from "../../CommonIcons";
import CommonStyles from "../../CommonStyles";
import { useTheme } from "@emotion/react";
import { useSave } from "../../../Stores/useStore";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FastField, Field, Form, Formik } from "formik";
import CommonField from "../../CommonFields";
import Team from "../../../assets/team.png";
import { isEmpty } from "lodash";
import WorkSpaceSelect from "./WorkSpaceSelect";
import { WorkSpaceOption, workSpaceOptions } from "../../../Constants/options";

interface ICreateBotDialog {
  toggle: () => void;
}

interface InitValues {
  workspace: WorkSpaceOption;
  name: string;
  description: string;
  profilePicture: string;
}

const CreateBotDialog = (props: ICreateBotDialog) => {
  //! State
  const { toggle } = props;
  const theme = useTheme();
  const save = useSave();

  const isDisabledAiGenerate = true;

  const initialValues = useMemo(() => {
    return {
      workspace: {
        label: "Luan team",
        avatar: Team,
        type: "team",
        value: "luanTeam",
      },
      name: "",
      description: "",
      profilePicture: Team,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(async (values: InitValues) => {
    // await processDelay();
  }, []);

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
      {({ isSubmitting, errors }) => {
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
                  mb={5}
                >
                  <CommonStyles.Typography type="normal18">
                    Create Bot
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
                <WorkSpaceSelect />

                <FastField
                  name="name"
                  component={CommonField.InputField}
                  fullWidth
                  label="Bot name"
                  required
                  placeholder="Give the bot a unique name"
                  maxChar={50}
                />
                <FastField
                  name="description"
                  component={CommonField.InputField}
                  fullWidth
                  label="Bot description"
                  placeholder="Introduce the bot's features. The description will be displayed to the bot's users"
                  multiline
                  minRows={6}
                  maxChar={2000}
                />

                <Box>
                  <CommonStyles.Typography type="bold14" my={1}>
                    Profile picture
                    <span
                      style={{
                        color: theme.colors.custom.colorErrorTypo,
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                  </CommonStyles.Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Field
                      name="avatar"
                      component={CommonField.ButtonUploadField}
                    />
                    <Box
                      sx={{
                        width: "100%",
                        borderRadius: "12px",
                        background: "#f0f0f5",
                        height: "100px",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 20px",
                      }}
                    >
                      <CommonStyles.Button
                        disabled={isDisabledAiGenerate}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          height: "80px",
                          width: "80px",
                          border: "solid 1px #ccc",
                          background: "#fff",
                          svg: {
                            width: "18px",
                            height: "18px",
                          },
                        }}
                      >
                        <CommonIcons.AiIcon />
                        <CommonStyles.Typography type="normal12">
                          Generate
                        </CommonStyles.Typography>
                      </CommonStyles.Button>
                    </Box>
                  </Box>
                </Box>
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
                    onClick={toggle}
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
                    disabled={isSubmitting || !isEmpty(errors)}
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

function CreateBotButton() {
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
          <CreateBotDialog toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button
        fullWidth
        variant="contained"
        startIcon={<CommonIcons.Add />}
        onClick={toggle}
      >
        Create bot
      </CommonStyles.Button>
    </Fragment>
  );
}

export default CreateBotButton;
