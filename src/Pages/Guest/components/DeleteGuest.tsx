import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import ConfirmDialog from "../../../Components/CommonStyles/ConfirmDialog";
import { toast } from "react-toastify";
import CommonIcons from "../../../Components/CommonIcons";
import { useGet } from "../../../Stores/useStore";

import { GuestDetail } from "../../../Hooks/useGetGuestDetail";
import GuestService from "../../../Services/Guest.service";

interface IDeleteGuest {
    data: GuestDetail;
}

function DeleteGuest(props: IDeleteGuest) {
    //! State
    const { data } = props;
    const { open, shouldRender, toggle } = useToggleDialog();
    const refetchListGuest = useGet("REFETCH_GUEST_LIST");

    //! Function
    const handleDelete = async () => {
        if (!data?._id) return;

        const toastId = toast.loading(
            `Deleting ${data.name}...`,
            {
                isLoading: true,
                autoClose: false,
            }
        );

        try {

            await GuestService.deleteGuest(data._id)

            await refetchListGuest();

            toast.update(toastId, {
                render: `Remove ${data.name} successfully`,
                type: "success",
                autoClose: 3000,
                isLoading: false,
            });

            toggle();
        } catch (error: any) {
            console.log("error", error);
            toast.update(toastId, {
                render: `Remove ${data.name} failed: ` + error.message,
                type: "error",
                autoClose: 3000,
                isLoading: false,
            });
        }
    };

    //! Render
    return (
        <Fragment>
            {shouldRender && (
                <CommonStyles.Dialog
                    open={open}
                    toggle={toggle}
                    maxWidth="sm"
                    fullWidth
                    disableClickOutside
                >
                    <ConfirmDialog
                        handleConfirm={handleDelete}
                        content={`Confirm delete ${data.name} ?`}
                        toggle={toggle}
                    />
                </CommonStyles.Dialog>
            )}

            <CommonStyles.Button
                fullWidth
                startIcon={<CommonIcons.Delete />}
                onClick={(event) => {
                    event.stopPropagation();
                    toggle();
                }}
                color="error"
                isIcon
            >
                <CommonIcons.Delete />
            </CommonStyles.Button>
        </Fragment>
    );
}

export default DeleteGuest;
