import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import NextLink from "next/link";
import React from "react";

interface CustomLinkProps extends MuiLinkProps {
  href: string;
}

const Link: React.FC<CustomLinkProps> = ({ href, children, ...props }) => {
  // passHrefを含む不要なpropsを取り除く
  const { passHref, ...muiLinkProps } = props;

  return (
    <NextLink href={href} legacyBehavior passHref>
      <MuiLink
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
