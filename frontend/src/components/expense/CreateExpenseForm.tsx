"use client";
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
import { useRouter } from "next/navigation";
import React, {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { createExpense } from "../../../actions/create-expense-action";
import { useMessage } from "../../../context/MessageContext";
import {
  DraftExpenseFormValues,
  DraftExpenseSchema,
} from "../../../libs/schemas/auth";
import Button from "../ui/Button/Button";

interface CreateExpenseFormProps {
  budgetId: string;
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

const CreateExpenseForm = ({ budgetId }: CreateExpenseFormProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showMessage } = useMessage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);

  const createExpenseWithBudgetId = createExpense.bind(
    null,
    budgetId,
  ) as (state: ActionStateType, payload: FormData) => Promise<ActionStateType>;

  const [formState, dispatch] = useActionState(createExpenseWithBudgetId, {
    errors: [],
    success: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DraftExpenseFormValues>({
    resolver: zodResolver(DraftExpenseSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (formState.success) {
      setOpen(false);
      reset();
      showMessage(formState.success, "success");
    }
  }, [formState.success, reset, router, showMessage]);

  useEffect(() => {
    if (formState.errors.length > 0) {
      showMessage(formState.errors[0], "error");
    }
  }, [formState.errors, showMessage]);

  const handleClickOpen = () => {
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: DraftExpenseFormValues) => {
    // setOpen(false);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("amount", data.amount.toString());

    startTransition(() => {
      dispatch(formData);
    });
  };
  return (
    <>
      <Button
        sx={{
          bgcolor: "#8e8edb",
          color: "white",
          borderRadius: 4,
          py: 1,
          px: 3,
          "&:hover": { bgcolor: "#7070c0" },
        }}
        onClick={handleClickOpen}
      >
        新規支出作成
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
            maxWidth: isMobile ? "90%" : "400px", // maxwidth → maxWidth (大文字小文字の修正)
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

export default CreateExpenseForm;
