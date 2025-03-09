import React from "react";

interface ConfirmationI {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirmation: React.FC<ConfirmationI> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed w-full h-full inset-0 flex items-center justify-center bg-opacity-10">
      <div className="text-yellow-400 p-6 rounded-lg shadow-lg w-80 bg-gray-800">
        <h3 className="text-lg  font-semibold mb-4">{message}</h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gray-900 text-white rounded-md "
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
