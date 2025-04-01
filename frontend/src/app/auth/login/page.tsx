"use client";
import LoginForm from "@/components/auth/LoginForm";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
// import RegisterForm from "@/components/auth/RegisterForm";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useEffect } from "react";

const LoginPage = () => {
  useEffect(() => {
    console.log("Login page mounted, checking for auth token");
    const allCookies = document.cookie;
    console.log("All cookies:", allCookies);
  }, []);
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary.dark"
            gutterBottom
          >
            ログイン
          </Typography>
        </Box>

        <LoginForm />

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <LinkButton href="/auth/register">
            アカウントをお持ちでない方はこちら
          </LinkButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
