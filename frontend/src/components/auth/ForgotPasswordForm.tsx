"use client";

import Alert from "@/components/feedback/Alert/Alert";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { forget_password } from "../../../actions/forget-password-action";
import {
  ForgotPasswordFormValues,
  ForgotPasswordSchema,
} from "../../../libs/schemas/auth";
import Button from "../../components/ui/Button/Button";

export default function ForgotPassword() {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const [state, dispatch] = useFormState(forget_password, {
    errors: [],
    success: "",
  });

  // Alertの表示制御
  const [showAlerts, setShowAlerts] = useState({
    errors: true,
    success: true,
  });

  // フォーム状態が変わったらアラートをリセット
  useEffect(() => {
    setShowAlerts({
      errors: true,
      success: true,
    });

    // 一定時間後にアラートを非表示
    const timer = setTimeout(() => {
      setShowAlerts({
        errors: false,
        success: false,
      });
    }, 5000); // 5秒後に非表示

    return () => clearTimeout(timer);
  }, [state]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);

    startTransition(() => {
      dispatch(formData);

      // 成功したらフォームをリセット
      if (state.success) {
        reset();
      }
    });
  };

  return (
    <Box
      component="form"
      ref={ref}
      sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* エラーメッセージの表示 */}
      {state.errors.length > 0 && showAlerts.errors && (
        <Box sx={{ mb: 2 }}>
          {state.errors.map((error, index) => (
            <Alert severity="error" key={index} sx={{ mb: 1 }}>
              {error}
            </Alert>
          ))}
        </Box>
      )}

      {/* 成功メッセージの表示 */}
      {state.success && showAlerts.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.success}
        </Alert>
      )}

      <FormControl error={!!errors.email}>
        <FormLabel htmlFor="email" sx={{ textAlign: "left", display: "block" }}>
          メールアドレス
        </FormLabel>
        <TextField
          id="email"
          type="email"
          placeholder="登録用メールアドレス"
          fullWidth
          variant="outlined"
          error={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <FormHelperText>{errors.email.message}</FormHelperText>
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
        {isSubmitting || isPending ? "送信中..." : "パスワードのリセット"}
      </Button>
    </Box>
  );
}
