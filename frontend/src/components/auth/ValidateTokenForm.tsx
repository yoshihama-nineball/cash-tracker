import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { validate_token } from "../../../actions/validate-token-action";
import {
  ValidateTokenFormValues,
  ValidateTokenSchema,
} from "../../../libs/schemas/auth";
import Alert from "../feedback/Alert/Alert";

type ValidateTokenFormType = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
};

const ValidateTokenForm = ({ setToken, setIsValid }: ValidateTokenFormType) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [tokenArray, setTokenArray] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialState = {
    errors: [],
    success: "",
  };

  const [formState, action] = useActionState(validate_token, initialState);

  const {
    setValue,
    formState: { errors: formErrors },
  } = useForm<ValidateTokenFormValues>({
    resolver: zodResolver(ValidateTokenSchema),
    defaultValues: {
      token: "",
    },
  });

  useEffect(() => {
    if (formState.success) {
      //memo: パスワードリセットフォームに切り替え
      setIsValid(true);
    }

    if (formState.errors && formState.errors.length > 0) {
      //memo: 入力エラーの場合、送信状態を解除
      setIsSubmitting(false);
    }
  }, [formState, setIsValid]);

  // フォーム送信処理
  const submitForm = () => {
    if (isSubmitting) return; // 送信中なら何もしない

    console.log("フォーム送信処理実行:", tokenArray.join(""));
    setIsSubmitting(true);

    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  // 入力値の変更を処理
  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newTokenArray = [...tokenArray];
      newTokenArray[index] = value;
      setTokenArray(newTokenArray);

      // React Hook Formの値も更新
      const newToken = [...tokenArray];
      newToken[index] = value;
      setToken(newToken.join(""));
      setValue("token", newToken.join(""));

      // 入力後に次のフィールドにフォーカス
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      // 最後の入力欄まで入力が完了したら自動送信
      if (index === 5 && value !== "") {
        const completeToken = [...newToken];
        completeToken[5] = value;

        // 全ての入力欄が埋まっていることを確認
        if (!completeToken.includes("")) {
          // 少し遅延させて送信
          setTimeout(() => {
            submitForm();
          }, 100);
        }
      }
    }
  };

  // キーボードイベントの処理
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    // Backspaceで前のフィールドに戻る
    if (e.key === "Backspace" && tokenArray[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // 右矢印キーで次のフィールドに移動
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 左矢印キーで前のフィールドに移動
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // input要素への参照を設定
  const setInputRef = (index: number, ref: HTMLInputElement | null) => {
    inputRefs.current[index] = ref;
  };

  return (
    <Container maxWidth="sm">
      {/* アラートを上部に表示 */}
      <Box sx={{ mt: 4, mb: 2 }}>
        {/* クライアント側のバリデーションエラー */}
        {formErrors.token && (
          <Alert severity="error">{formErrors.token.message}</Alert>
        )}

        {/* サーバー側のエラー */}
        {formState.errors &&
          formState.errors.length > 0 &&
          formState.errors.map((error, index) => (
            <Alert severity="error" key={index}>
              {error}
            </Alert>
          ))}

        {/* 成功メッセージ */}
        {formState.success && (
          <Alert severity="success">{formState.success}</Alert>
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

        {/* サーバーアクション用フォーム */}
        <form ref={formRef} action={action}>
          <input type="hidden" name="token" value={tokenArray.join("")} />
          <input type="submit" style={{ display: "none" }} />
        </form>

        <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
          <Stack direction="row" spacing={2}>
            {tokenArray.map((digit, index) => (
              <TextField
                key={index}
                inputRef={(ref) => setInputRef(index, ref)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                variant="outlined"
                disabled={isSubmitting}
                error={
                  !!formErrors.token ||
                  (formState.errors && formState.errors.length > 0)
                }
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

export default ValidateTokenForm;
