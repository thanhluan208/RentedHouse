import { Box, SxProps } from "@mui/material";
import { isArray, isEmpty } from "lodash";
import { Fragment, useMemo } from "react";
import CommonStyles from "..";
import PaginationButton from "./component/PaginationButton";
import { isDefined } from "../../../Helpers";
import CommonIcons from "../../CommonIcons";
import PerfectScrollbar from "react-perfect-scrollbar";
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
}

export type Column<T> = {
  id: string;
  label?: string;
  customRender?: (row: T, rowIndex: number) => JSX.Element;
  customerHeader?: () => JSX.Element;
  width?: number;
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
  } = props;
  const { page, pageSize } = filters || {};

  const gridTemplateColumns = useMemo(() => {
    if (!isArray(columns)) return "";
    return columns.reduce((acc, columns) => {
      return acc + `${columns.width ? columns?.width + "px " : "1fr "}`;
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
          borderRadius: '4px 4px 0 0 ',
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
      <PerfectScrollbar
        style={{
          minHeight: "480px",
          maxHeight: `${pageSize > 10 ? pageSize * 48 : 480}px`,
          ...styleBody,
        }}
      >
        {isEmpty(data) && <CommonStyles.Empty content="No house found!" />}

        {isArray(data) &&
          data.map((row, rowIndex) => {
            return (
              <Box
                onClick={() => props.onClickRow && props.onClickRow(row)}
                key={`row_${row?._id}`}
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
      </PerfectScrollbar>
      {shouldShowPagination && (
        <Box
          sx={{
            width: "100%",
            borderRadius: 1,
            height: "50px",
            background: "#fff",
            marginTop: "20px",
            position: "relative",
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
