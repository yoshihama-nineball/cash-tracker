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

const ValidateTokenForm = ({
  token,
  setToken,
  setIsValid,
}: ValidateTokenFormType) => {
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

  // 初期状態
  const initialState = {
    errors: [],
    success: "",
  };

  // 直接アクションを呼び出す代わりにバインドする
  const validateWithToken = async (
    prevState: typeof initialState,
    formData: FormData,
  ) => {
    console.log("サーバーアクション呼び出し前", { token: tokenArray.join("") });

    // FormDataを新しく作成してトークンを設定（既存のformDataは使わない）
    const newFormData = new FormData();
    newFormData.append("token", tokenArray.join(""));

    // サーバーアクションを呼び出す
    return validate_token(prevState, newFormData);
  };

  // useActionStateを使用
  const [formState, action] = useActionState(validateWithToken, initialState);

  // React Hook Form バリデーション
  const {
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<ValidateTokenFormValues>({
    resolver: zodResolver(ValidateTokenSchema),
    defaultValues: {
      token: "",
    },
  });

  // 成功時やエラー時の処理
  useEffect(() => {
    console.log("ValidateToken formState更新:", formState);

    if (formState.success) {
      console.log("トークン検証成功:", formState.success);
      setIsValid(true);
    }

    // エラーがある場合はコンソールにログを出力
    if (formState.errors && formState.errors.length > 0) {
      console.error("Token validation errors:", formState.errors);
      setIsSubmitting(false); // エラー時に送信状態を解除
    }
  }, [formState, setIsValid]);

  // クライアント側のバリデーションとサーバーアクションの実行
  const onSubmit = async (data: ValidateTokenFormValues) => {
    console.log("フォーム送信:", data);
    setIsSubmitting(true);

    // フォームを送信
    if (formRef.current) {
      console.log("フォーム要素を送信");
      formRef.current.requestSubmit();
    }
  };

  // 手動でフォームを送信する関数
  const submitForm = () => {
    console.log("手動フォーム送信");
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  // tokenArrayが更新されたらトークン文字列を更新
  useEffect(() => {
    const newToken = tokenArray.join("");
    setToken(newToken);

    // React Hook Formの値も更新
    setValue("token", newToken);

    // 全て入力されたらバリデーションを実行
    if (newToken.length === 6 && !newToken.includes("") && !isSubmitting) {
      console.log("トークン入力完了:", newToken);
      handleSubmit(onSubmit)();
    }
  }, [tokenArray, setToken, setValue, handleSubmit, onSubmit, isSubmitting]);

  // input要素への参照を設定
  const setInputRef = (index: number, ref: HTMLInputElement | null) => {
    inputRefs.current[index] = ref;
  };

  // 入力値の変更を処理
  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newTokenArray = [...tokenArray];
      newTokenArray[index] = value;
      setTokenArray(newTokenArray);

      // 入力後に次のフィールドにフォーカス
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
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

  // フォームの手動リセット
  const resetForm = () => {
    setTokenArray(["", "", "", "", "", ""]);
    setIsSubmitting(false);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
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

        {/* デバッグ用：手動送信ボタン */}
        {tokenArray.join("").length === 6 && !isSubmitting && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
            <button
              onClick={submitForm}
              style={{
                cursor: "pointer",
                backgroundColor: "#1976d2",
                border: "none",
                color: "white",
                fontWeight: 500,
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "1rem",
              }}
            >
              コードを検証
            </button>
          </Box>
        )}

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          メールに送信された6桁の認証コードを入力してください
        </Typography>

        {/* エラーがある場合のみリセットボタンを表示 */}
        {formState.errors && formState.errors.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <button
              onClick={resetForm}
              style={{
                cursor: "pointer",
                backgroundColor: "transparent",
                border: "1px solid #1976d2",
                color: "#1976d2",
                fontWeight: 500,
                borderRadius: "4px",
                padding: "6px 12px",
                fontSize: "0.875rem",
              }}
            >
              コードを再入力
            </button>
          </Box>
        )}

        {/* デバッグ情報 */}
        {process.env.NODE_ENV === "development" && (
          <Box
            sx={{
              mt: 4,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              fontSize: "0.75rem",
            }}
          >
            <Typography variant="caption" component="div">
              デバッグ情報:
            </Typography>
            <div>トークン: {tokenArray.join("")}</div>
            <div>送信中: {isSubmitting ? "はい" : "いいえ"}</div>
            <div>エラー数: {formState.errors?.length || 0}</div>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ValidateTokenForm;
