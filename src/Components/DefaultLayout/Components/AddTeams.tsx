import React, { useCallback, useMemo } from "react";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonIcons from "../../CommonIcons";
import CommonStyles from "../../CommonStyles";
import { Box, useTheme } from "@mui/material";
import { FastField, Field, Form, Formik, FormikValues } from "formik";
import Team from "../../../assets/team.png";
import * as yup from "yup";
import { processDelay } from "../../../Helpers";
import { useSave } from "../../../Stores/useStore";
import cachedKeys from "../../../Constants/cachedKeys";
import { v4 as uuid } from "uuid";
import CommonField from "../../CommonFields";

interface IAddTeamDialog {
  toggle: () => void;
}

interface InitValues {
  avatar: string;
  name: string;
  description: string;
}

const AddTeamDialog = (props: IAddTeamDialog) => {
  //! State
  const { toggle } = props;
  const theme = useTheme();
  const save = useSave();
  const initialValues = useMemo(() => {
    return {
      avatar: Team,
      name: "",
      description: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required field"),
      description: yup.string().required("Description is required field"),
    });
  }, []);

  //! Function

  const handleSubmit = useCallback(async (values: InitValues) => {
    const callback = () => {
      const id = uuid();
      save(
        cachedKeys.TEAM,
        (rootState: any) => {
          const team = rootState?.[cachedKeys.TEAM];
          if (team) {
            const newTeam = [{ id, ...values }, ...team];
            return newTeam;
          } else {
            return [{ id, ...values }];
          }
        },
        true
      );
      toggle();
    };

    await processDelay(callback);
  }, []);

  //! Render
  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <CommonStyles.Typography type="normal18">
          Create team
        </CommonStyles.Typography>
        <CommonStyles.Button isIcon onClick={toggle}>
          <CommonIcons.Clear />
        </CommonStyles.Button>
      </Box>
      <Box mt={3}>
        <CommonStyles.Typography
          type="normal14"
          color={theme.colors.custom.semiColorTypo}
        >
          Creating a team allows team members to collaborate on Bots, Plugins,
          Workflow, and Knowledge.
        </CommonStyles.Typography>
      </Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => {
          return (
            <Form
              style={{
                display: "flex",
                gap: "16px",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  my: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Field
                  name="avatar"
                  component={CommonField.ButtonUploadField}
                />
              </Box>
              <FastField
                name="name"
                component={CommonField.InputField}
                fullWidth
                label="Team name"
                required
                placeholder="Input team name"
                maxChar={50}
              />
              <FastField
                name="description"
                component={CommonField.InputField}
                fullWidth
                label="Description"
                placeholder="Describe team"
                multiline
                minRows={6}
                maxChar={500}
              />

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
                  disabled={isSubmitting}
                >
                  Confirm
                </CommonStyles.Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

function AddTeam() {
  //! State
  const { open, shouldRender, toggle } = useToggleDialog();

  //! Function

  //! Render
  return (
    <React.Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
        >
          <AddTeamDialog toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button isIcon onClick={toggle}>
        <CommonIcons.Add />
      </CommonStyles.Button>
    </React.Fragment>
  );
}

export default AddTeam;
