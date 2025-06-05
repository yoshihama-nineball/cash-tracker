import { LinkProps as MuiLinkProps } from "@mui/material";
import NextLink from "next/link";
import React from "react";

interface CustomLinkProps extends MuiLinkProps {
  href: string;
}
const Link: React.FC<CustomLinkProps> = ({ href, children }) => {
  return (
    <NextLink href={href} style={{ textDecoration: "none" }}>
      {children}
    </NextLink>
  );
};

export default Link;
