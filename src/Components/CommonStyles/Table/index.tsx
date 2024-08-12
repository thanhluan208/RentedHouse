import { Box, SxProps } from "@mui/material";
import { isArray } from "lodash";
import {  useMemo } from "react";

type BaseRow = {
  id: string;
};

interface ITable<T extends BaseRow> {
  columns: Column<T>[];
  sxContainer?: SxProps;
  sxHeader?: SxProps;
  sxRow?: SxProps;
  data: T[];
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
  const { columns, sxContainer, sxHeader, data, sxRow } = props;
  const gridTemplateColumns = useMemo(() => {
    if (!isArray(columns)) return "";
    return columns.reduce((acc, columns) => {
      return acc + `${columns.width ? columns?.width + 'px ' : '1fr '}`;
    }, "");
  }, [columns]);

  //! Function

  //! Render
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
          borderRadius: 1,
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
      {isArray(data) &&
        data.map((row, rowIndex) => {
          return (
            <Box
              key={row.id || `row_${rowIndex}`}
              sx={{
                display: "grid",
                gridTemplateColumns: gridTemplateColumns,
                gap: 1,
                padding: 1,
                borderRadius: 1,
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
                  return column.customRender(row, rowIndex);
                }
                return (
                  <Box
                    sx={{ display: "flex", alignItems: "center", ...sxRow }}
                    key={`${row.id}_${column.id as string}`}
                  >
                    {row[column.id as keyof typeof row] as string}
                  </Box>
                );
              })}
            </Box>
          );
        })}
    </Box>
  );
};

export default Table;
