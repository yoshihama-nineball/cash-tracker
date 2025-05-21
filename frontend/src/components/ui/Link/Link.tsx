// components/ui/Link/Link.tsx
import { LinkProps as MuiLinkProps } from "@mui/material";
import NextLink from "next/link";
import React from "react";

interface CustomLinkProps extends MuiLinkProps {
  href: string;
}

// React 19対応のLinkコンポーネント
const Link: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  // legacyBehaviorとpassHrefを削除
  return (
    <NextLink href={href} style={{ textDecoration: "none" }}>
      {/* MuiLinkではなくコンテンツを直接レンダリング */}
      {children}
    </NextLink>
  );
};

export default Link;
