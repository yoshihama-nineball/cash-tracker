// components/layouts/Header.tsx
"use client";

import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
        >
          キャッシュトラッカー
        </Typography>
        
        <Button 
          color="inherit" 
          component={Link} 
          href="/budgets"
          sx={{
            mx: 1,
            ...(pathname === '/budgets' ? { 
              borderBottom: '2px solid white',
              borderRadius: 0,
            } : {})
          }}
        >
          予算管理
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          href="/expenses"
          sx={{
            mx: 1,
            ...(pathname === '/expenses' ? { 
              borderBottom: '2px solid white',
              borderRadius: 0,
            } : {})
          }}
        >
          支出管理
        </Button>
        
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLoginToggle}>
            ログアウト
          </Button>
        ) : (
          <Button color="inherit" onClick={handleLoginToggle}>
            ログイン
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}