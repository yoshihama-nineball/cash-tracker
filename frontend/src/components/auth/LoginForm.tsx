"use client";

// import { registerUser } from "@/app/actions/auth-actions";
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
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoginFormValues, loginSchema } from "../../../libs/schemas/auth";
import Button from "../ui/Button/Button";

export default function LoginForm() {
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const onSubmit = async (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

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

      <Button
        type="submit"
        sx={{
          mt: 2,
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        disabled={isSubmitting || isPending}
      >
        {isSubmitting || isPending ? "送信中..." : "ログイン"}
      </Button>
    </Box>
  );
}
