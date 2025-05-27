import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import {
  DraftExpenseFormValues,
  DraftExpenseSchema,
  Expense,
} from "libs/schemas/auth";
import React, { useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button/Button";

type ActionStateType = {
  errors: string[];
  success: string;
};

interface EditExpenseFormProps {
  expense: Expense | string;
  budgetId: number;
  open: "none" | "create" | "edit" | "delete";
  setOpen: (open: "none" | "create" | "edit" | "delete") => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  // const editExpenseWithBudgetId = editExpense.bind(null, budgetId) as (
  //   state: ActionStateType,
  //   payload: FormData,
  // ) => Promise<ActionStateType>;

  // const [formState, dispatch] = useActionState(editExpenseWithBudgetId, {
  //   errors: [],
  //   success: "",
  // });

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

  const onSubmit = async (data: DraftExpenseFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("amount", data.amount.toString());

    startTransition(() => {
      // dispatch(formData);
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
          支出の追加
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
              {isSubmitting || isPending ? "送信中..." : "追加"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditExpenseForm;
