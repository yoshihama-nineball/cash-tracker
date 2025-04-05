"use client";
import { Box, Container, Typography } from "@mui/material";
import PasswordResetHandler from "../../../components/auth/PasswordResetHandler";

export default function NewPasswordPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: "center", mt: 8, mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="fontWeightBold"
          color="primary.dark"
          gutterBottom
        >
          パスワード再設定
        </Typography>

        <Typography variant="h5" fontWeight="fontWeightMedium" sx={{ mb: 6 }}>
          メールで受け取った
          <Box component="span" sx={{ color: "secondary.main" }}>
            {" "}
            認証コード
          </Box>
          を入力してください
        </Typography>

        <PasswordResetHandler />
      </Box>
    </Container>
  );
}
