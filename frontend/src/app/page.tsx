"use client";

import { Add as AddIcon, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // この状態は実際には認証状態から取得します

  // ダミーの予算データ
  const budgets = [
    { id: 1, name: "生活費", amount: 150000, spent: 120000 },
    { id: 2, name: "貯金", amount: 50000, spent: 50000 },
    { id: 3, name: "趣味・娯楽", amount: 30000, spent: 15000 },
  ];

  return (
    <>
      {/* ヘッダー */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            キャッシュトラッカー
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit" onClick={() => setIsLoggedIn(false)}>
              ログアウト
            </Button>
          ) : (
            <Button color="inherit" onClick={() => setIsLoggedIn(true)}>
              ログイン
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* メインコンテンツ */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* ウェルカムセクション */}
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
            キャッシュトラッカーで支出を管理し、賢く節約しましょう。
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

        {isLoggedIn ? (
          <>
            {/* 予算サマリー */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">予算の概要</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/budgets/new"
                >
                  予算を追加
                </Button>
              </Box>
              <Grid container spacing={3}>
                {budgets.map((budget) => (
                  <Grid item xs={12} sm={6} md={4} key={budget.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {budget.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          予算: ¥{budget.amount.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          使用済み: ¥{budget.spent.toLocaleString()} (
                          {Math.round((budget.spent / budget.amount) * 100)}%)
                        </Typography>
                        {/* プログレスバー代わりのカラーボックス */}
                        <Box
                          sx={{
                            mt: 1,
                            height: 10,
                            bgcolor: "grey.300",
                            borderRadius: 5,
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              width: `${Math.min(Math.round((budget.spent / budget.amount) * 100), 100)}%`,
                              bgcolor:
                                budget.spent / budget.amount > 0.9
                                  ? "error.main"
                                  : "primary.main",
                              borderRadius: 5,
                            }}
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          component={Link}
                          href={`/budgets/${budget.id}`}
                        >
                          詳細を見る
                        </Button>
                        <Button
                          size="small"
                          component={Link}
                          href={`/expenses/new?budgetId=${budget.id}`}
                        >
                          支出を追加
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* 最近の取引 */}
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                最近の取引
              </Typography>
              <Paper>
                {/* ここに最近の取引リストを表示 */}
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    まだ取引データがありません。支出を追加してください。
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    startIcon={<AddIcon />}
                  >
                    支出を記録
                  </Button>
                </Box>
              </Paper>
            </Box>
          </>
        ) : (
          // 未ログイン時のコンテンツ
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom color="primary">
                    シンプルな支出管理
                  </Typography>
                  <Typography variant="body2">
                    日々の支出を簡単に記録して、お金の流れを明確に把握できます。
                    直感的なインターフェースで、誰でも簡単に使いこなせます。
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom color="primary">
                    予算の設定と管理
                  </Typography>
                  <Typography variant="body2">
                    月ごと、カテゴリごとに予算を設定し、支出を効果的に管理しましょう。
                    予算の使用状況をリアルタイムで確認できます。
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom color="primary">
                    データの視覚化
                  </Typography>
                  <Typography variant="body2">
                    グラフや図表で支出パターンを視覚化し、お金の使い方を分析できます。
                    賢い決断を下すための洞察を得られます。
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* フッター */}
      <Box
        component="footer"
        sx={{ bgcolor: "background.paper", py: 6, mt: 4 }}
      >
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            キャッシュトラッカー
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
            {" キャッシュトラッカー. All rights reserved."}
          </Typography>
        </Container>
      </Box>
    </>
  );
}
