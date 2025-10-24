"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { encryptData } from "@/lib/encryption"
import type { NFTData } from "@/types"

interface ViewAllDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: NFTData | null
  canRead: boolean
}

export function ViewAllDataDialog({ open, onOpenChange, data, canRead }: ViewAllDataDialogProps) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Todos os Dados da NFT</DialogTitle>
          <DialogDescription>Visualização completa de todos os dados armazenados</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">Título</div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-foreground font-medium font-mono text-xs break-all">
                  {canRead ? data.title : encryptData(data.title)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">Descrição</div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-foreground font-mono text-xs break-all">
                  {canRead ? data.description : encryptData(data.description)}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">Metadados</div>
              <div className="space-y-2">
                {Object.entries(data.metadata).map(([key, value], index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground font-medium">{key}:</span>
                      <span className="text-foreground font-mono text-xs break-all">
                        {canRead ? value : encryptData(value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {data.ownerHistory && data.ownerHistory.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground">Histórico de Proprietários</div>
                <div className="space-y-2">
                  {data.ownerHistory.map((owner, index) => (
                    <div key={index} className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Nome:</span>
                          <span className="text-foreground font-medium">{owner.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Chave Pública:</span>
                          <span className="text-foreground font-mono text-xs">{owner.publicKey.slice(0, 12)}...</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transferido em:</span>
                          <span className="text-foreground text-xs">
                            {new Date(owner.transferredAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TX Hash:</span>
                          <span className="text-foreground font-mono text-xs">{owner.txHash.slice(0, 16)}...</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transaction Hash */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">Hash da Transação</div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-foreground font-mono break-all">{data.txHash}</p>
              </div>
            </div>

            {/* Created At */}
            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground">Criado em</div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-foreground">{new Date(data.createdAt).toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
