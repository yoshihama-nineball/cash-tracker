"use client";
import {
  Alert,
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { confirm_account } from "../../../actions/confirm-account-action";

const ConfirmAccountForm = () => {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [token, setToken] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  const initialState = {
    errors: [],
    success: "",
  };

  const [formState, formAction] = useFormState(confirm_account, initialState);

  useEffect(() => {
    if (formState.success) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [formState.success, router]);

  useEffect(() => {
    if (isComplete && formRef.current) {
      formRef.current.requestSubmit();
    }
  }, [isComplete]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.match(/\d/g);
      if (digits && digits.length > 0) {
        const newToken = [...token];
        const maxDigits = Math.min(digits.length, 6);

        for (let i = 0; i < maxDigits; i++) {
          const targetIndex = index + i;
          if (targetIndex < 6) {
            newToken[targetIndex] = digits[i];
          }
        }

        setToken(newToken);

        const nextFocusIndex = Math.min(index + maxDigits, 5);
        if (nextFocusIndex < 5) {
          inputRefs.current[nextFocusIndex + 1]?.focus();
        }

        if (newToken.every((t) => t !== "")) {
          setIsComplete(true);
        }

        return;
      }
    }

    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);
    setIsComplete(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newToken.every((t) => t !== "")) {
      setIsComplete(true);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const setInputRef = (index: number, ref: HTMLInputElement | null) => {
    inputRefs.current[index] = ref;
  };

  const tokenString = token.join("");

  return (
    <Container maxWidth="sm">
      {/* アラートを上部に表示 */}
      <Box sx={{ mt: 4, mb: 2 }}>
        {formState.errors.map((error: string, index: number) => (
          <Alert severity="error" key={index} sx={{ mb: 2 }}>
            {error}
          </Alert>
        ))}

        {formState.success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {formState.success}
          </Alert>
        )}
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
          認証コードを入力してください
        </Typography>
        <form ref={formRef} action={formAction} style={{ display: "none" }}>
          <input type="hidden" name="token" value={tokenString} />
        </form>

        <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
          <Stack direction="row" spacing={2}>
            {token.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(ref) => setInputRef(index, ref)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.5rem",
                    padding: "8px 0",
                    width: "45px",
                    height: "45px",
                  },
                }}
                sx={{
                  width: "65px",
                  height: "65px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRadius: 1,
                    },
                  },
                }}
              />
            ))}
          </Stack>
        </Box>

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          メールに送信された6桁の認証コードを入力してください
        </Typography>
      </Paper>
    </Container>
  );
};

export default ConfirmAccountForm;
