"use client";
import { Dialog, Slide, useMediaQuery, useTheme } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMessage } from "context/MessageContext";
import React, { useState, useTransition } from "react";
import Button from "../ui/Button/Button";

type ActionStateType = {
  errors: string[];
  success: string;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateExpenseForm = () => {
  const [open, setOpen] = useState(false);
  const [ifPending, startTransition] = useTransition();
  const { showMessage } = useMessage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const [form]

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        sx={{
          bgcolor: "#8e8edb",
          color: "white",
          borderRadius: 4,
          py: 1,
          px: 3,
          "&:hover": { bgcolor: "#7070c0" },
        }}
        onClick={handleClickOpen}
      >
        新規支出作成
      </Button>
      　
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            width: "100%",
            maxwidth: isMobile ? "90%" : "400px",
            minWidth: isMobile ? "300px" : "400px",
          },
        }}
      ></Dialog>
    </>
  );
};

export default CreateExpenseForm;
