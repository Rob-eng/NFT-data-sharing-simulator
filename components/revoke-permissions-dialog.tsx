"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Unlock, Edit, X } from "lucide-react"
import type { Entity } from "@/types"

interface RevokePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  entities: Entity[]
  onRevoke: (entityId: string, type: "read" | "write") => void
}

export function RevokePermissionsDialog({ open, onOpenChange, entities, onRevoke }: RevokePermissionsDialogProps) {
  const entitiesWithPermissions = entities.filter((e) => e.permissions.read || e.permissions.write)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões</DialogTitle>
          <DialogDescription>Visualize e revogue permissões de acesso das entidades</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {entitiesWithPermissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhuma entidade com permissões</div>
          ) : (
            entitiesWithPermissions.map((entity) => (
              <div key={entity.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{entity.name}</h4>
                  <div className="flex gap-1">
                    {entity.permissions.read && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Unlock className="h-3 w-3" />
                        Leitura
                      </Badge>
                    )}
                    {entity.permissions.write && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Edit className="h-3 w-3" />
                        Escrita
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {entity.permissions.read && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        onRevoke(entity.id, "read")
                      }}
                      className="gap-2 flex-1"
                    >
                      <X className="h-3 w-3" />
                      Revogar Leitura
                    </Button>
                  )}
                  {entity.permissions.write && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        onRevoke(entity.id, "write")
                      }}
                      className="gap-2 flex-1"
                    >
                      <X className="h-3 w-3" />
                      Revogar Escrita
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
