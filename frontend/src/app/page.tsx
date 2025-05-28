"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";

export default function HomePage() {
  const theme = useTheme();
  const [isLoggedIn] = useState(false);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            color: "white",
          }}
        >
          <Typography variant="h4" gutterBottom>
            家計簿をもっとシンプルに
          </Typography>
          <Typography variant="subtitle1" paragraph>
            家計簿アプリで支出を管理し、賢く節約しましょう。
            シンプルで使いやすいインターフェースと、詳細な分析機能であなたの家計をサポートします。
          </Typography>
          {!isLoggedIn && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mr: 2 }}
              >
                今すぐ始める
              </Button>
              <Button
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
              >
                詳細を見る
              </Button>
            </Box>
          )}
        </Paper>

        {/* 以下は既存のコードと同じ */}
        {/* ... */}
      </Container>

      {/* フッター */}
      <Box
        component="footer"
        sx={{ bgcolor: "background.paper", py: 6, mt: 4 }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            家計簿アプリ
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            あなたの家計をシンプルに管理
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {"© "}
            {new Date().getFullYear()}
            {" 家計簿アプリ. All rights reserved."}
          </Typography>
        </Container>
      </Box>
    </>
  );
}
