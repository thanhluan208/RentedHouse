import useCalculateTable from "../useCalculateTable";
import { useFormikContext } from "formik";
import { memo, } from "react";
import { useGet } from "@/Stores/useStore";
import { MoneyFlowResponse } from "@/Hooks/useGetHouseMoneyFlow";

const FormikEffect = () => {
  const column = useGet("COLUMN_INCOME_EXPENSE") || [];
  const { values } = useFormikContext<{
    incomeAndExpenses: MoneyFlowResponse[];
  }>();


  useCalculateTable(column, values.incomeAndExpenses);

  return null;
};

export default memo(FormikEffect);
