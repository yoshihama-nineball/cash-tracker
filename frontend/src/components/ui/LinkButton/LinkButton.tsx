"use client";
import { Typography, TypographyProps } from "@mui/material";
import Link from "next/link";
import { ReactNode } from "react";

interface LinkButtonProps extends Omit<TypographyProps, "href"> {
  href: string;
  children: ReactNode;
}

const LinkButton = ({ href, children, ...props }: LinkButtonProps) => {
  return (
    <Link href={href} passHref style={{ textDecoration: "none" }}>
      <Typography
        sx={{
          py: 1,
          px: 2,
          width: "100%",
          textAlign: "center",
          borderRadius: 1,
          color: "neutral.main",
          transition: "background-color 0.3s",
          "&:hover": {
            color: "neutral.dark",
          },
          cursor: "pointer",
          display: "block",
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Typography>
    </Link>
  );
};

export default LinkButton;
