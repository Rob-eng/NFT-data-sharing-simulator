"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Key, Eye, History } from "lucide-react"
import { KeysDialog } from "@/components/keys-dialog"
import { ViewAllDataDialog } from "@/components/view-all-data-dialog"
import type { Entity } from "@/types"

interface PreviousOwnerCardProps {
  entity: Entity
}

export function PreviousOwnerCard({ entity }: PreviousOwnerCardProps) {
  const [showKeys, setShowKeys] = useState(false)
  const [showAllData, setShowAllData] = useState(false)

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow border-2 border-amber-500 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-amber-500" />
              {entity.name}
            </CardTitle>
            <Badge className="bg-amber-500 text-white">Ex-Proprietário</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Data Display */}
          {entity.data && (
            <div className="space-y-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
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

          {/* Action Buttons - Limited for previous owners */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowKeys(true)} className="gap-2">
              <Key className="h-4 w-4" />
              Chaves
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowAllData(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              Ver Dados
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Ex-proprietários têm acesso somente leitura permanente
          </p>
        </CardContent>
      </Card>

      <KeysDialog open={showKeys} onOpenChange={setShowKeys} entity={entity} />

      <ViewAllDataDialog open={showAllData} onOpenChange={setShowAllData} data={entity.data} canRead={true} />
    </>
  )
}
