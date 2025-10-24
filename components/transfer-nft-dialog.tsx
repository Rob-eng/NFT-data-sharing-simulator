"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Plus } from "lucide-react"
import type { PotentialOwner } from "@/types"

interface TransferNFTDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  potentialOwners: PotentialOwner[]
  onTransfer: (ownerId: string) => void
  onGenerateOwner: () => void
}

export function TransferNFTDialog({
  open,
  onOpenChange,
  potentialOwners,
  onTransfer,
  onGenerateOwner,
}: TransferNFTDialogProps) {
  const [selectedOwner, setSelectedOwner] = useState<string>("")

  const handleTransfer = () => {
    if (!selectedOwner) {
      alert("Por favor, selecione um proprietário")
      return
    }
    onTransfer(selectedOwner)
    onOpenChange(false)
    setSelectedOwner("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Transferir NFT
          </DialogTitle>
          <DialogDescription>Selecione o novo proprietário para transferir a NFT</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Novo Proprietário</Label>
            <Select value={selectedOwner} onValueChange={setSelectedOwner}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um proprietário" />
              </SelectTrigger>
              <SelectContent>
                {potentialOwners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id}>
                    {owner.name} ({owner.publicKey.slice(0, 8)}...)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={onGenerateOwner} className="w-full gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Gerar Nova Carteira de Proprietário
          </Button>

          <Button onClick={handleTransfer} className="w-full gap-2" disabled={!selectedOwner}>
            <Send className="h-4 w-4" />
            Transferir NFT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
