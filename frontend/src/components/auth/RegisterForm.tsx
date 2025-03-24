"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../../../actions/create-account-action";
import { RegisterFormValues, RegisterSchema } from "../../../libs/schemas/auth";
import Button from "../ui/Button/Button";

export default function RegisterForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Server Action用のFormState
  const [formState, dispatch] = useActionState(registerUser, {
    errors: [],
    success: "",
  });

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
    },
  });

  // formData取得用の関数
  const handleFormSubmit = (event) => {
    // フォームの自動送信を一時停止
    event.preventDefault();

    // フォームデータの取得
    const formData = new FormData(event.target);

    // React Hook Form の状態更新
    setValue("email", formData.get("email") as string);
    setValue("name", formData.get("name") as string);

    // Server Actionへ送信
    dispatch(formData);
  };

  // 成功時のみフォームをリセット
  useEffect(() => {
    if (formState.success) {
      reset();
    }
  }, [formState.success, reset]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box
      component="form"
      ref={ref}
      sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}
      noValidate
      onSubmit={handleFormSubmit}
    >
      {formState.errors.map((error, index) => (
        <Alert severity="error" key={index}>
          {error}
        </Alert>
      ))}

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

      <FormControl error={!!errors.name}>
        <FormLabel htmlFor="name">ユーザ名</FormLabel>
        <TextField
          id="name"
          type="text"
          placeholder="お名前"
          fullWidth
          variant="outlined"
          error={!!errors.name}
          {...register("name")}
        />
        {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
      </FormControl>

      <FormControl error={!!errors.password}>
        <FormLabel htmlFor="password">パスワード</FormLabel>
        <TextField
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="パスワード"
          fullWidth
          variant="outlined"
          error={!!errors.password}
          {...register("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors.password && (
          <FormHelperText>{errors.password.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl error={!!errors.password_confirmation}>
        <FormLabel htmlFor="password_confirmation">パスワード(確認)</FormLabel>
        <TextField
          id="password_confirmation"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="パスワード（再入力）"
          fullWidth
          variant="outlined"
          error={!!errors.password_confirmation}
          {...register("password_confirmation")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {errors.password_confirmation && (
          <FormHelperText>
            {errors.password_confirmation.message}
          </FormHelperText>
        )}
      </FormControl>

      <Button
        type="submit"
        sx={{
          mt: 2,
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "送信中..." : "アカウント作成"}
      </Button>
    </Box>
  );
}
