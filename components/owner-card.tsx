"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, Crown, Edit, Bell, Eye, Send } from "lucide-react"
import { KeysDialog } from "@/components/keys-dialog"
import { WriteDataDialog } from "@/components/write-data-dialog"
import { PermissionRequestsDialog } from "@/components/permission-requests-dialog"
import { RevokePermissionsDialog } from "@/components/revoke-permissions-dialog"
import { ViewAllDataDialog } from "@/components/view-all-data-dialog"
import type { Entity, PermissionRequest } from "@/types"

interface OwnerCardProps {
  entity: Entity
  entities: Entity[]
  pendingRequests: PermissionRequest[]
  onGrantPermission: (requestId: string, granted: boolean) => void
  onRevokePermission: (entityId: string, type: "read" | "write") => void
  onWriteData: (entityId: string, data: any) => void
  onTransferNFT: () => void
}

export function OwnerCard({
  entity,
  entities,
  pendingRequests,
  onGrantPermission,
  onRevokePermission,
  onWriteData,
  onTransferNFT,
}: OwnerCardProps) {
  const [showKeys, setShowKeys] = useState(false)
  const [showWriteData, setShowWriteData] = useState(false)
  const [showRequests, setShowRequests] = useState(false)
  const [showRevoke, setShowRevoke] = useState(false)
  const [showAllData, setShowAllData] = useState(false)

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border-2 border-owner bg-gradient-to-br from-owner/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Crown className="h-5 w-5 text-owner" />
              Proprietário: {entity.name}
            </CardTitle>
            <Badge className="bg-owner text-owner-foreground">Proprietário</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Data Display */}
          {entity.data && (
            <div className="space-y-2 p-3 bg-owner/10 rounded-lg border border-owner/20">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Título:</span>
                  <span className="text-foreground font-medium">{entity.data.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descrição:</span>
                  <span className="text-foreground text-xs">{entity.data.description.slice(0, 20)}...</span>
                </div>
                {Object.entries(entity.data.metadata)
                  .slice(-1)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="text-foreground">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowKeys(true)} className="gap-2">
              <Key className="h-4 w-4" />
              Chaves
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowRequests(true)} className="gap-2 relative">
              <Bell className="h-4 w-4" />
              Solicitações
              {pendingRequests.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground">
                  {pendingRequests.length}
                </Badge>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowRevoke(true)} className="gap-2 col-span-2">
              Gerenciar Permissões
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowAllData(true)} className="gap-2 col-span-2">
              <Eye className="h-4 w-4" />
              Ver Todos os Dados
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onTransferNFT}
              className="gap-2 col-span-2 border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 bg-transparent"
            >
              <Send className="h-4 w-4" />
              Transferir NFT
            </Button>

            <Button
              size="sm"
              onClick={() => setShowWriteData(true)}
              className="gap-2 col-span-2 bg-owner hover:bg-owner/90 text-owner-foreground"
            >
              <Edit className="h-4 w-4" />
              Adicionar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      <KeysDialog open={showKeys} onOpenChange={setShowKeys} entity={entity} />

      <WriteDataDialog
        open={showWriteData}
        onOpenChange={setShowWriteData}
        onSubmit={(data) => onWriteData(entity.id, data)}
      />

      <PermissionRequestsDialog
        open={showRequests}
        onOpenChange={setShowRequests}
        requests={pendingRequests}
        onGrant={onGrantPermission}
      />

      <RevokePermissionsDialog
        open={showRevoke}
        onOpenChange={setShowRevoke}
        entities={entities}
        onRevoke={onRevokePermission}
      />

      <ViewAllDataDialog open={showAllData} onOpenChange={setShowAllData} data={entity.data} canRead={true} />
    </>
  )
}
