"use client";

// import { registerUser } from "@/app/actions/auth-actions";
import Alert from "@/components/feedback/Alert/Alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "../../../libs/schemas/auth";
import Button from "../../components/ui/Button/Button";

export default function ResetPasswordForm() {
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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
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
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      aria-label="パスワードの表示切替"
                    >
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
            <FormLabel htmlFor="password_confirmation">
              パスワード(確認)
            </FormLabel>
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
                    <IconButton
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      aria-label="確認用パスワードの表示切替"
                    >
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
            disabled={isSubmitting || isPending}
          >
            {isSubmitting || isPending ? "送信中..." : "パスワードのリセット"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
