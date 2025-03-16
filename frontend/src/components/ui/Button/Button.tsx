import { ButtonProps, Button as MuiButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

// スタイル付きボタンコンポーネント
const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  padding: "8px 16px",
  "&:hover": {
    boxShadow: theme.shadows[2],
  },
}));

interface CustomButtonProps extends ButtonProps {
  customColor?: "success" | "warning" | "info";
}

export const Button: React.FC<CustomButtonProps> = ({
  children,
  customColor,
  ...props
}) => {
  // customColor に基づいてカラープロパティを設定
  const buttonProps: ButtonProps = { ...props };
  if (customColor) {
    buttonProps.color = customColor;
  }

  return <StyledButton {...buttonProps}>{children}</StyledButton>;
};

export default Button;
