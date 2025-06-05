"use client";
import { Box, Container, Typography } from "@mui/material";
import ConfirmAccountForm from "../../../components/auth/ConfirmAccount";

export default function ConfirmAccountPage() {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: "center", mt: 8, mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="fontWeightBold"
          color="primary.dark"
          gutterBottom
        >
          アカウント認証
        </Typography>

        <Typography variant="h5" fontWeight="fontWeightMedium" sx={{ mb: 6 }}>
          メールで受け取った
          <Box component="span" sx={{ color: "secondary.main" }}>
            {" "}
            認証コード
          </Box>
          を入力してください
        </Typography>

        <ConfirmAccountForm />
      </Box>
    </Container>
  );
}
