'use client'
import RegisterForm from '@/components/auth/RegisterForm';
// import RegisterForm from "@/components/auth/RegisterForm";
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight="bold" color="primary.dark" gutterBottom>
            アカウント作成
          </Typography>
          <Typography variant="h6">
            あなたの<Box component="span" sx={{ color: 'warning.main' }}>家計</Box>を管理しましょう
          </Typography>
        </Box>

        <RegisterForm />
        {/* ユーザ登録用のフォーム */}

        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Link href='/auth/login' passHref style={{ textDecoration: 'none' }}>
            <Button variant="text" fullWidth color="inherit" sx={{ color: 'text.secondary' }}>
              アカウントをお持ちの方はこちら（ログイン）
            </Button>
          </Link>

          <Link href='/auth/forgot-password' passHref style={{ textDecoration: 'none' }}>
            <Button variant="text" fullWidth color="inherit" sx={{ color: 'text.secondary' }}>
              パスワードをお忘れの方はこちら
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}