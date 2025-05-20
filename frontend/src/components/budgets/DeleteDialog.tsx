"use client";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import * as React from "react";

interface DeleteDialogProps {
  isMobile: boolean;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteDialog = ({ isMobile }: DeleteDialogProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        startIcon={<DeleteIcon />}
        color="error"
        size="small"
        sx={{
          minWidth: isMobile ? "40px" : "80px",
          whiteSpace: "nowrap",
        }}
        variant="contained"
        onClick={handleClickOpen}
      >
        削除
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: isMobile ? "90%" : "400px",
            minWidth: isMobile ? "300px" : "400px",
          },
        }}
      >
        <DialogTitle>{"この予算を削除しますか？"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            予算は完全に削除されます
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={handleClose}>削除削除</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DeleteDialog;
