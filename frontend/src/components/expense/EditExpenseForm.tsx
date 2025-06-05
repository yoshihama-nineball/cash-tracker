import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { editExpense } from "../../../actions/edit-expense-action";
import { useMessage } from "../../../context/MessageContext";
import {
  DraftExpenseFormValues,
  DraftExpenseSchema,
  Expense,
} from "../../../libs/schemas/auth";
import Button from "../ui/Button/Button";

type ActionStateType = {
  errors: string[];
  success: string;
};

interface EditExpenseFormProps {
  expense: Expense | undefined;
  budgetId: string;
  open: "none" | "create" | "edit" | "delete";
  setOpen: (open: "none" | "create" | "edit" | "delete") => void;
}

const EditExpenseForm = ({
  expense,
  budgetId,
  open,
  setOpen,
}: EditExpenseFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { showMessage } = useMessage();
  const router = useRouter();

  const editExpenseWithIds = expense?.id
    ? (state: ActionStateType, payload: FormData) =>
        editExpense(budgetId, expense.id, state, payload)
    : undefined;

  const [formState, dispatch] = useActionState(
    editExpenseWithIds || (() => Promise.resolve({ errors: [], success: "" })),
    {
      errors: [],
      success: "",
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<DraftExpenseFormValues>({
    resolver: zodResolver(DraftExpenseSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (expense) {
      setValue("name", expense.name);
      setValue(
        "amount",
        typeof expense.amount === "string"
          ? parseInt(expense.amount, 10)
          : expense.amount,
      );
    }
  }, [expense, setValue]);

  useEffect(() => {
    if (formState.success && formState.success.trim() !== "") {
      setOpen("none");
      reset();
      showMessage(formState.success, "success");
    }
  }, [formState, reset, router, showMessage, setOpen]);

  useEffect(() => {
    if (formState.errors.length > 0) {
      showMessage(formState.errors[0], "error");
    }
  }, [formState.errors.length, formState.errors, showMessage]);

  const onSubmit = async (data: DraftExpenseFormValues) => {
    if (!expense?.id || !editExpenseWithIds) {
      console.error("expense or expenseId is missing");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("amount", data.amount.toString());

    startTransition(() => {
      dispatch(formData);
    });
  };

  const handleClose = () => {
    setOpen("none");
  };

  return (
    <>
      <Dialog
        open={open === "edit"}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: isMobile ? "90%" : "400px",
            minWidth: isMobile ? "300px" : "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          支出の編集
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            ref={ref}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 2,
            }}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormControl error={!!errors.name}>
              <FormLabel htmlFor="name">タイトル</FormLabel>
              <TextField
                id="name"
                type="name"
                placeholder="タイトルを入力"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                {...register("name")}
                sx={{ mt: 1 }}
              />
              {errors.name && (
                <FormHelperText>{errors.name.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl error={!!errors.amount}>
              <FormLabel htmlFor="amount">金額</FormLabel>
              <TextField
                id="amount"
                type="number"
                placeholder="金額"
                fullWidth
                variant="outlined"
                error={!!errors.amount}
                {...register("amount")}
                sx={{ mt: 1 }}
              />
              {errors.amount && (
                <FormHelperText>{errors.amount.message}</FormHelperText>
              )}
            </FormControl>
            <Button
              type="submit"
              sx={{
                mt: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
              disabled={isSubmitting || isPending}
            >
              {isSubmitting || isPending ? "送信中..." : "更新"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditExpenseForm;
