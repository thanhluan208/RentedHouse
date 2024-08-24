import { Box, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import useGetGuestDetail from "../../Hooks/useGetGuestDetail";
import CommonStyles from "../../Components/CommonStyles";
import HouseInfo from "../Home/components/HouseInfo";
import { formatDate } from "../../Helpers";
import moment from "moment";
import CommonIcons from "../../Components/CommonIcons";
import { useSave } from "../../Stores/useStore";
import { useEffect } from "react";
import cachedKeys from "../../Constants/cachedKeys";
import AddGuestButton from "../Guest/components/AddGuestButton";
import { capitalize } from "lodash";
import { toast } from "react-toastify";
import GuestService from "../../Services/Guest.service";

const GuestDetail = () => {
  //! State
  const params = useParams();
  const save = useSave();
  const { guestId } = params;
  const { data, isLoading, refetch } = useGetGuestDetail(
    guestId as string,
    !!guestId
  );

  //! Function
  const downloadContract = async () => {
    if (!guestId) return;
    const toastId = toast.loading("Downloading contract ...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      const res = await GuestService.downloadContract(guestId as string);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contract.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.update(toastId, {
        render: "Downloaded contract successfully",
        type: toast.TYPE.SUCCESS,
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to download contract",
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  //! Effect
  useEffect(() => {
    save(cachedKeys.REFETCH_GUEST_DETAIL, refetch);
  }, [refetch, save]);

  //! Render
  if (!data) {
    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        <CommonStyles.LoadingOverlay isLoading={isLoading} />
      </Box>
    );
  }

  if (!data?.name && !isLoading) {
    return (
      <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
        <CommonStyles.Empty content="Guest not found !" />
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", height: "100%", marginBottom: "40px" }}>
      <CommonStyles.LoadingOverlay isLoading={isLoading} />
      <Box
        sx={{
          margin: "0 25px",
          padding: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <CommonStyles.Typography type="bold24">
            {data?.name}
          </CommonStyles.Typography>
          <CommonStyles.Chip
            label={data?.room ? "Renting" : "Not renting"}
            sx={{
              backgroundColor: data?.room ? "#e8faf3" : "#fde8e8",
              color: data?.room ? "#2dd298" : "#f44336",
              padding: "5px 10px",
              borderRadius: "8px",
              margin: "10px 0",
            }}
          />
        </Box>
        <Box>
          <AddGuestButton
            refetchKey={cachedKeys.REFETCH_GUEST_DETAIL}
            buttonProps={{
              content: "Edit profile",
            }}
            guestData={data}
          />
        </Box>
      </Box>

      <Box
        sx={{
          padding: "0 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            background: "#fff",
            borderRadius: "8px",
            border: "solid 1px #ccc",
          }}
        >
          <CommonStyles.Typography type="bold18" sx={{ padding: "10px 20px" }}>
            General information
          </CommonStyles.Typography>
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: "30px",
              padding: "0px 20px",
            }}
          >
            <HouseInfo
              label="Date of birth"
              value={
                moment(data.dob).format("Do MMM YYYY") ||
                moment().format("Do MMM YYYY")
              }
            />
            <HouseInfo label="Gender" value={capitalize(data?.gender) || "-"} />
            <HouseInfo
              label="Phone"
              value={data?.phone ? data.phone + "" : "-"}
            />
            <HouseInfo
              label="Adress"
              value={`${data?.address || ""} ${data?.commune?.label || ""} ${
                data?.district?.label || ""
              } ${data?.city?.label || "-"}`}
            />
            <HouseInfo
              label="Created At"
              value={formatDate(data?.createdAt) || "-"}
            />
          </Box>
          <Box
            sx={{
              padding: "0px 20px 10px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              mt: "20px",
            }}
          >
            <CommonStyles.Typography type="bold14" sx={{ color: "#777575" }}>
              Citizen ID:
            </CommonStyles.Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "0 10px",
              }}
            >
              {data?.citizenIdFront ? (
                <img
                  src={(data?.citizenIdFront as string) || ""}
                  alt="citizenIdFront"
                  width="100%"
                  style={{ borderRadius: "8px", maxWidth: "400px" }}
                />
              ) : (
                <Box></Box>
              )}
              {data?.citizenIdBack ? (
                <img
                  src={(data?.citizenIdBack as string) || ""}
                  alt="citizenIdBack"
                  width="100%"
                  style={{ borderRadius: "8px", maxWidth: "400px" }}
                />
              ) : (
                <Box></Box>
              )}
            </Box>
            <CommonStyles.Typography type="bold14" sx={{ color: "#777575" }}>
              Contract:
              <CommonStyles.Button
                isIcon
                sx={{ color: "#000" }}
                onClick={downloadContract}
              >
                <CommonIcons.Download />
              </CommonStyles.Button>
            </CommonStyles.Typography>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              {data.contract?.map((file, index) => {
                return (
                  <Tooltip title={file} key={`${file}_${index}`}>
                    <div>
                      <CommonStyles.Chip
                        sx={{
                          maxWidth: "300px",
                          textTransform: "none !important",
                          svg: {
                            margin: "0 !important",
                            width: "22px !important",
                            height: "22px !important",
                          },
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(file as string, "_blank");
                        }}
                        label={file as string}
                      />
                    </div>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GuestDetail;
