import { useCallback, useEffect, useState } from "react";
import { useSave } from "../Stores/useStore";
import cachedKeys from "../Constants/cachedKeys";

const useToggleDialog = () => {
  //! State
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const save = useSave();

  //! Function
  const toggle = useCallback(() => {
    setOpen((prev) => {
      return !prev;
    });
    setTimeout(() => {
      setClose((prev) => !prev);
    }, 500);
  }, []);

  const shouldRender = open || close;

  const setStateDialog = useCallback((status: boolean) => {
    setOpen(status);
    setTimeout(() => {
      setClose(status);
    }, 500);
  }, []);

  useEffect(() => {
    save(cachedKeys.DIALOG_OPEN, open);

    return () => {
      save(cachedKeys.DIALOG_OPEN, false);
    };
  }, [open]);

  return { open, toggle, shouldRender, setStateDialog };
};

export default useToggleDialog;
