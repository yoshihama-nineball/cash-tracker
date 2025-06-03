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
import { updatePassword } from "actions/update-password-action";
import { useMessage } from "context/MessageContext";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import {
  UpdatePasswordFormValues,
  UpdatePasswordSchema,
} from "../../../libs/schemas/auth";
import Button from "../ui/Button/Button";

interface AuthResponse {
  errors: string[];
  success: string;
}

const PasswordForm = () => {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const { showMessage } = useMessage();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const [formState, dispatch] = useActionState<AuthResponse, FormData>(
    updatePassword,
    {
      errors: [],
      success: "",
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (formState.success && formState.success.trim() !== "") {
      showMessage(formState.success, "success");
    }
  }, [formState.success, showMessage]);

  useEffect(() => {
    if (formState.errors.length > 0) {
      showMessage(formState.errors[0], "error");
    }
  }, [formState.errors.length, formState.errors, showMessage]);

  const onSubmit = async (data: UpdatePasswordFormValues) => {
    const formData = new FormData();
    formData.append("current_password", data.current_password);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);

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
        <FormControl error={!!errors.current_password}>
          <FormLabel htmlFor="current_password">現在のパスワード</FormLabel>
          <TextField
            id="current_password"
            type={showPassword ? "text" : "password"}
            placeholder="現在のパスワードを入力"
            fullWidth
            variant="outlined"
            error={!!errors.current_password}
            {...register("current_password")}
            sx={{ mt: 1 }}
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
          {errors.current_password && (
            <FormHelperText>{errors.current_password.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl error={!!errors.password}>
          <FormLabel htmlFor="new_password">再設定用パスワード</FormLabel>
          <TextField
            id="new_password"
            type={showNewPassword ? "text" : "password"}
            placeholder="再設定用のパスワードを入力"
            fullWidth
            variant="outlined"
            error={!!errors.password}
            {...register("password")}
            sx={{ mt: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowNewPassword}
                    edge="end"
                    aria-label="パスワードの表示切替"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
            再設定用パスワード(確認)
          </FormLabel>
          <TextField
            id="password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="再設定用のパスワード(確認)を入力"
            fullWidth
            variant="outlined"
            error={!!errors.password_confirmation}
            {...register("password_confirmation")}
            sx={{ mt: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                    aria-label="パスワードの表示切替"
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
          {isSubmitting || isPending ? "送信中..." : "更新"}
        </Button>
      </Box>
    </>
  );
};

export default PasswordForm;
