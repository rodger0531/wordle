import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "../icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Wraps the native <dialog> element, which gives focus trapping, Escape to
 * close and an inert background for free.
 */
const Modal = ({ open, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-label={title}
      onClose={onClose}
      onClick={(event) => {
        // Clicks on the ::backdrop report the dialog itself as the target.
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal-panel">
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon className="icon" />
        </button>
        <h2 className="modal-title">{title}</h2>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
