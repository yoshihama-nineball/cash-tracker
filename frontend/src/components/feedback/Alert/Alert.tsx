// components/feedback/Alert/Alert.tsx
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import { Alert as MuiAlert, SxProps, Theme } from "@mui/material";

type AlertSeverity = "error" | "warning" | "success" | "info";

interface AlertProps {
  children: React.ReactNode;
  severity: AlertSeverity;
  sx?: SxProps<Theme>;
}

export default function Alert({ children, severity = "info", sx }: AlertProps) {
  const getIcon = () => {
    switch (severity) {
      case "error":
        return <ErrorOutlineIcon fontSize="inherit" />;
      case "warning":
        return <WarningIcon fontSize="inherit" />;
      case "success":
        return <CheckCircleIcon fontSize="inherit" />;
      case "info":
      default:
        return <InfoIcon fontSize="inherit" />;
    }
  };

  return (
    <MuiAlert icon={getIcon()} severity={severity} sx={{ my: 2, ...sx }}>
      {children}
    </MuiAlert>
  );
}
