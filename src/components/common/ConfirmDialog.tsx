import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Dialog from './Dialog';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false
}) => {
  const typeStyles = {
    danger: {
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const styles = typeStyles[type];

  return (
  <Dialog isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
    <div className="space-y-5 font-serif text-gray-800">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-yellow-600" />
        <p className="text-base">{message}</p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </div>
    </div>
  </Dialog>
);

};

export default ConfirmDialog;