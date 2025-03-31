import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import NextLink from "next/link";
import React from "react";

interface CustomLinkProps extends MuiLinkProps {
  href: string;
}

const Link: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <MuiLink
        {...props}
        sx={{
          textDecoration: "none",
          color: "neutral.main",
          "&:hover": {
            color: "neutral.dark",
          },
          ...props.sx,
        }}
      >
        {children}
      </MuiLink>
    </NextLink>
  );
};

export default Link;
