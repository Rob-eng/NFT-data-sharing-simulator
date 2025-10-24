"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Key, Download, Unlock, Edit, RefreshCw, Eye } from "lucide-react"
import { KeysDialog } from "@/components/keys-dialog"
import { WriteDataDialog } from "@/components/write-data-dialog"
import { ViewAllDataDialog } from "@/components/view-all-data-dialog"
import { encryptData } from "@/lib/encryption"
import type { Entity } from "@/types"

interface EntityCardProps {
  entity: Entity
  nftExists: boolean
  onLoadData: (entityId: string) => void
  onRequestPermission: (entityId: string, type: "read" | "write") => void
  onWriteData: (entityId: string, data: any) => void
}

export function EntityCard({ entity, nftExists, onLoadData, onRequestPermission, onWriteData }: EntityCardProps) {
  const [showKeys, setShowKeys] = useState(false)
  const [showWriteData, setShowWriteData] = useState(false)
  const [showAllData, setShowAllData] = useState(false)

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-bold text-foreground">{entity.name}</CardTitle>
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
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Data Display */}
          {entity.hasLoadedData && entity.data && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Título:</span>
                  <span className="text-foreground font-medium font-mono text-xs break-all">
                    {entity.permissions.read ? entity.data.title : encryptData(entity.data.title)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descrição:</span>
                  <span className="text-foreground text-xs font-mono break-all">
                    {entity.permissions.read
                      ? entity.data.description.slice(0, 20) + "..."
                      : encryptData(entity.data.description).slice(0, 30) + "..."}
                  </span>
                </div>
                {Object.entries(entity.data.metadata)
                  .slice(-1)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="text-foreground font-mono text-xs break-all">
                        {entity.permissions.read ? value : encryptData(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {!entity.hasLoadedData && (
            <div className="text-center py-6 text-muted-foreground text-sm">Nenhum dado carregado</div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowKeys(true)} className="gap-2">
              <Key className="h-4 w-4" />
              Chaves
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoadData(entity.id)}
              disabled={!nftExists || entity.hasLoadedData}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Carregar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onRequestPermission(entity.id, "read")}
              disabled={entity.permissions.read}
              className="gap-2"
            >
              <Unlock className="h-4 w-4" />
              Ler
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onRequestPermission(entity.id, "write")}
              disabled={entity.permissions.write}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              Escrever
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoadData(entity.id)}
              disabled={!entity.hasLoadedData}
              className="gap-2 col-span-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar Dados
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllData(true)}
              disabled={!entity.hasLoadedData}
              className="gap-2 col-span-2"
            >
              <Eye className="h-4 w-4" />
              Ver Todos os Dados
            </Button>

            <Button
              size="sm"
              onClick={() => setShowWriteData(true)}
              disabled={!entity.permissions.write}
              className="gap-2 col-span-2"
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

      <ViewAllDataDialog
        open={showAllData}
        onOpenChange={setShowAllData}
        data={entity.data}
        canRead={entity.permissions.read}
      />
    </>
  )
}
