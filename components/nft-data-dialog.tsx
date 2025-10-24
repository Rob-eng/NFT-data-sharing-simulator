"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { NFTData } from "@/types"

interface NFTDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: NFTData
}

export function NFTDataDialog({ open, onOpenChange, data }: NFTDataDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Dados Completos da NFT</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Título</h4>
              <p className="text-foreground">{data.title}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Descrição</h4>
              <p className="text-foreground">{data.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Proprietário Atual</h4>
              <Badge variant="secondary">{data.currentOwner}</Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Metadados</h4>
              <div className="space-y-2">
                {Object.entries(data.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium text-sm">{key}:</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Hash da Transação</h4>
              <p className="text-xs font-mono text-foreground break-all">{data.txHash}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Data de Criação</h4>
              <p className="text-sm text-foreground">{new Date(data.createdAt).toLocaleString()}</p>
            </div>

            {data.ownerHistory.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Histórico de Proprietários</h4>
                <div className="space-y-2">
                  {data.ownerHistory.map((owner, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">Proprietário {index + 1}:</span>
                        <span className="text-sm">{owner.ownerName}</span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground break-all">Chave: {owner.publicKey}</div>
                      <div className="text-xs text-muted-foreground">
                        Transferido em: {new Date(owner.transferredAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
