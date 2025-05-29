import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMessage } from "context/MessageContext";
import { forwardRef, useActionState, useEffect, useTransition } from "react";
import { deleteExpense } from "../../../actions/delete-expense-action";
import Button from "../ui/Button/Button";

type ActionStateType = {
  errors: string[];
  success: string;
};

interface DeleteExpenseFormProps {
  budgetId: number;
  expenseId: string;
  expenseName: string;
  open: "none" | "create" | "edit" | "delete";
  setOpen: (open: "none" | "create" | "edit" | "delete") => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const DeleteExpenseForm = ({
  budgetId,
  expenseId,
  expenseName,
  open,
  setOpen,
}: DeleteExpenseFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isPending, startTransition] = useTransition();
  const { showMessage } = useMessage();

  const deleteExpenseWithId = deleteExpense.bind(
    null,
    budgetId.toString(),
    expenseId,
  ) as (state: ActionStateType, payload: FormData) => Promise<ActionStateType>;

  const [formState, dispatch] = useActionState(deleteExpenseWithId, {
    errors: [],
    success: "",
  });

  const handleDelete = () => {
    setOpen("none");
    startTransition(() => {
      const formData = new FormData();
      dispatch(formData);
    });
  };

  useEffect(() => {
    if (formState.success) {
      setOpen("none");
      showMessage(formState.success, "success");
    }
  }, [formState.success, showMessage, setOpen]);

  useEffect(() => {
    if (formState.errors.length > 0) {
      showMessage(formState.errors[0], "error");
    }
  }, [formState.errors, showMessage]);

  const handleClose = () => {
    setOpen("none");
  };

  return (
    <>
      <Dialog
        open={open === "delete"}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: isMobile ? "90%" : "400px",
            minWidth: isMobile ? "300px" : "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {`${expenseName}を削除しますか？`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            sx={{ py: 2, fontSize: "1rem" }}
          >
            支出は完全に削除されます
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ bp: 2, px: 2 }}>
          <Button onClick={handleClose} color="neutral" disabled={isPending}>
            キャンセル
          </Button>
          <Button onClick={handleDelete} color="error" disabled={isPending}>
            {isPending ? "削除中..." : "削除"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteExpenseForm;
