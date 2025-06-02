"use client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { User } from "../../../libs/schemas/auth";
import ProfileForm from "./ProfileForm";

interface ProfileTabsProps {
  profile: User;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProfileTabs({ profile }: ProfileTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Box
        sx={{
          maxWidth: "500px",
          width: "100%",
          mt: 4,
        }}
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          ユーザ情報
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 4 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="ユーザ設定" {...a11yProps(0)} />
            <Tab label="パスワード設定" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <ProfileForm profile={profile} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          ここにパスワード設定のフォームを追加する
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
