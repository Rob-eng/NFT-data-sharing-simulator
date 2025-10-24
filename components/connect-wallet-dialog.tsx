"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Key } from "lucide-react"
import { generateWalletKeys } from "@/lib/encryption"

interface ConnectWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnect: (wallet: { address: string; publicKey: string; privateKey: string; ownerName: string }) => void
}

export function ConnectWalletDialog({ open, onOpenChange, onConnect }: ConnectWalletDialogProps) {
  const [walletAddress, setWalletAddress] = useState("")
  const [ownerName, setOwnerName] = useState("")

  const handleGenerateWallet = () => {
    const keys = generateWalletKeys()
    const address = keys.publicKey.slice(0, 12)
    setWalletAddress(address)
  }

  const handleConnect = () => {
    if (!walletAddress) {
      alert("Por favor, gere uma carteira primeiro")
      return
    }

    if (!ownerName.trim()) {
      alert("Por favor, insira um nome de proprietário")
      return
    }

    const keys = generateWalletKeys()
    onConnect({
      address: walletAddress,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      ownerName: ownerName.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Conectar Carteira
          </DialogTitle>
          <DialogDescription>Gere uma carteira e defina seu nome como proprietário da NFT</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Nome do Proprietário *</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Endereço da Carteira</Label>
            <div className="flex gap-2">
              <Input id="wallet" value={walletAddress} readOnly placeholder="Clique em gerar" />
              <Button type="button" variant="outline" onClick={handleGenerateWallet} className="gap-2 bg-transparent">
                <Key className="h-4 w-4" />
                Gerar
              </Button>
            </div>
          </div>

          <Button onClick={handleConnect} className="w-full gap-2" disabled={!walletAddress || !ownerName.trim()}>
            <Wallet className="h-4 w-4" />
            Conectar Carteira
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
