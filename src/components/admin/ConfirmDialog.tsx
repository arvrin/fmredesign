'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DashboardButton as Button } from '@/design-system';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent showCloseButton={false} className="max-w-[calc(100%-2rem)] sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-fm-neutral-900">{title}</DialogTitle>
          <DialogDescription className="text-fm-neutral-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex-col-reverse gap-2 sm:flex-row">
          <Button variant="outline" size="sm" onClick={onCancel} fullWidth className="sm:w-auto">
            Cancel
          </Button>
          <Button
            variant={variant === 'destructive' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            fullWidth
            className="sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
