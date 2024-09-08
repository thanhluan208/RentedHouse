import { FormikProps } from "formik";

class formikService {
  formik: FormikProps<any>[] = [];

  setFormik = (formik: FormikProps<any>) => {
    this.formik.push(formik);
  };

  getFormikErrors = () => {
    return this.formik.map((formik) => formik.errors);
  };
}

const FormikService = new formikService();
export default FormikService;
