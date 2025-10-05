import "../../styles/components/feedback/Modal.css";

export default function Modal({
  open,
  title = "Mensaje",
  children,
  onClose,
  actions
}) {
  if (!open) return null;

  function handleBackdropClick() {
    onClose?.();
  }
  function stop(e) {
    e.stopPropagation();
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={stop}
      >
        <h3 id="modal-title" className="modal__title">{title}</h3>

        <div className="modal__body">{children}</div>

        <div className="modal__actions">
          {actions ?? (
            <button type="button" onClick={onClose} className="modal__btn">
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}