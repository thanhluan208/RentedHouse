import { useCallback, useEffect } from "react";
import { IncomeAndExpenseColumn } from "./type";
import { cloneDeep } from "lodash";
import { MoneyFlowResponse } from "@/Hooks/useGetHouseMoneyFlow";

const minWidthCell = 200;

const useCalculateTable = (
  columns: IncomeAndExpenseColumn[],
  data: MoneyFlowResponse[]
) => {
  const calculateTable = useCallback(() => {
    const activeCol =
      cloneDeep(columns).filter((col) => col.shouldDisplay).length - 1;

    const windowWidth = window.innerWidth;
    const maxWidthTable = windowWidth - 232 - 40;

    const widthCell = Math.max((maxWidthTable - 250) / activeCol, minWidthCell);

    const tableWidth = document.getElementsByClassName(
      "table-width"
    ) as unknown as HTMLElement[];
    if (tableWidth?.length > 0) {
      for (let i = 0; i < tableWidth.length; i++) {
        if (tableWidth[i]) {
          tableWidth[i].style.setProperty(
            "width",
            `${widthCell * activeCol + 253}px`
          );
        }
      }
    }

    const header = document.getElementById("header-grid");
    if (header) {
      let headerGrid = "250px ";

      columns.forEach((col, index) => {
        if (index === 0) return;
        if (col.shouldDisplay) {
          headerGrid += `${widthCell}px `;
        } else {
          headerGrid += `0px `;
        }
      });

      header?.style.setProperty("grid-template-columns", headerGrid);
    }

    const row = document.getElementsByClassName(
      "row-grid"
    ) as unknown as HTMLElement[];
    if (row?.length > 0) {
      let rowGrid = "250px ";

      columns.forEach((col, index) => {
        if (index === 0) return;
        if (!col.shouldDisplay) {
          rowGrid += `0px 0px `;
        } else {
          rowGrid += `${widthCell / 2}px ${widthCell / 2}px `;
        }
      });

      for (let i = 0; i < row.length; i++) {
        if (row[i]) {
          row[i].style.setProperty("grid-template-columns", rowGrid);
        }
      }
    }
  }, [columns, JSON.stringify(data)]);

  useEffect(() => {
    calculateTable();

    window.addEventListener("resize", calculateTable);

    return () => {
      window.removeEventListener("resize", calculateTable);
    };
  }, [calculateTable]);
};

export default useCalculateTable;
