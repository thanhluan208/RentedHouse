import { Box, SxProps } from "@mui/material";
import { isArray, isEmpty, isString } from "lodash";
import { Fragment, useMemo } from "react";
import CommonStyles from "..";
import PaginationButton from "./component/PaginationButton";
import { isDefined } from "../../../Helpers";
import CommonIcons from "../../CommonIcons";
import { pageSizeOption } from "../../../Constants/options";

export type BaseRow = {
  _id?: string;
  [key: string]: any;
};

interface ITable<T> {
  columns: Column<T>[];
  sxContainer?: SxProps;
  sxHeader?: SxProps;
  sxRow?: SxProps;
  data: T[];
  onClickRow?: (row: T) => void;
  filters?: any;
  total?: number;
  changePage?: (page: number) => void;
  changePageSize?: (pageSize: number) => void;
  styleBody?: any;
  width?: number | string;
}

export type Column<T> = {
  id: string;
  label?: string;
  customRender?: (row: T, rowIndex: number) => JSX.Element;
  customerHeader?: () => JSX.Element;
  width?: number | number;
};

const Table = <T extends BaseRow>(props: ITable<T>) => {
  //! State
  const {
    columns,
    sxContainer,
    sxHeader,
    data,
    sxRow,
    filters,
    total,
    styleBody,
    width,
  } = props;
  const { page, pageSize } = filters || {};

  const gridTemplateColumns = useMemo(() => {
    if (!isArray(columns)) return "";
    return columns.reduce((acc, columns) => {
      console.log("columns", columns);
      return (
        acc +
        `${
          columns.width
            ? isString(columns.width)
              ? columns.width
              : columns?.width + "px "
            : "1fr "
        }`
      );
    }, "");
  }, [columns]);

  const shouldShowPagination = useMemo(() => {
    if (!isDefined(isDefined) || !isDefined(pageSize) || !total) return false;
    return true;
  }, [data, pageSize]);
  //! Function
  const generatePageNumbers = (
    page: number,
    pageSize: number,
    totalRecord: number
  ) => {
    if (Math.ceil(totalRecord / pageSize) > 5) {
      if (page < 3 || page > Math.ceil(totalRecord / pageSize) - 2) {
        return [
          1,
          2,
          "...",
          Math.ceil(totalRecord / pageSize) - 1,
          Math.ceil(totalRecord / pageSize),
        ];
      } else {
        return [
          1,
          "...",
          page - 1,
          page,
          page + 1,
          "...",
          Math.ceil(totalRecord / pageSize),
        ];
      }
    } else {
      return Array.from(
        { length: Math.ceil(totalRecord / pageSize) },
        (_, i) => i + 1
      );
    }
  };

  //! Render
  const listpagination = generatePageNumbers(page, pageSize, total || 0);
  return (
    <Box
      sx={{
        maxWidth: "100%",
        overflowX: "auto",
        ...sxContainer,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: gridTemplateColumns,
          gap: 1,
          padding: 1,
          backgroundColor: "white",
          borderRadius: "4px 4px 0 0 ",
          width: width ?? "auto",
          position: "sticky", 
          top: 0,
          zIndex: 10,
        }}
      >
        {isArray(columns) &&
          columns.map((column) => {
            if (column.customerHeader) {
              return column.customerHeader();
            }
            return (
              <Box
                key={column.id as string}
                sx={{ fontWeight: "bold", alignItems: "center", ...sxHeader }}
              >
                {column.label}
              </Box>
            );
          })}
      </Box>
      <Box
        sx={{
          minHeight: "480px",
          maxHeight: `${pageSize > 10 ? pageSize * 48 : 480}px`,
          position: "relative",
          ...styleBody,
        }}
      >
        {isEmpty(data) && <CommonStyles.Empty content="No data found!" />}

        {isArray(data) &&
          data.map((row, rowIndex) => {
            return (
              <Box
                onClick={() => props.onClickRow && props.onClickRow(row)}
                key={`row_${row?._id || row?.id || rowIndex}`}
                sx={{
                  display: "grid",
                  alignItems: "center",
                  gridTemplateColumns: gridTemplateColumns,
                  gap: 1,
                  padding: 1,
                  backgroundColor: rowIndex % 2 === 0 ? "#f9f9f9" : "white",
                  transition: "all 0.3s",
                  "&:hover": {
                    backgroundColor: "#e4e4e4",
                    cursor: "pointer",
                  },
                  width: width ?? "auto",
                }}
              >
                {columns.map((column) => {
                  if (column.customRender) {
                    return (
                      <Fragment key={`${row._id}_${column.id as string}`}>
                        {column.customRender(row, rowIndex)}
                      </Fragment>
                    );
                  }
                  return (
                    <Box
                      sx={{ display: "flex", alignItems: "center", ...sxRow }}
                      key={`${row._id}_${column.id as string}`}
                    >
                      {row[column.id as keyof typeof row] as string}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
      </Box>
      {shouldShowPagination && (
        <Box
          sx={{
            width: "100%",
            position: "sticky",
            bottom: 0,
            left: 0,
            borderRadius: 1,
            height: "50px",
            background: "#fff",
            marginTop: "20px",
            boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              height: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CommonStyles.Typography type="bold14">
              Page: {page + 1}
            </CommonStyles.Typography>
            <Box sx={{ display: "flex" }}>
              <PaginationButton
                content={<CommonIcons.ChevronLeft />}
                disabled={!total || page === 0}
                onClick={() => {
                  props.changePage && props.changePage(page - 1);
                }}
              />
              {listpagination.map((item, index) => {
                return (
                  <PaginationButton
                    key={`page_${index}_${item}`}
                    content={item}
                    isActive={item === page + 1}
                    onClick={() => {
                      if (item === "...") return;
                      props.changePage && props.changePage(+item - 1);
                    }}
                  />
                );
              })}
              <PaginationButton
                content={<CommonIcons.ChevronRight />}
                disabled={!total || page === Math.ceil(total / pageSize) - 1}
                onClick={() => {
                  props.changePage && props.changePage(page + 1);
                }}
              />
            </Box>
            <CommonStyles.CommonSelect
              options={pageSizeOption}
              value={pageSize}
              handleChange={(value) => {
                props.changePageSize && props.changePageSize(value as number);
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Table;
