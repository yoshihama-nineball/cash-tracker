"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useMessage } from "context/MessageContext";
import { DraftBudgetFormValues, DraftBudgetSchema } from "libs/schemas/auth";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button/Button";

interface AuthResponse {
  errors: string[];
  success: string;
}

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
  const [isPending, startTransition] = useTransition();
  const { showMessage } = useMessage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const [formState, dispatch] = useActionState<AuthResponse, FormData>(
  //   createExpense,
  //   {
  //     errors: [],
  //     success: "",
  //   },
  // );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<DraftBudgetFormValues>({
    resolver: zodResolver(DraftBudgetSchema),
    defaultValues: {
      name: "",
      amount: 0,
    },
  });

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
            maxWidth: isMobile ? "90%" : "400px", // maxwidth → maxWidth (大文字小文字の修正)
            minWidth: isMobile ? "300px" : "400px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          支出の追加
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              mt: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="name">タイトル</FormLabel>
              <TextField
                id="name"
                type="text"
                placeholder="タイトルを入力"
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="amount">金額</FormLabel>
              <TextField
                id="amount"
                type="number"
                placeholder="金額"
                fullWidth
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
              }}
              disabled={isSubmitting || isPending}
            >
              {isSubmitting || isPending ? "送信中..." : "追加"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateExpenseForm;
