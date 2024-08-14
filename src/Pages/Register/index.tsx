import { Box } from "@mui/material";
import { FastField, Form, Formik } from "formik";
import * as yup from "yup";
import { SignUpPayload, useAuth } from "../../Providers/AuthenticationProvider";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CommonStyles from "../../Components/CommonStyles";
import CommonField from "../../Components/CommonFields";

const Register = () => {
  //! State
  const { isLogged, signUp } = useAuth();
  const navigate = useNavigate();
  const initialValues: SignUpPayload = {
    name: "",
    password: "",
    email: "",
    retypePassword: "",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Email or username is required"),
    password: yup.string().required("Password is required"),
    email: yup.string().email().required("Email is required"),
    retypePassword: yup
      .string()
      .required("Re-type password is required")
      .test("password-match", "Password must match", function (value) {
        return this.parent.password === value;
      }),
  });

  //! Function

  //! Effect
  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged]);

  //! Render
  return (
    <Box
      sx={{
        background: "linear-gradient(173deg,#ecf4ff -.79%,#d3e1ff 94.5%)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {() => {
          return (
            <Form
              style={{
                background: " #fff",
                border: "1px solid rgba(28, 31, 35, .08)",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 14px 0 rgba(0, 0, 0, .1), 0 0 1px 0 rgba(0, 0, 0, .3)",
                padding: "40px 64px",
                width: "50vw",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <CommonStyles.Typography type="bold32">
                Welcome to Alphii
              </CommonStyles.Typography>
              <CommonStyles.Typography type="normal16" textAlign={"center"}>
                Sign in to access your dashboard, chatbots, and more...
              </CommonStyles.Typography>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "20px",
                }}
              >
                <FastField
                  name="email"
                  component={CommonField.InputField}
                  fullWidth
                  label="Email"
                  placeholder="Enter your Email"
                />
                <FastField
                  name="name"
                  component={CommonField.InputField}
                  fullWidth
                  label="Username"
                  required
                  placeholder="Enter your Username"
                />

                <FastField
                  name="password"
                  component={CommonField.InputField}
                  fullWidth
                  label="Password"
                  required
                  placeholder="Enter your password"
                  type="password"
                />

                <FastField
                  name="retypePassword"
                  component={CommonField.InputField}
                  fullWidth
                  label="Re-type Password"
                  required
                  placeholder="Enter your re-type password"
                  type="password"
                />

                <CommonStyles.Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: "20px",
                    padding: "12px 0",
                    fontWeight: "550",
                    height: "40px",
                  }}
                >
                  Sign up
                </CommonStyles.Button>
                <CommonStyles.Typography
                  type="normal14"
                  mt={"16px"}
                  textAlign={"center"}
                >
                  Already have an account? <Link to="/login">Sign in</Link>
                </CommonStyles.Typography>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default Register;
