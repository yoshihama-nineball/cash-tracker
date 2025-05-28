"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
// useTransitionと同時にuseEffectをインポート
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { authenticate } from "../../../actions/authenticate-user-action";
import { LoginFormValues, LoginSchema } from "../../../libs/schemas/auth";
import Alert from "../feedback/Alert/Alert";
import Button from "../ui/Button/Button";

interface AuthResponse {
  errors: string[];
  success: string;
}

export default function LoginForm() {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  // useActionStateの第一引数にcreateとなっていたのをauthenticateに修正
  const [formState, dispatch] = useActionState<AuthResponse, FormData>(
    authenticate,
    {
      errors: [],
      success: "",
    },
  );
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (formState.success) {
      reset();
      router.push("/budgets");
    }
  }, [formState.success, reset, router]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const onSubmit = async (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(() => {
      dispatch(formData);
    });
    // 以下のコードは不要なので削除
    // startTransition(async () => {
    //   const result = await authenticate(formData);
    //   setFormState(result);
    //
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
      {/* アラートをより意味のある説明にするためにaria-labelを追加 */}
      {formState.errors.map((error, index) => (
        <Alert severity="error" key={index} aria-label="ログインエラー">
          {error}
        </Alert>
      ))}

      {formState.success && (
        <Alert severity="success" aria-label="ログイン成功">
          {formState.success}
        </Alert>
      )}

      <FormControl error={!!errors.email}>
        <FormLabel htmlFor="email">メールアドレス</FormLabel>
        <TextField
          id="email"
          type="email"
          // プレースホルダーテキストを適切なものに修正
          placeholder="メールアドレスを入力"
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
                {/* アクセシビリティのためにaria-labelを追加 */}
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
