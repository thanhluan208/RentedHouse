import CommonField from "@/Components/CommonFields";
import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { useGet } from "@/Stores/useStore";
import { Box } from "@mui/system";
import { FastField } from "formik";
import { isString } from "lodash";
import { Fragment, useId } from "react";

interface IEachRow {
  row: any;
  column: any;
  borderRadius?: string;
  name: string;
  handleRemoveRow: () => void;
}

const EachRow = (props: IEachRow) => {
  //! State
  const { row, column, borderRadius, name, handleRemoveRow } = props;
  const isEditing = useGet("IS_EDITING_INCOME_EXPENSE");
  const id = useId()

  //! Function

  //! Render
  return (
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
          {isEditing ? (
            <Fragment>
              <CommonStyles.Button
                sx={{ marginRight: "12px", borderRadius: "8px" }}
                color="error"
                isIcon
                onClick={handleRemoveRow}
              >
                <CommonIcons.Delete />
              </CommonStyles.Button>
              <FastField
                name={`${name}.content`}
                component={CommonField.InputField}
                placeholder="Nhập nội dung"
              />
            </Fragment>
          ) : (
            <CommonStyles.Typography type="bold16">
              {row.content}
            </CommonStyles.Typography>
          )}
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
              }}
            >
              {isEditing ? (
                <FastField
                  name={`${name}.${col.id}.income`}
                  component={CommonField.InputField}
                  isPrice
                />
              ) : (
                <CommonStyles.Typography type="bold16">
                  {income.toLocaleString("vi-VN")}
                </CommonStyles.Typography>
              )}
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
              }}
            >
              {isEditing ? (
                <FastField
                  name={`${name}.${col.id}.expense`}
                  component={CommonField.InputField}
                  isPrice
                />
              ) : (
                <CommonStyles.Typography type="bold16">
                  {expense.toLocaleString("vi-VN")}
                </CommonStyles.Typography>
              )}
            </Box>
          </Fragment>
        );
      })}
    </Box>
  );
};

export default EachRow;
