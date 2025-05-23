import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose
} from "../components/ui/dialog";

const CustomModal = ({ modalSrc, handleModalClose }) => {
  const isOpen = Boolean(modalSrc);

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleModalClose(); }}>
      <DialogContent className="max-w-3xl p-0">
        <DialogClose asChild>
          <button
            aria-label="Close"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </DialogClose>
        {modalSrc && (
          <img src={modalSrc} alt="Full view" className="w-full h-auto rounded" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
