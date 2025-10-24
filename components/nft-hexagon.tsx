"use client"

import { useState } from "react"
import { Hexagon, Unlock, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NFTDataDialog } from "@/components/nft-data-dialog"
import type { NFTData } from "@/types"

interface NFTHexagonProps {
  data: NFTData
}

export function NFTHexagon({ data }: NFTHexagonProps) {
  const [showFullData, setShowFullData] = useState(false)

  return (
    <>
      <div className="relative">
        <div className="nft-glow bg-gradient-to-br from-primary to-accent p-1 rounded-2xl">
          <div className="bg-card rounded-2xl p-6 min-w-[280px]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Hexagon className="h-20 w-20 text-primary fill-primary/10" strokeWidth={1.5} />
                <Unlock className="h-8 w-8 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              <div className="text-center space-y-2 w-full">
                <h3 className="font-bold text-lg text-foreground">{data.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{data.description}</p>
              </div>

              <div className="w-full pt-2 border-t border-border">
                <ScrollArea className="h-[200px] w-full">
                  <div className="space-y-2 pr-4">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="text-accent font-medium">Ativa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rede:</span>
                        <span className="text-foreground font-mono">Stellar</span>
                      </div>
                    </div>

                    {Object.entries(data.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs gap-2">
                        <span className="text-muted-foreground flex-shrink-0">{key}:</span>
                        <span className="text-foreground font-medium text-right break-all">{value}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowFullData(true)} className="w-full gap-2 mt-2">
                <Maximize2 className="h-4 w-4" />
                Ver Todos os Dados
              </Button>

              {data.txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${data.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-mono truncate w-full text-center"
                >
                  TX: {data.txHash.slice(0, 8)}...{data.txHash.slice(-8)}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <NFTDataDialog open={showFullData} onOpenChange={setShowFullData} data={data} />
    </>
  )
}
