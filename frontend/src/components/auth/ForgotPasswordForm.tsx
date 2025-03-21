"use client";

// import { registerUser } from "@/app/actions/auth-actions";
import Alert from "@/components/feedback/Alert/Alert";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField
} from "@mui/material";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "../../../libs/schemas/auth";
import Button from "../../components/ui/Button/Button";

export default function ForgotPassword() {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<{
    errors: string[];
    success: string;
  }>({
    errors: [],
    success: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: RegisterFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

    // Server Actionを呼び出し
    // startTransition(async () => {
    //   const result = await registerUser(formData);
    //   setFormState(result);

    //   if (result.success) {
    //     reset(); // フォームリセット
    //   }
    // });
  };

  return (
    <Box
      component="form"
      ref={ref}
      sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* カスタムAlertコンポーネントを使用して、エラーメッセージを表示 */}
      {formState.errors.map((error, index) => (
        <Alert severity="error" key={index}>
          {error}
        </Alert>
      ))}

      {/* 成功メッセージの表示にもカスタムAlertを使用 */}
      {formState.success && (
        <Alert severity="success">{formState.success}</Alert>
      )}

      <FormControl error={!!errors.email}>
        <FormLabel htmlFor="email">メールアドレス</FormLabel>
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
