"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";
import { useEffect, useTransition } from "react";
import { deleteBudget } from "../../../actions/delete-budget-actions";
import { useMessage } from "../../../context/MessageContext";
import Button from "../ui/Button/Button";

interface DeleteDialogProps {
  isMobile: boolean;
  budgetId: string;
  budgetName: string;
}

type ActionStateType = {
  errors: string[];
  success: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteDialog = ({
  isMobile,
  budgetId,
  budgetName,
}: DeleteDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = useTransition();
  const { showMessage } = useMessage();

  // deleteBudget関数をbudgetIdでバインド
  const deleteBudgetWithId = deleteBudget.bind(null, budgetId) as unknown as (
    state: ActionStateType,
    payload: FormData,
  ) => Promise<ActionStateType>;

  const [formState, dispatch] = React.useActionState(deleteBudgetWithId, {
    errors: [],
    success: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);

    startTransition(() => {
      const formData = new FormData();
      dispatch(formData);

      setTimeout(() => {
        if (formState.errors.length > 0) {
          showMessage(formState.errors[0], "error");
        }
      }, 2000);
    });
  };

  // 成功時の処理
  useEffect(() => {
    if (formState.success) {
      setOpen(false);
      showMessage(formState.success, "success");
    }
  }, [formState.success, showMessage]);

  // エラー時の処理
  useEffect(() => {
    if (formState.errors.length > 0) {
      showMessage(formState.errors[0], "error");
    }
  }, [formState.errors, showMessage]);

  return (
    <React.Fragment>
      <Button
        startIcon={<DeleteIcon />}
        color="error"
        size="small"
        sx={{
          minWidth: isMobile ? "40px" : "80px",
          whiteSpace: "nowrap",
        }}
        onClick={handleClickOpen}
      >
        削除
      </Button>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: isMobile ? "90%" : "400px",
            minWidth: isMobile ? "300px" : "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {`「${budgetName}」を削除しますか？`}
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ py: 2, fontSize: "1rem" }}
          >
            予算は完全に削除されます
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ pb: 2, px: 2 }}>
          <Button onClick={handleClose} color="neutral" disabled={isPending}>
            キャンセル
          </Button>

          <Button onClick={handleDelete} color="error" disabled={isPending}>
            {isPending ? "削除中..." : "削除"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteDialog;
