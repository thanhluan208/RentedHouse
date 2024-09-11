import { monthTextToNum } from "@/Helpers";
import { MoneyFlowResponse } from "@/Hooks/useGetHouseMoneyFlow";
import { useGet } from "@/Stores/useStore";
import { Box } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { capitalize, isString } from "lodash";
import { useMemo } from "react";

interface IChart {
  data: MoneyFlowResponse[];
}

const Chart = (props: IChart) => {
  //! State
  const { data } = props;
  const sideBarOpen = useGet("OPEN_SIDEBAR")

  const optionsProps = useMemo(() => {
    const returnSeries: {
      name: string;
      data: number[];
      color?: string;
    }[] = [
      {
        name: "Profit",
        data: Array.from({ length: 12 }).fill(0) as number[],
      },
    ];

    const categories: string[] = [];

    data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        if (isString(value)) return;
        if (index === 0) {
          categories.push(capitalize(key));
        }
        const profit = +value.income - +value.expense;
        returnSeries[0].data[monthTextToNum(capitalize(key)) - 1] += profit;
      });
      categories.push(item.content);
    });

    return {
      series: returnSeries.map((item) => {
        return {
          ...item,
          data: item.data.map((value) => {
            return {
              y: value,
              color: value > 0 ? "#9effb8" : "#ff9e9e",
            };
          }),
        };
      }),
      categories,
    };
  }, [data]);

  const options = {
    chart: {
      type: "column",
      width: sideBarOpen ? window.innerWidth - 232 - 40 : window.innerWidth - 40,
    },
    title: {
      text: "Profit and Loss",
    },
    xAxis: {
      categories: optionsProps.categories,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      column: {
        borderRadius: "8px",
      },
    },
    series: optionsProps.series,
  };

  //! Function

  //! Render
  return (
    <Box
      sx={{
        flex: 1,
        
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};

export default Chart;
