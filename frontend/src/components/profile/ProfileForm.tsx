import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { useMessage } from "context/MessageContext";
import { useActionState, useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateProfile } from "../../../actions/update-profile-action";
import {
  UpdateProfileFormValues,
  UpdateProfileSchema,
  User,
} from "../../../libs/schemas/auth";
import Button from "../ui/Button/Button";

interface ProfileFormProps {
  profile: User;
}

interface AuthResponse {
  errors: string[];
  success: string;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const { showMessage } = useMessage();

  const [formState, dispatch] = useActionState<AuthResponse, FormData>(
    updateProfile,
    {
      errors: [],
      success: "",
    },
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (profile) {
      setValue("name", profile.name);
      setValue("email", profile.email);
    }
  }, [profile, setValue]);

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

  const onSubmit = async (data: UpdateProfileFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

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
        <FormControl error={!!errors.name}>
          <FormLabel htmlFor="name">ユーザ名</FormLabel>
          <TextField
            id="name"
            type="name"
            placeholder="ユーザ名を入力"
            fullWidth
            variant="outlined"
            error={!!errors.name}
            {...register("name")}
            sx={{ mt: 1 }}
          />
          {errors.name && (
            <FormHelperText>{errors.name.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl error={!!errors.email}>
          <FormLabel htmlFor="amount">メールアドレス</FormLabel>
          <TextField
            id="email"
            type="email"
            placeholder="メールアドレス"
            fullWidth
            variant="outlined"
            error={!!errors.email}
            {...register("email")}
            sx={{ mt: 1 }}
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
          {isSubmitting || isPending ? "送信中..." : "更新"}
        </Button>
      </Box>
    </>
  );
};

export default ProfileForm;
