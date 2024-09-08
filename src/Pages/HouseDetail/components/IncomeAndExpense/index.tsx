import CommonStyles from "@/Components/CommonStyles";
import { Box } from "@mui/material";
import { capitalize, cloneDeep, isString } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import EachRow from "./components/EachRow";
import EditButton from "./components/EditButton";
import AddRowButton from "./components/AddRowButton";
import { IncomeAndExpenseColumn, initvalueDefault } from "./type";
import EditColumnButton from "./components/EditColumnButton";
import { FieldArray, FieldArrayRenderProps, Form, Formik } from "formik";
import FormikEffect from "./components/FormikEffect";
import * as yup from "yup";
import { useSave } from "@/Stores/useStore";
import cachedKeys from "@/Constants/cachedKeys";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import httpServices from "@/Services/http.services";
import { baseHouseApi } from "@/Constants/api";
import { useParams } from "react-router-dom";
import HouseModel from "@/Model/house.model";
import useGetHouseMoneyFlow, {
  MoneyFlowResponse,
} from "@/Hooks/useGetHouseMoneyFlow";
import TotalRow from "./components/TotalRow";

const columns = [
  {
    id: "content",
    label: "Nội dung",
    shouldDisplay: true,
  },
  {
    id: "january",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: true,
  },
  {
    id: "february",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "march",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "april",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "may",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "june",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "july",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "august",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "september",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "october",
    label: "",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "november",
    label: "",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
  {
    id: "december",
    label: "",
    children: [
      {
        id: "income",
        label: "Thu",
      },
      {
        id: "expense",
        label: "Chi",
      },
    ],
    shouldDisplay: false,
  },
];

const IncomeAndExpense = () => {
  //! State
  const columnLocal = localStorage.getItem("column");
  const [column, setColumn] = useState<IncomeAndExpenseColumn[]>(
    isString(columnLocal) ? JSON.parse(columnLocal) : columns
  );
  const arrayHelperRef = useRef<any>(null);
  const formikRef = useRef<any>(null);
  const save = useSave();

  const params = useParams();
  const houseId = params.id;

  const { data, refetch } = useGetHouseMoneyFlow(houseId as string);

  const initialValues: {
    incomeAndExpenses: MoneyFlowResponse[];
  } = useMemo(() => {
    return {
      incomeAndExpenses: data || [],
    };
  }, [data]);

  //! Function
  const handleSubmit = async (values: {
    incomeAndExpenses: MoneyFlowResponse[];
  }) => {
    const toastId = toast.loading("Saving...", {
      isLoading: true,
      autoClose: false,
    });

    save(cachedKeys.IS_EDITING_INCOME_EXPENSE, "loading");
    try {
      const payload = HouseModel.parsedPayloadAddRoom(
        houseId as string,
        values
      );

      await httpServices.post(`${baseHouseApi}/update-money-flow`, payload);

      await refetch();
      toast.update(toastId, {
        render: "Save successfully",
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 2000,
      });

      save(cachedKeys.IS_EDITING_INCOME_EXPENSE, false);
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: "Save failed",
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 2000,
      });
      save(cachedKeys.IS_EDITING_INCOME_EXPENSE, true);
    }
  };

  const handleAddRow = () => {
    const formik = formikRef.current;
    if (formik) {
      const { setFieldValue, values } = formik;
      setFieldValue("incomeAndExpenses", [
        ...values.incomeAndExpenses,
        {
          id: uuid(),
          ...cloneDeep(initvalueDefault)
        },
      ]);
    }
  };

  const handleRemoveRow = (index: number) => {
    const arrayHelper: FieldArrayRenderProps = arrayHelperRef.current;
    arrayHelper.remove(index);
  };

  const validationSchema = yup.object().shape({
    incomeAndExpenses: yup
      .array()
      .min(0)
      .of(
        yup.object().shape({
          content: yup.string().required("Nội dung không được để trống"),
        })
      ),
  });

  useEffect(() => {
    save(cachedKeys.COLUMN_INCOME_EXPENSE, column);
  }, [column]);
  //! Render
  return (
    <Box
      sx={{
        marginTop: "30px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CommonStyles.Typography type="bold24">
          Income & Expense
        </CommonStyles.Typography>
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <EditColumnButton column={column} setColumn={setColumn} />
          <EditButton />
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: "100%",
          overflowX: "auto",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <Box
          id="header-grid"
          className="table-width "
          sx={{
            display: "grid  ",
            padding: "15px 0",
            background: "#f9fafb",
            border: "1px solid #eff0f1",
            borderRadius: "8px",
            margin: "0 auto",
          }}
        >
          {column.map((col, index) => {
            const width = index === 0 ? "250px" : "100%";
            const displayCol = cloneDeep(column).filter(
              (elm) => elm.shouldDisplay
            );
            const isLastCol = displayCol[displayCol.length - 1].id === col.id;
            return (
              <Box
                key={col.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: col.shouldDisplay ? width : "0px",
                  background: "#f9fafb",
                  left: 0,
                  position: index === 0 ? "sticky" : "static",
                  borderRight:
                    isLastCol || !col.shouldDisplay ? "0" : "1px solid #aeafaf",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: col.shouldDisplay ? width : "0px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: col.shouldDisplay ? 1 : 0,
                    transition: "all 0.3s",
                    overflow: "hidden",
                  }}
                >
                  <CommonStyles.Typography type="bold16">
                    {capitalize(col.id)}
                  </CommonStyles.Typography>
                </Box>
                {col.children && col.shouldDisplay && (
                  <Box
                    sx={{
                      height: "38px",
                      width: col.shouldDisplay ? width : "0px",
                      display: "grid",
                      gridTemplateColumns: "50% 50%",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: col.shouldDisplay ? 1 : 0,
                      transition: "all 0.3s",
                    }}
                  >
                    {col.children.map((child, index) => {
                      return (
                        <CommonStyles.Typography
                          key={child.id}
                          type="bold14"
                          sx={{
                            textAlign: "center",
                            borderRight:
                              index === 0 ? "1px solid #aeafaf" : "none",
                          }}
                        >
                          {capitalize(child.id)}
                        </CommonStyles.Typography>
                      );
                    })}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          enableReinitialize
          innerRef={formikRef}
        >
          {({ values, isSubmitting }) => {
            return (
              <Form name="incomeAndExpensesForm">
                {!isSubmitting && <FormikEffect />}
                <FieldArray
                  name="incomeAndExpenses"
                  render={(arrayHelper) => {
                    arrayHelperRef.current = arrayHelper;
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "20px",
                        }}
                      >
                        {values.incomeAndExpenses.map((row, index) => {
                          let borderRadius = "";
                          if (index === 0) {
                            borderRadius = "8px 8px 0 0";
                          }
                          // if (index === values.incomeAndExpenses.length - 1) {
                          //   borderRadius = "0 0 8px 8px";
                          // }

                          return (
                            <EachRow
                              name={`incomeAndExpenses.${index}`}
                              key={(row._id ?? row?.id) + index}
                              column={column}
                              row={row}
                              borderRadius={borderRadius}
                              handleRemoveRow={() => handleRemoveRow(index)}
                            />
                          );
                        })}
                        <TotalRow column={column} />
                      </Box>
                    );
                  }}
                />
                <button
                  id="incomeAndExpensesForm"
                  type="submit"
                  style={{ display: "none" }}
                />
              </Form>
            );
          }}
        </Formik>
      </Box>

      <AddRowButton handleAddRow={handleAddRow} />
    </Box>
  );
};

export default IncomeAndExpense;
