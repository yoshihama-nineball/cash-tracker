"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { editBudget } from "../../../actions/edit-budget-action";
import { useMessage } from "../../../context/MessageContext";
import {
  Budget,
  DraftBudgetFormValues,
  DraftBudgetSchema,
} from "../../../libs/schemas/auth";
import Loading from "../feedback/Loading";
import Button from "../ui/Button/Button";

interface ActionStateType {
  errors: string[];
  success: string;
}

const EditBudgetForm = ({ budget }: { budget: Budget }) => {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isFormReady, setIsFormReady] = useState(false);
  const { showMessage } = useMessage();

  useEffect(() => {
    if (budget && budget.id) {
      setIsFormReady(true);
    }
  }, [budget]);

  const editBudgetWithId = editBudget.bind(null, budget?.id) as unknown as (
    state: ActionStateType,
    payload: FormData,
  ) => Promise<ActionStateType>;

  const [formState, dispatch] = useFormState(editBudgetWithId, {
    errors: [],
    success: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<DraftBudgetFormValues>({
    resolver: zodResolver(DraftBudgetSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (budget) {
      console.log("Setting form values:", budget);
      setValue("name", budget.name);
      setValue(
        "amount",
        typeof budget.amount === "string"
          ? parseInt(budget.amount, 10)
          : budget.amount,
      );
    }
  }, [budget, setValue]);

  useEffect(() => {
    if (formState.success) {
      // 成功メッセージをグローバルメッセージとして設定
      showMessage(formState.success, "success");
      reset();
      router.push("/admin/budgets");
    }
  }, [formState.success, reset, router, showMessage]);

  // エラーがある場合もグローバルメッセージとして設定
  useEffect(() => {
    if (formState.errors.length > 0) {
      showMessage(formState.errors[0], "error");
    }
  }, [formState.errors, showMessage]);

  const onSubmit = async (data: DraftBudgetFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("amount", data.amount.toString());

    startTransition(() => {
      dispatch(formData);
    });
  };

  if (!isFormReady) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Loading />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      ref={ref}
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: "500px",
        width: "100%",
        mx: "auto",
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* {formState.errors.map((error, index) => (
        <Alert severity="error" key={index}>
          {error}
        </Alert>
      ))}

      {formState.success && (
        <Alert severity="success">{formState.success}</Alert>
      )} */}

      <Typography variant="h4">予算の編集</Typography>

      <FormControl error={!!errors.name}>
        <FormLabel htmlFor="name">タイトル</FormLabel>
        <TextField
          id="name"
          type="text"
          placeholder="タイトルを入力"
          fullWidth
          variant="outlined"
          error={!!errors.name}
          {...register("name")}
        />
        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
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
        {isSubmitting || isPending ? "送信中" : "更新"}
      </Button>
    </Box>
  );
};

export default EditBudgetForm;
