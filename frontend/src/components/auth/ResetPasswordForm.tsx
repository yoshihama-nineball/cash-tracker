"use client";

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
import { useActionState, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { reset_password as resetPassword } from "../../../actions/reset-password-action";
import { ResetPasswordSchema } from "../../../libs/schemas/auth";
import Button from "../../components/ui/Button/Button";
import Alert from "../feedback/Alert/Alert";

interface ResetPasswordState {
  errors: string[];
  success: string;
}

// ResetPasswordSchemaに合わせた型定義
type ResetPasswordFormValues = {
  password: string;
  password_confirmation: string;
};

type ResetPasswordType = {
  token: string;
};

export default function ResetPasswordForm({
  token,
}: ResetPasswordType): React.ReactElement {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending] = useTransition();

  // サーバーアクション用のカスタムハンドラー
  const resetPasswordWithToken = async (
    prevState: ResetPasswordState,
    formData: FormData,
  ) => {
    // トークンをフォームデータに追加
    formData.append("token", token);
    return resetPassword(prevState, formData);
  };

  // useActionStateでサーバーアクションの状態管理
  const [formState, formAction] = useActionState(resetPasswordWithToken, {
    errors: [],
    success: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // フォーム送信処理
  const onSubmit = async (data: ResetPasswordFormValues) => {
    console.log("ResetPassword フォーム送信:", {
      token,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });

    // formRefを使ってフォームを送信
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        {/* React Hook Formのフォーム */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "none" }}
        ></Box>
        <Box
          component="form"
          ref={formRef}
          action={formAction}
          sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}
        >
          {formState.errors.map((error, index) => (
            <Alert severity="error" key={index}>
              {error}
            </Alert>
          ))}
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
          <input type="hidden" name="token" value={token} />

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
