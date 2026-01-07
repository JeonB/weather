'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { FavoriteLocation } from '@shared/lib/storage';

interface EditFavoriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorite: FavoriteLocation;
  onSave: (alias: string | null) => void;
}

export function EditFavoriteDialog({
  open,
  onOpenChange,
  favorite,
  onSave,
}: EditFavoriteDialogProps) {
  const [alias, setAlias] = useState(favorite.alias || '');

  useEffect(() => {
    if (open) {
      setAlias(favorite.alias || '');
    }
  }, [open, favorite.alias]);

  const handleSave = () => {
    const trimmedAlias = alias.trim();
    onSave(trimmedAlias.length > 0 ? trimmedAlias : null);
  };

  const handleReset = () => {
    setAlias('');
    onSave(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>장소 별칭 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">원래 이름</label>
            <p className="text-sm font-medium">{favorite.displayName}</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="alias-input" className="text-sm text-muted-foreground">
              별칭 (선택사항)
            </label>
            <Input
              id="alias-input"
              name="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="별칭을 입력하세요"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              별칭을 설정하면 카드에 원래 이름 대신 별칭이 표시됩니다
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleReset}>
            원래대로
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

