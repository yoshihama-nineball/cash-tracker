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
import { useMessage } from "context/MessageContext";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { createBudget } from "../../../actions/create-budget-action";
import {
  DraftBudgetFormValues,
  DraftBudgetSchema,
} from "../../../libs/schemas/auth";
import Button from "../ui/Button/Button";

interface AuthResponse {
  errors: string[];
  success: string;
}

const CreateBudgetForm = () => {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const { showMessage } = useMessage();

  const [formState, dispatch] = useActionState<AuthResponse, FormData>(
    createBudget,
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
  } = useForm<DraftBudgetFormValues>({
    resolver: zodResolver(DraftBudgetSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

  // useEffect(() => {
  //   if (formState.success) {
  //     reset();
  //     router.push("/admin/budgets");
  //   }
  // }, [formState.success, reset]);

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
  return (
    <>
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
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography variant="h4" sx={{ mx: "auto" }}>
          予算作成
        </Typography>

        <FormControl error={!!errors.name}>
          <FormLabel htmlFor="email">タイトル</FormLabel>
          <TextField
            id="name"
            type="name"
            placeholder="タイトルを入力"
            fullWidth
            variant="outlined"
            error={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <FormHelperText>{errors.name.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl error={!!errors.amount}>
          <FormLabel htmlFor="password">金額</FormLabel>
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
          {isSubmitting || isPending ? "送信中..." : "追加"}
        </Button>
      </Box>
    </>
  );
};

export default CreateBudgetForm;
