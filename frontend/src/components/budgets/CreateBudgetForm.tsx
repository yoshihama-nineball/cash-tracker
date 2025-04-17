"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
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

  useEffect(() => {
    if (formState.success) {
      reset();
      router.push("/admin");
    }
  }, [formState.success, reset]);

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
        {formState.errors.map((error, index) => (
          <Alert severity="error" key={index} aria-label="予算追加エラー">
            {error}
          </Alert>
        ))}

        {formState.success && (
          <Alert severity="success" aria-label="">
            予算追加成功
            {formState.success}
          </Alert>
        )}

        <Typography variant="h4" sx={{ mx: "auto" }}>
          予算作成
        </Typography>

        <FormControl error={!!errors.name}>
          <FormLabel htmlFor="email">タイトル</FormLabel>
          <TextField
            id="name"
            type="name"
            // プレースホルダーテキストを適切なものに修正
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
