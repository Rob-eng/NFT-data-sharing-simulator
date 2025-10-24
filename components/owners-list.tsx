"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Key, Trash2 } from "lucide-react"
import type { PotentialOwner } from "@/types"

interface OwnersListProps {
  owners: PotentialOwner[]
  onRemove: (id: string) => void
}

export function OwnersList({ owners, onRemove }: OwnersListProps) {
  if (owners.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Nenhum proprietário cadastrado ainda.
            <br />
            Gere proprietários para poder transferir a NFT.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {owners.map((owner) => (
        <Card key={owner.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{owner.name}</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onRemove(owner.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <CardDescription>Proprietário Potencial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-mono text-muted-foreground">{owner.publicKey.slice(0, 16)}...</span>
              </div>
              <Badge variant="secondary" className="w-full justify-center">
                Disponível para Transferência
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
