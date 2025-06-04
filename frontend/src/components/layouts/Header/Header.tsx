"use client";

import Button from "@/components/ui/Button/Button";
import Link from "@/components/ui/Link/Link";
import { AppBar, Avatar, Box, Menu, MenuItem, Toolbar } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { logout } from "../../../../actions/logout-user-action";
import { UserSchemaFormValues } from "../../../../libs/schemas/auth";

interface HeaderProps {
  userData?: {
    user: UserSchemaFormValues | null;
    isAuth: boolean;
  } | null;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  if (!name.includes(" ")) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: name.length > 0 ? name[0] : "",
    };
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export default function Header({ userData }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 早期リターン：未認証の場合
  if (!userData?.user || !userData.isAuth) {
    return (
      <AppBar position="static" color="inherit">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "neutral",
                }}
              >
                <Image
                  src="/icon.png"
                  alt="ロゴ"
                  width={35}
                  height={35}
                  priority
                />
              </Link>
            </Box>
          </Box>

          <Button color="primary" href="/auth/login">
            ログイン
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  const user = userData.user;

  return (
    <AppBar position="static" color="inherit">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
            <Link
              href="/admin/budgets"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "neutral",
              }}
            >
              <Image
                src="/icon.png"
                alt="ロゴ"
                width={35}
                height={35}
                priority
              />
            </Link>
          </Box>
        </Box>

        <div>
          <Avatar onClick={handleMenu} {...stringAvatar(user.name)} />
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>{user.name}</MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/admin/profile/settings">プロフィール</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link href="/admin/budgets">予算</Link>
            </MenuItem>
            <MenuItem
              onClick={async () => {
                handleClose();
                await logout();
              }}
            >
              ログアウト
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}
