"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"

interface GenerateOwnerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (name: string) => void
}

export function GenerateOwnerDialog({ open, onOpenChange, onGenerate }: GenerateOwnerDialogProps) {
  const [ownerName, setOwnerName] = useState("")

  const handleGenerate = () => {
    if (!ownerName.trim()) {
      alert("Por favor, insira um nome")
      return
    }
    onGenerate(ownerName)
    setOwnerName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Gerar Carteira de Proprietário
          </DialogTitle>
          <DialogDescription>Crie uma nova carteira para um potencial proprietário da NFT</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do Proprietário</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>

          <Button onClick={handleGenerate} className="w-full gap-2">
            <UserPlus className="h-4 w-4" />
            Gerar Carteira
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
