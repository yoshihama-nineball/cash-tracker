import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function Forbidden() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          p: 4,
          backgroundColor: "warning.light",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          アクセス権限がありません
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          このページにアクセスするためには適切な権限が必要です。
        </Typography>
        <Button component={Link} href="/" variant="contained" color="primary">
          トップページへ戻る
        </Button>
      </Box>
    </Container>
  );
}
