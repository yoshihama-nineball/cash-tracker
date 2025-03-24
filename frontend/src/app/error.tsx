"use client";

import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const theme = useTheme();

  useEffect(() => {
    // オプション: エラーロギングサービスにエラーを報告
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          申し訳ございません
        </Typography>
        <Typography variant="subtitle1" paragraph>
          ページの表示中に問題が発生しました。ご迷惑をおかけしております。
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={reset}
            size="large"
            sx={{ mr: 2 }}
          >
            再試行する
          </Button>
          <Button
            component={Link}
            href="/"
            variant="contained"
            color="primary"
          >
            トップページへ戻る
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        {process.env.NODE_ENV === "development" && (
          <Paper
            elevation={2}
            sx={{ p: 3, bgcolor: theme.palette.background.default }}
          >
            <Typography variant="body1">
              <strong>エラー詳細:</strong> {error.message}
            </Typography>
          </Paper>
        )}
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="subtitle1" color="text.secondary">
          お困りの場合は <Link href="/contact">サポート</Link>
          までお問い合わせください。
        </Typography>
      </Box>
    </Container>
  );
}
