// components/RiskFormModal.jsx
import ModalWrapper from "@/components/ModalWrapper";

export default function RiskFormModal({ isOpen, onClose, children }) {
  return (
    <>
      <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add New Risk">
        {children}
      </ModalWrapper>
    </>
  );
}