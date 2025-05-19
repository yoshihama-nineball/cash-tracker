import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function CenteredLoading({ message = "読み込んでいます..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        minHeight: 200,
        padding: 3,
      }}
      role="status"
      aria-live="polite"
    >
      <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
