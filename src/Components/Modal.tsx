import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type ModalProps = {
  modalTexBody: any;
  modalTextHeader: string;
  isOpen: boolean;
  handleClose: any;
};

export default function BasicModal({ text }: { text: ModalProps }) {
  return (
    <div>
      <Modal
        open={text.isOpen}
        onClose={text.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {text.modalTextHeader}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {text.modalTexBody}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
