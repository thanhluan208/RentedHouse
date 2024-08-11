import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../../Hooks/useToggleDialog";
import CommonStyles from "../../../../Components/CommonStyles";
import { useCallback, useMemo } from "react";
import * as yup from "yup";
import { Formik, Form, FastField } from "formik";

import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CommonIcons from "../../../../Components/CommonIcons";
import { capitalize, isEmpty } from "lodash";
import { House } from "../../../Home/interface";
import RoomSelect from "./RoomSelect";
import GuestSelect from "./GuestSelect";
import { RoomDetail } from "../../../../Hooks/useGetRoomDetail";
import TableBill from "./TableBill";
import { generatePDF } from "../../../../Helpers/PDF";
import CommonField from "../../../../Components/CommonFields";
import moment, { Moment } from "moment";
import { numberToVietnameseText, removeAllDot } from "../../../../Helpers";

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
  month: Moment | undefined;
}

export type Bill = {
  id: string;
  name: string;
  price: number;
};

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
        },
      ],
      month: moment(),
    };
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({});
  }, []);

  //! Function

  const handleSubmit = useCallback(async (values: PDFInitValues) => {
    const dd = {
      content: [
        {
          text: "Hóa đơn tiền dịch vụ tháng " + values.month?.format("MM/YYYY"),
          style: "header",
        },
        {
          text: [
            "Phòng: ",
            { text: values?.room?.name, bold: true },

            " (Từ ngày: ",
            {
              text: values?.month?.startOf("month").format("DD/MM/YYYY"),
              bold: true,
            },
            " đến ngày: ",
            {
              text: values?.month?.endOf("month").format("DD/MM/YYYY"),
              bold: true,
            },
            ")",
          ],
          style: "subHeaderCenter",
        },
        {
          style: "tableExample",
          table: {
            widths: [50, "*", "*"],
            body: [
              [
                { text: "STT", style: "tableHeader" },
                { text: "Dịch vụ", style: "tableHeader" },
                { text: "Giá", style: "tableHeader" },
              ],
              ...values.bill.map((elm, index) => {
                return [index + 1, elm.name, elm.price];
              }),
            ],
          },
        },
        {
          text:
            "Tổng tiền: " +
            `${values.bill
              .reduce(
                (total, item) => total + Number(removeAllDot(`${item.price}`)),
                0
              )
              .toLocaleString("vi-VN")} VND`,
          style: "subheader",
        },
        {
          text:
            "Tổng tiền bằng chữ: " +
            `${capitalize(
              numberToVietnameseText(
                +values.bill.reduce(
                  (total, item) =>
                    total + Number(removeAllDot(`${item.price}`)),
                  0
                )
              )
            )} đồng.`,
          style: "subheader",
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
        },
        subHeaderCenter: {
          fontSize: 16,
          bold: true,
          margin: [0, 5, 0, 20],
          alignment: "center",
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
    };

    generatePDF(dd as any);
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
      {({ isSubmitting, errors, dirty, }) => {
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
                    Generate bill
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
                <Box sx={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                  <RoomSelect houseId={houseData?.id} />
                  <GuestSelect />
                  <FastField
                    name="month"
                    component={CommonField.DatePickerField}
                    label="Month"
                    views={["month", "year"]}
                  />
                </Box>
                <TableBill />
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
