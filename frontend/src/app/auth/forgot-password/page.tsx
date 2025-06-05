"use client";
import ForgotPassword from "@/components/auth/ForgotPasswordForm";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { FC } from "react";

const ForgotPasswordPage: FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box sx={{ textAlign: "center", mt: 8, mb: 6 }}>
          <Typography
            variant="h4"
            fontWeight="fontWeightBold"
            color="primary.dark"
            gutterBottom
          >
            パスワードをお忘れですか？
          </Typography>

          <Typography variant="h5" fontWeight="fontWeightMedium" sx={{ mb: 6 }}>
            こちらから
            <Box component="span" sx={{ color: "secondary.main" }}>
              {" "}
              再設定
            </Box>
            できます
          </Typography>

          <ForgotPassword />

          <Stack direction="column" spacing={2} sx={{ mt: 6 }}>
            <LinkButton href="/auth/login">
              アカウントをお持ちの方はこちら
            </LinkButton>

            <LinkButton href="/auth/register">
              アカウントをお持ちでない方はこちら
            </LinkButton>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
