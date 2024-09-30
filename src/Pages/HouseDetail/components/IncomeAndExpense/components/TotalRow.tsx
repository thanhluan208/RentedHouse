import CommonStyles from "@/Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import { Fragment, memo, useMemo, useState } from "react";
import { IncomeAndExpenseColumn, initvalueDefault } from "../type";
import { useFormikContext } from "formik";
import { MoneyFlowResponse } from "@/Hooks/useGetHouseMoneyFlow";
import { cloneDeep, isString } from "lodash";
import { removeAllDot } from "@/Helpers";
import EachCellDetail from "./TableRow/EachCellDetail";

interface ITotalRow {
  column: IncomeAndExpenseColumn[];
}

const TotalRow = (props: ITotalRow) => {
  //! State
  const { column } = props;
  const { values } = useFormikContext<{
    incomeAndExpenses: MoneyFlowResponse[];
  }>();

  const dataTotal = useMemo(() => {
    const total = cloneDeep(initvalueDefault);

    values.incomeAndExpenses.forEach((item) => {
      Object.entries(item).forEach(([key, value]) => {
        if (key === "content" || key === "id") return;
        const totalByKey = total[key as keyof typeof total];
        if (isString(totalByKey) || isString(value)) return;

        totalByKey.income += +removeAllDot(value.income);
        totalByKey.expense += +removeAllDot(value.expense);
      });
    });

    return total;
  }, [values.incomeAndExpenses]);

  const theme = useTheme();
  const [cellDetail, setCellDetail] = useState<{
    month: string;
    content: string;
    type: "income" | "expense";
  } | null>(null);

  //! Function
  const handleClick = (type: "income" | "expense", col: any) => {
    setCellDetail({
      month: col.id,
      content: "",
      type,
    });
  };

  const handleClose = () => {
    setCellDetail(null);
  };

  //! Render
  return (
    <Fragment>
      {cellDetail && (
        <CommonStyles.Dialog
          open={!!cellDetail}
          toggle={handleClose}
          maxWidth="lg"
          fullWidth
        >
          <EachCellDetail {...cellDetail} toggle={handleClose} />
        </CommonStyles.Dialog>
      )}
      <Box
        className="table-width row-grid"
        sx={{
          display: "grid",
          margin: "0 auto",
          borderRadius: "0 0 8x 8px",
          background: "#363636",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "sticky",
            background: "#363636",
            left: 0,
            zIndex: 1000,
            borderRadius: "0 0 8x 8px",
          }}
        >
          <Box
            className="content-row"
            sx={{
              width: "100%",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "0 0 8x 8px",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              padding: "15px 10px",
            }}
          >
            <CommonStyles.Typography type="bold16">
              Total
            </CommonStyles.Typography>
          </Box>
        </Box>

        {column.map((col: any, index: number) => {
          const rowData = dataTotal[col.id as keyof typeof dataTotal];
          if (isString(rowData)) return;

          const income = rowData.income;
          const expense = rowData.expense;

          return (
            <Fragment key={col.id + "Total" + index}>
              <Box
                sx={{
                  height: "100%",
                  width: col.shouldDisplay ? "100%" : "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: col.shouldDisplay ? 1 : 0,
                  transition: !col.shouldDisplay ? "none" : "all 0.3s",
                  overflow: "hidden",
                  padding: col.shouldDisplay ? "15px 10px" : "0",
                  cursor: income !== 0 ? "pointer" : "default",
                }}
              >
                <CommonStyles.Typography
                  type="bold16"
                  sx={{
                    "&:hover": {
                      color:
                        income !== 0 ? theme.palette.primary.main : "default",
                    },
                  }}
                  onClick={() => handleClick("income", col)}
                >
                  {income.toLocaleString("vi-VN")}
                </CommonStyles.Typography>
              </Box>
              <Box
                key={col.id + dataTotal.content}
                sx={{
                  height: "100%",
                  width: col.shouldDisplay ? "100%" : "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: col.shouldDisplay ? 1 : 0,
                  transition: !col.shouldDisplay ? "none" : "all 0.3s",
                  overflow: "hidden",
                  padding: col.shouldDisplay ? "15px 10px" : "0",
                  cursor: expense !== 0 ? "pointer" : "default",
                }}
              >
                <CommonStyles.Typography
                  type="bold16"
                  sx={{
                    "&:hover": {
                      color:
                        expense !== 0 ? theme.palette.primary.main : "default",
                    },
                  }}
                  onClick={() => handleClick("expense", col)}
                >
                  {expense.toLocaleString("vi-VN")}
                </CommonStyles.Typography>
              </Box>
            </Fragment>
          );
        })}
      </Box>
    </Fragment>
  );
};

export default memo(TotalRow);
