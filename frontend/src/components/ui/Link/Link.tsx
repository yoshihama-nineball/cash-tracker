import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import NextLink from "next/link";
import React from "react";

interface CustomLinkProps extends MuiLinkProps {
  href: string;
}

const Link: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  // MuiLinkに渡すprops - passHrefなどのNextLink固有のpropsを除外
  const muiLinkProps = { ...props };

  return (
    <NextLink href={href} passHref legacyBehavior>
      {/* as="a"を追加してDOM要素として明示的にマークする */}
      <MuiLink
        component="a"
        {...muiLinkProps}
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
