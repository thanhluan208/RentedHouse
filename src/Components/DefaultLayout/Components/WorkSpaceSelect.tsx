import { FastField, useFormikContext } from "formik";
import CommonField from "../../CommonFields";
import { WorkSpaceOption, workSpaceOptions } from "../../../Constants/options";
import { Box, MenuItem, SelectChangeEvent } from "@mui/material";
import CommonStyles from "../../CommonStyles";

interface IWorkSpaceSelect {}

function WorkSpaceSelect(props: IWorkSpaceSelect) {
  //! State
  const {} = props;
  const { setFieldValue } = useFormikContext();

  //! Function
  const renderOption = (option: WorkSpaceOption) => {
    return (
      <MenuItem value={JSON.stringify(option)} key={option.value}>
        <img
          loading="lazy"
          width="20"
          style={{ borderRadius: "12px" }}
          src={`${option.avatar}`}
          alt=""
        />
        <CommonStyles.Typography type="bold14" mx={2}>
          {option.label}
        </CommonStyles.Typography>
        {option.type === "team" && <CommonStyles.Chip label="Team" />}
      </MenuItem>
    );
  };

  const customRenderValue = (value: WorkSpaceOption) => {
    return (
      <Box display={"flex"} alignItems={"center"}>
        <img
          loading="lazy"
          width="20"
          height="20"
          style={{ borderRadius: "12px" }}
          src={`${value.avatar}`}
          alt=""
        />
        <CommonStyles.Typography type="bold14" mx={2}>
          {value.label}
        </CommonStyles.Typography>
      </Box>
    );
  };

  const onChangeCustomize = (event: SelectChangeEvent<string>) => {
    setFieldValue("workspace", JSON.parse(event?.target?.value));
  };

  //! Render
  return (
    <FastField
      name="workspace"
      component={CommonField.MuiSelectField}
      fullWidth
      options={workSpaceOptions}
      renderOption={renderOption}
      onChangeCustomize={onChangeCustomize}
      label="Workspace"
      required
      customRenderValue={customRenderValue}
    />
  );
}

export default WorkSpaceSelect;
