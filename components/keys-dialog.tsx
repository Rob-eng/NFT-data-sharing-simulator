"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Entity } from "@/types"

interface KeysDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entity: Entity
}

export function KeysDialog({ open, onOpenChange, entity }: KeysDialogProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chaves da Carteira</DialogTitle>
          <DialogDescription>Chaves públicas e privadas de {entity.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="publicKey">Chave Pública</Label>
            <div className="flex gap-2">
              <Input id="publicKey" value={entity.publicKey} readOnly className="font-mono text-xs" />
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(entity.publicKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="privateKey">Chave Privada</Label>
            <div className="flex gap-2">
              <Input id="privateKey" value={entity.privateKey} readOnly className="font-mono text-xs" />
              <Button size="icon" variant="outline" onClick={() => copyToClipboard(entity.privateKey)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">⚠️ Nunca compartilhe sua chave privada</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
