import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink } from "lucide-react"
import type { TimelineEvent } from "@/types"

interface TimelineProps {
  events: TimelineEvent[]
}

export function Timeline({ events }: TimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Linha do Tempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-primary" />
                {index < events.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
              </div>

              <div className="flex-1 space-y-1 pt-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{event.action}</Badge>
                    <span className="text-sm font-medium text-foreground">{event.entityName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{event.timestamp.toLocaleTimeString("pt-BR")}</span>
                </div>

                <p className="text-sm text-muted-foreground">{event.description}</p>

                {event.txHash && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
                  >
                    Ver transação <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
