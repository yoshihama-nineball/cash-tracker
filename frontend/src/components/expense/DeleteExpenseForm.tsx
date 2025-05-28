import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
// import { useMessage } from "context/MessageContext";
import { DraftExpenseFormValues, DraftExpenseSchema } from "libs/schemas/auth";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button/Button";

// type ActionStateType = {
//   errors: string[];
//   success: string;
// };

interface DeleteExpenseFormProps {
  budgetId: number;
  expenseName: string;
  open: "none" | "create" | "edit" | "delete";
  setOpen: (open: "none" | "create" | "edit" | "delete") => void;
}

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement;
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
const DeleteExpenseForm = ({
  // budgetId,
  expenseName,
  open,
  setOpen,
}: DeleteExpenseFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const ref = useRef<HTMLFormElement>(null);
  const [isPending] = useTransition();
  // const { showMessage } = useMessage();

  // const deleteExpenseWithBudgetId = deleteExpense.bind(null, budgetId) as (
  //   state: ActionStateType,
  //   payload: FormData,
  // ) => Promise<ActionStateType>;

  // const [formState, dispatch] = useActionState(deleteExpenseWithBudgetId, {
  //   errors: [],
  //   success: "",
  // });

  const {
    // register,
    // handleSubmit,
    // formState: { errors, isSubmitting },
    // reset,
    // setValue,
  } = useForm<DraftExpenseFormValues>({
    resolver: zodResolver(DraftExpenseSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  const handleDelete = () => {
    setOpen("none");
    // const successMessage = `${expenseName}を削除しました`;

    // const messageId = showMessage(successMessage, "success");

    // startTransition(() => {
    //   const formData = new FormData();
    //   // dispatch(formData);

    //   setTimeout(() => {
    //     if(useFormState.errors.length > 0) {
    //       clearMessage(messageId);
    //       showMessage(useFormState.errors[0], "error")
    //     }
    //   }, 2000);
    // });
  };

  // useEffect(() => {
  //   if (useFormState.success) {
  //     setOpen("none");
  //     showMessage(useFormState.success, "success")
  //   }
  // }, [useFormState.success, showMessage]);

  // useEffect(() => {
  //   if (formState.errors.length > 0) {
  //     showMessage(formState.errors[0], "error");
  //   }
  // }, [formState.errors, showMessage]);

  const handleClose = () => {
    setOpen("none");
  };

  return (
    <>
      <Dialog
        open={open === "delete"}
        onClose={handleClose}
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
