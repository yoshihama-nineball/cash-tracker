"use client";
import RegisterForm from "@/components/auth/RegisterForm";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
// import RegisterForm from "@/components/auth/RegisterForm";
import { Box, Container, Paper, Typography } from "@mui/material";

const RegisterPage = () => {
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
            アカウント作成
          </Typography>
        </Box>

        <RegisterForm />

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <LinkButton href="/auth/login">
            アカウントをお持ちの方はこちら
          </LinkButton>

          <LinkButton href="/auth/forgot-password">
            パスワードをお忘れの方はこちら
          </LinkButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
