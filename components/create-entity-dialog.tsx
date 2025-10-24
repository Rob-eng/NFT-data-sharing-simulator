"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CreateEntityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateEntity: (name: string) => void
}

export function CreateEntityDialog({ open, onOpenChange, onCreateEntity }: CreateEntityDialogProps) {
  const [name, setName] = useState("")

  const handleCreate = () => {
    if (!name) return
    onCreateEntity(name)
    setName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Sistema</DialogTitle>
          <DialogDescription>Crie um novo sistema para compartilhar dados da NFT</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">Nome do Sistema</Label>
            <Input id="entityName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Sistema A" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!name}>
            Criar Sistema
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
