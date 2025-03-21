"use client";

import Button from "@/components/ui/Button/Button";
import { AppBar, Box, Tab, Tabs, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [value, setValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };
  return (
    <AppBar position="static" color="inherit">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton> */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 3 }}>
            <Link
              href="/"
              passHref
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

          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              "& .MuiTab-root": {
                color: "neutral.main",
                "&.Mui-selected": {
                  color: "primary.main",
                },
              },
            }}
          >
            <Tab component={Link} href="/" label="Home" {...a11yProps(0)} />
            <Tab
              component={Link}
              href="/budgets"
              label="予算管理"
              {...a11yProps(1)}
            />
            <Tab
              component={Link}
              href="/expenses"
              label="支出監理"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        {isLoggedIn ? (
          <Button color="primary" onClick={handleLoginToggle}>
            ログアウト
          </Button>
        ) : (
          <Button
            color="primary"
            href="/auth/login"
            onClick={handleLoginToggle}
          >
            ログイン
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
