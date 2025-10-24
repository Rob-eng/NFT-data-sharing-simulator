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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { NFTData } from "@/types"

interface CreateNFTDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateNFT: (data: NFTData) => void
  ownerName: string
}

export function CreateNFTDialog({ open, onOpenChange, onCreateNFT, ownerName }: CreateNFTDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [metadataKey, setMetadataKey] = useState("")
  const [metadataValue, setMetadataValue] = useState("")
  const [metadata, setMetadata] = useState<Record<string, string>>({})

  const handleAddMetadata = () => {
    if (metadataKey && metadataValue) {
      setMetadata({ ...metadata, [metadataKey]: metadataValue })
      setMetadataKey("")
      setMetadataValue("")
    }
  }

  const handleCreate = () => {
    if (!title || !description) return

    const txHash =
      `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`.toUpperCase()

    const nftData: NFTData = {
      title,
      description,
      metadata,
      txHash,
      createdAt: new Date(),
      currentOwner: ownerName,
      ownerHistory: [],
    }

    onCreateNFT(nftData)

    // Reset form
    setTitle("")
    setDescription("")
    setMetadata({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar NFT na Stellar</DialogTitle>
          <DialogDescription>Crie uma nova NFT com dados iniciais na rede Stellar</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome da NFT" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da NFT"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Metadados</Label>
            <div className="flex gap-2">
              <Input value={metadataKey} onChange={(e) => setMetadataKey(e.target.value)} placeholder="Chave" />
              <Input value={metadataValue} onChange={(e) => setMetadataValue(e.target.value)} placeholder="Valor" />
              <Button onClick={handleAddMetadata} variant="outline">
                Adicionar
              </Button>
            </div>
            {Object.entries(metadata).length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="text-sm flex justify-between p-2 bg-muted rounded">
                    <span className="font-medium">{key}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title || !description}>
            Criar NFT
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
