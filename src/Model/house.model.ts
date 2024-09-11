import { removeAllDot } from "@/Helpers";
import { MoneyFlowResponse } from "@/Hooks/useGetHouseMoneyFlow";

class houseModel {
  parsedPayloadAddRoom(
    houseId: string,
    values: {
      incomeAndExpenses: MoneyFlowResponse[];
    },
    year: string
  ) {
    const newData = values.incomeAndExpenses.map((item) => {
      const newItem: any = {
        content: item.content,
        year
      };

      Object.entries(item).forEach(([key, value]) => {
        console.log('key', key, value);
        if (key === "content" || key === "id" || key === "year") return;
        newItem[key] = {
          income: removeAllDot(value.income)
            ? Number(removeAllDot(value.income))
            : 0,
          expense: removeAllDot(value.expense)
            ? Number(removeAllDot(value.expense))
            : 0,
        };
      });
      
      return newItem;
    });


    return {
        houseId,
        data: newData,
    }
  }
}

const HouseModel = new houseModel();
export default HouseModel;
