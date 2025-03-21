"use client";
// import { confirmAccount } from '@/actions /confirm-account-action';
import {
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const ConfirmAccountForm = () => {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);
  const [token, setToken] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 配列のトークンを単一の文字列に結合
  const tokenString = token.join("");

  // const confirmAccountWithToken = confirmAccount.bind(null, tokenString);
  // const [state, dispatch] = useFormState(confirmAccountWithToken, {
  //   errors: [],
  //   success: ''
  // });

  // useEffect(() => {
  //   if (isComplete) {
  //     dispatch();
  //   }
  // }, [isComplete, dispatch]);

  // useEffect(() => {
  //   if (state.errors) {
  //     state.errors.forEach(error => {
  //       toast.error(error);
  //     });
  //   }
  //   if (state.success) {
  //     toast.success(state.success, {
  //       onClose: () => {
  //         router.push('/auth/login');
  //       }
  //     });
  //   }
  // }, [state, router]);

  // 入力した値をstateに保存し、次のフィールドにフォーカスを移動
  const handleChange = (index: number, value: string) => {
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
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !token[index] && index > 0) {
      // 現在のフィールドが空で、バックスペースが押された場合は前のフィールドにフォーカスを移動
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 入力フィールドの参照を保存
  const setInputRef = (index: number, ref: HTMLInputElement | null) => {
    inputRefs.current[index] = ref;
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
          認証コードを入力してください
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", my: 6 }}>
          {" "}
          {/* 上下のマージンを増やす */}
          <Stack direction="row" spacing={2}>
            {" "}
            {/* 入力フィールド間の間隔を広げる */}
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
                      borderRadius: 2, // 角を少し丸く
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
