"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import type { PermissionRequest } from "@/types"

interface PermissionRequestsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requests: PermissionRequest[]
  onGrant: (requestId: string, granted: boolean) => void
}

export function PermissionRequestsDialog({ open, onOpenChange, requests, onGrant }: PermissionRequestsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitações de Permissão</DialogTitle>
          <DialogDescription>Gerencie as solicitações de acesso às suas NFTs</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma solicitação pendente</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{request.entityName}</span>
                    <Badge variant="secondary">{request.type === "read" ? "Leitura" : "Escrita"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{request.timestamp.toLocaleString("pt-BR")}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onGrant(request.id, true)} className="gap-1">
                    <Check className="h-4 w-4" />
                    Conceder
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onGrant(request.id, false)} className="gap-1">
                    <X className="h-4 w-4" />
                    Negar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
