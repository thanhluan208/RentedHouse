import { Box, ClickAwayListener, Fade, Popper } from "@mui/material";
import { IncomeAndExpenseColumn } from "../type";
import { useEffect, useState } from "react";
import CommonStyles from "@/Components/CommonStyles";
import CommonIcons from "@/Components/CommonIcons";
import { capitalize } from "lodash";

interface EditColumnButtonProps {
  setColumn: React.Dispatch<React.SetStateAction<IncomeAndExpenseColumn[]>>;
  column: IncomeAndExpenseColumn[];
}
const EditColumnButton = (props: EditColumnButtonProps) => {
  //! State
  const { setColumn, column } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  //! Function
  useEffect(() => {
    localStorage.setItem("column", JSON.stringify(column));
  },[column])

  //! Render
  const open = Boolean(anchorEl);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setAnchorEl(null);
      }}
    >
      <Box>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  background: "#fff",
                  marginTop: "12px ",
                  flexDirection: "column",
                }}
              >
                {column.map((col, index) => {
                  return (
                    <CommonStyles.Button
                      key={col.id + 'button'}
                      disabled={index === 0}
                      sx={{
                        display: "grid",
                        gap: "12px",
                        alignItems: "center",
                        gridTemplateColumns: "auto 1fr",
                        color: col.shouldDisplay ? "#000" : "#b0b0b0",
                      }}
                      onClick={() => {
                        setColumn((prev) => {
                          return prev.map((item) => {
                            if (item.id === col.id) {
                              return {
                                ...item,
                                shouldDisplay: !item.shouldDisplay,
                              };
                            }
                            return item;
                          });
                        });
                      }}
                    >
                      {col.shouldDisplay ? (
                        <CommonIcons.Check />
                      ) : (
                        <Box sx={{ width: "24px" }} />
                      )}
                      <CommonStyles.Typography type="bold16" textAlign="left">
                        {capitalize(col.id)}
                      </CommonStyles.Typography>
                    </CommonStyles.Button>
                  );
                })}
              </Box>
            </Fade>
          )}
        </Popper>
        <CommonStyles.Button
          variant="outlined"
          startIcon={<CommonIcons.ViewColumn />}
          onClick={(e) => {
            setAnchorEl(anchorEl ? null : e.currentTarget);
          }}
        >
          Columns
        </CommonStyles.Button>
      </Box>
    </ClickAwayListener>
  );
};

export default EditColumnButton;
