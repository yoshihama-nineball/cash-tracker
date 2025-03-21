"use client";

import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import Link from "next/link";
import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "delete"
  | "success"
  | "warning"
  | "info"
  | "black";

export interface ButtonProps extends Omit<MuiButtonProps, "color" | "variant"> {
  variant?: ButtonVariant;
  href?: string;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  color?: MuiButtonProps["color"];
}
/**
 * 共通ボタンコンポーネント
 * Material UIのボタンをラップして、アプリ全体で一貫したスタイルを提供します
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  href,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  ...props
}) => {
  // バリアントに基づいてMUI用のpropsを設定
  const getButtonProps = (): Partial<MuiButtonProps> => {
    const baseProps: Partial<MuiButtonProps> = {
      variant: "contained",
      startIcon,
      endIcon,
      disabled: disabled || loading,
    };

    // 各バリアント別の設定
    switch (variant) {
      case "primary":
        return { ...baseProps, color: "primary" };
      case "secondary":
        return { ...baseProps, color: "secondary" };
      case "delete":
        return { ...baseProps, color: "error" };
      case "success":
        return { ...baseProps, color: "success" };
      case "warning":
        return { ...baseProps, color: "warning" };
      case "info":
        return { ...baseProps, color: "info" };
      case "black":
        return {
          ...baseProps,
          sx: {
            bgcolor: "#000",
            "&:hover": {
              bgcolor: "#333",
            },
            color: "#fff",
            ...(props.sx || {}),
          },
        };
      default:
        return { ...baseProps, color: "primary" };
    }
  };

  const buttonProps = getButtonProps();

  // リンク用ボタン
  if (href) {
    return (
      <Link href={href} passHref style={{ textDecoration: "none" }}>
        <MuiButton {...buttonProps} {...props}>
          {children}
        </MuiButton>
      </Link>
    );
  }

  // 通常ボタン
  return (
    <MuiButton {...buttonProps} {...props}>
      {loading ? "Loading..." : children}
    </MuiButton>
  );
};

export default Button;
