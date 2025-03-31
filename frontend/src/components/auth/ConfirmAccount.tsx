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
  const inputRefs = useRef([]);
  const formRef = useRef(null);

  // 初期状態
  const initialState = {
    errors: [],
    success: "",
  };

  // useFormStateフックを使用してサーバーアクションとフォーム状態を連携
  const [formState, formAction] = useFormState(confirm_account, initialState);

  // 成功時の処理
  useEffect(() => {
    if (formState.success) {
      // 成功メッセージが表示された後、ログインページにリダイレクト
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 3000); // 3秒後にリダイレクト

      return () => clearTimeout(timer);
    }
  }, [formState.success, router]);

  // すべてのトークンが入力されたら自動的にフォームを送信
  useEffect(() => {
    if (isComplete && formRef.current) {
      formRef.current.requestSubmit();
    }
  }, [isComplete]);

  // 入力した値をstateに保存し、次のフィールドにフォーカスを移動
  const handleChange = (index, value) => {
    // コピペ対応: 複数の数字が入力された場合（長さが1より大きい場合）
    if (value.length > 1) {
      // 数字のみのパターンにマッチするか確認
      const digits = value.match(/\d/g);
      if (digits && digits.length > 0) {
        // 新しいトークン配列を作成
        const newToken = [...token];

        // 利用可能な桁数まで（最大6桁）
        const maxDigits = Math.min(digits.length, 6);

        // 各桁を埋める
        for (let i = 0; i < maxDigits; i++) {
          const targetIndex = index + i;
          if (targetIndex < 6) {
            newToken[targetIndex] = digits[i];
          }
        }

        setToken(newToken);

        // フォーカスを最後の入力後のフィールドに移動（もし存在するなら）
        const nextFocusIndex = Math.min(index + maxDigits, 5);
        if (nextFocusIndex < 5) {
          inputRefs.current[nextFocusIndex + 1]?.focus();
        }

        // すべての桁が埋まったかチェック
        if (newToken.every((t) => t !== "")) {
          setIsComplete(true);
        }

        return;
      }
    }

    // 以下は既存の1文字入力処理
    // 数字のみ許可
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newToken = [...token];
    newToken[index] = value;
    setToken(newToken);
    setIsComplete(false);

    // 次のフィールドにフォーカスを移動
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // すべてのフィールドが埋まっているか確認
    if (newToken.every((t) => t !== "")) {
      setIsComplete(true);
    }
  };

  // バックスペースキーの処理
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      // 現在のフィールドが空で、バックスペースが押された場合は前のフィールドにフォーカスを移動
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 入力フィールドの参照を保存
  const setInputRef = (index, ref) => {
    inputRefs.current[index] = ref;
  };

  // トークン結合（フォーム送信用）
  const tokenString = token.join("");

  return (
    <Container maxWidth="sm">
      {/* アラートを上部に表示 */}
      <Box sx={{ mt: 4, mb: 2 }}>
        {formState.errors.map((error, index) => (
          <Alert
            severity="error"
            key={index}
            sx={{ mb: 2 }} // 複数のエラーがある場合に間隔を空ける
          >
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

        {/* 非表示のフォームでサーバーアクションに接続 */}
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
                    fontSize: "1.5rem", // フォントサイズを大きく
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
