import CommonIcons from "@/Components/CommonIcons";
import CommonStyles from "@/Components/CommonStyles";
import { Column } from "@/Components/CommonStyles/Table";
import { monthTextToNum } from "@/Helpers";
import useGetListBill, { BillResponse } from "@/Hooks/useGetBill";
import { useGet } from "@/Stores/useStore";
import { Box, DialogContent, DialogTitle } from "@mui/material";
import { capitalize, cloneDeep, isEmpty } from "lodash";
import moment, { Moment } from "moment";
import { useMemo } from "react";
import { Fragment } from "react/jsx-runtime";

interface IEachCellDetail {
  month: string;
  content: string;
  type: "income" | "expense";
  toggle: () => void;
}
const EachCellDetail = (props: IEachCellDetail) => {
  //! State
  const { month, content, type, toggle } = props;
  const year: Moment = useGet("YEAR");

  const payload = useMemo(() => {
    const payDate = year.set("month", monthTextToNum(capitalize(month)) - 1);

    return {
      payDate: payDate.startOf("month").toDate(),
      isExpense: type === "expense",
      page: 0,
      pageSize: 20,
    };
  }, [year, month]);

  const { data, isLoading } = useGetListBill(payload);

  const filterData: Omit<BillResponse, "contents">[] = useMemo(() => {
    if (isEmpty(data)) return [];

    return cloneDeep(data)
      .map((item) => {
        return {
          ...item,
          contents: item.contents.find((elm) => elm.name === content),
        };
      })
      .filter((item) => item.contents)
      .sort((a, b) => {
        return a.room.name.localeCompare(b.room.name);
      });
  }, [data]);

  //! Function

  //! Render
  const columns: Column<Omit<BillResponse, "contents">>[] = useMemo(() => {
    return [
      {
        id: "id",
        label: "STT",
        width: 50,
        customRender: (_, rowIndex: number) => {
          return (
            <CommonStyles.Typography type="bold14">
              {rowIndex + 1}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "guest",
        label: "Guest",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row.guest.name}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "room",
        label: "Room",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row.room.name}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "payDate",
        label: "Pay Date",
        customRender: (row) => {
          return (
            <CommonStyles.Typography type="bold14">
              {moment(row.payDate).format("DD/MM/YYYY")}
            </CommonStyles.Typography>
          );
        },
      },
      {
        id: "price",
        label: "Price",
        customRender: (row: any) => {
          return (
            <CommonStyles.Typography type="bold14">
              {row.contents.price.toLocaleString()}
            </CommonStyles.Typography>
          );
        },
      },
    ];
  }, []);

  return (
    <Fragment>
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CommonStyles.Typography type="bold24">
            {content} - {monthTextToNum(capitalize(month))}/
            {year.format("YYYY")}
          </CommonStyles.Typography>
          <CommonStyles.Button
            isIcon
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
          >
            <CommonIcons.Close />
          </CommonStyles.Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <CommonStyles.Table data={filterData} columns={columns} />
      </DialogContent>
    </Fragment>
  );
};

export default EachCellDetail;
