import CommonStyles from "@/Components/CommonStyles";
import { useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { isString } from "lodash";
import { Fragment, useId, useState } from "react";
import EachCellDetail from "./EachCellDetail";

interface IEachRow {
  row: any;
  column: any;
  borderRadius?: string;
  name: string;
}

const EachRow = (props: IEachRow) => {
  //! State
  const { row, column, borderRadius } = props;
  const id = useId();
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
      content: row.content,
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
          <EachCellDetail {...cellDetail} toggle={handleClose}/>
        </CommonStyles.Dialog>
      )}
      <Box
        className="table-width row-grid"
        sx={{
          display: "grid",
          margin: "0 auto",
          borderRadius: borderRadius,
          background: "#fff",
          "&:hover": {
            background: "#a0caff54",
            "& .content-row": {
              background: "#a0caff54",
            },
          },
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
            left: 0,
            zIndex: 1000,
            background: "#fff",
            borderRadius: borderRadius,
            "&:before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "#e5ebf9",
              zIndex: -1,
            },
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
              borderRadius: borderRadius,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              background: "#fff",
              padding: "15px 10px",
            }}
          >
            <CommonStyles.Typography type="bold16">
              {row.content}
            </CommonStyles.Typography>
          </Box>
        </Box>

        {column.map((col: any, index: number) => {
          const rowData = row[col.id as keyof typeof row];
          if (isString(rowData)) return;

          const income = rowData.income;
          const expense = rowData.expense;

          return (
            <Fragment key={col.id + id + index}>
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
                key={col.id + row.content}
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

export default EachRow;
