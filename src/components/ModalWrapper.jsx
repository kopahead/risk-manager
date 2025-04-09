import { Dialog } from '@headlessui/react';

export default function ModalWrapper({ isOpen, onClose, title, children }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">{title}</Dialog.Title>
          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
