import { Box } from "@mui/material";
import RoomSelect from "./RoomSelect";
import HouseSelect from "./HouseSelect";
import GuestSelect from "./GuestSelect";
import StatusSelect from "./StatusSelect";
import DatePickerCommon from "../../../Components/CommonStyles/DatePicker";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";

interface IFilterBill {
  filters: any;
  setFilter: any;
  resetFilter?: any;
}

const FilterBill = (props: IFilterBill) => {
  //! State
  const { filters, setFilter, resetFilter } = props;

  //! Function

  //! Render
  return (
    <Box
      sx={{
        borderRadius: 1,
        backgroundColor: "#fff",
        padding: "10px 20px",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "80% 20%",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            columnGap: "20px",
            flexWrap: "wrap",
          }}
        >
          <HouseSelect
            setFilters={setFilter}
            room={filters?.room}
            filters={filters}
          />
          <RoomSelect
            setFilters={setFilter}
            house={filters?.house}
            guest={filters?.guest}
            filters={filters}
          />
          <GuestSelect
            setFilters={setFilter}
            room={filters?.room}
            house={filters?.house}
            filters={filters}
          />
          <StatusSelect setFilters={setFilter} filters={filters} />
        </Box>
        <Box
          sx={{
            display: "flex",
            columnGap: "20px",
            flexWrap: "wrap",
          }}
        >
          <DatePickerCommon
            value={filters?.startDate}
            label="Start Date"
            handleChange={(value) => {
              setFilter({ ...filters, startDate: value });
            }}
          />
          <DatePickerCommon
            value={filters?.endDate}
            label="End Date"
            handleChange={(value) => {
              setFilter({ ...filters, endDate: value });
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "end",
        }}
      >
        <CommonStyles.Button
          variant="outlined"
          startIcon={<CommonIcons.Refresh />}
          onClick={resetFilter}
        >
          Clear
        </CommonStyles.Button>
      </Box>
    </Box>
  );
};

export default FilterBill;
