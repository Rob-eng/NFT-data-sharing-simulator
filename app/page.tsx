"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { EntityCard } from "@/components/entity-card"
import { OwnerCard } from "@/components/owner-card"
import { PreviousOwnerCard } from "@/components/previous-owner-card"
import { NFTHexagon } from "@/components/nft-hexagon"
import { Timeline } from "@/components/timeline"
import { OwnersList } from "@/components/owners-list"
import { CreateNFTDialog } from "@/components/create-nft-dialog"
import { CreateEntityDialog } from "@/components/create-entity-dialog"
import { ConnectWalletDialog } from "@/components/connect-wallet-dialog"
import { TransferNFTDialog } from "@/components/transfer-nft-dialog"
import { GenerateOwnerDialog } from "@/components/generate-owner-dialog"
import { WelcomeDialog } from "@/components/welcome-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Hexagon, UserPlus, Database } from "lucide-react"
import { generateWalletKeys } from "@/lib/encryption"
import { translations } from "@/lib/translations"
import type {
  Entity,
  NFTData,
  TimelineEvent,
  PermissionRequest,
  ConnectedWallet,
  PotentialOwner,
  Language,
} from "@/types"

export default function Home() {
  const [language, setLanguage] = useState<Language>("pt")
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null)
  const [nftData, setNftData] = useState<NFTData | null>(null)
  const [entities, setEntities] = useState<Entity[]>([])
  const [previousOwners, setPreviousOwners] = useState<Entity[]>([])
  const [potentialOwners, setPotentialOwners] = useState<PotentialOwner[]>([])
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [pendingRequests, setPendingRequests] = useState<PermissionRequest[]>([])
  const [showConnectWallet, setShowConnectWallet] = useState(false)
  const [showCreateNFT, setShowCreateNFT] = useState(false)
  const [showCreateEntity, setShowCreateEntity] = useState(false)
  const [showTransferNFT, setShowTransferNFT] = useState(false)
  const [showGenerateOwner, setShowGenerateOwner] = useState(false)

  const t = translations[language]

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  const owner: Entity | null = connectedWallet
    ? {
        id: "owner",
        name: connectedWallet.ownerName || "Proprietário",
        publicKey: connectedWallet.publicKey,
        privateKey: connectedWallet.privateKey,
        permissions: { read: true, write: true },
        data: nftData,
        hasLoadedData: true,
      }
    : null

  const handleConnectWallet = (wallet: {
    address: string
    publicKey: string
    privateKey: string
    ownerName: string
  }) => {
    setConnectedWallet({
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      isConnected: true,
      ownerName: wallet.ownerName,
    })
    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: "Carteira Conectada",
      entityName: wallet.ownerName,
      description: `Carteira ${wallet.address} conectada com sucesso`,
    }
    setTimeline([event, ...timeline])
  }

  const handleCreateNFT = (data: NFTData) => {
    setNftData(data)
    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: "NFT Criada",
      entityName: "Proprietário",
      description: `NFT criada com dados iniciais: ${data.title}`,
      txHash: data.txHash,
    }
    setTimeline([event, ...timeline])
    setShowCreateNFT(false)
  }

  const handleCreateEntity = (name: string) => {
    if (entities.length >= 7) {
      alert("Máximo de 7 sistemas atingido")
      return
    }

    const keys = generateWalletKeys()
    const newEntity: Entity = {
      id: Date.now().toString(),
      name,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      permissions: { read: false, write: false },
      data: null,
      hasLoadedData: false,
    }

    setEntities([...entities, newEntity])
    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: "Sistema Criado",
      entityName: name,
      description: `Novo sistema "${name}" foi criado`,
    }
    setTimeline([event, ...timeline])
    setShowCreateEntity(false)
  }

  const handleGenerateOwner = (name: string) => {
    const keys = generateWalletKeys()
    const newOwner: PotentialOwner = {
      id: Date.now().toString(),
      name,
      publicKey: keys.publicKey,
    }
    setPotentialOwners([...potentialOwners, newOwner])
    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: "Carteira de Proprietário Gerada",
      entityName: name,
      description: `Nova carteira gerada para ${name}`,
    }
    setTimeline([event, ...timeline])
  }

  const handleTransferNFT = (ownerId: string) => {
    if (!nftData || !owner) return

    const newOwner = potentialOwners.find((o) => o.id === ownerId)
    if (!newOwner) return

    const txHash =
      `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`.toUpperCase()

    const transferTimestamp = new Date()

    const updatedNftData: NFTData = {
      ...nftData,
      currentOwner: newOwner.name,
      metadata: {
        ...nftData.metadata,
        [`proprietario_anterior_${nftData.ownerHistory.length + 1}`]: owner.name,
        [`chave_publica_anterior_${nftData.ownerHistory.length + 1}`]: owner.publicKey,
        [`data_transferencia_${nftData.ownerHistory.length + 1}`]: transferTimestamp.toISOString(),
        [`hash_transacao_${nftData.ownerHistory.length + 1}`]: txHash,
      },
      ownerHistory: [
        ...nftData.ownerHistory,
        {
          ownerName: owner.name,
          publicKey: owner.publicKey,
          transferredAt: transferTimestamp,
          txHash,
        },
      ],
    }

    const previousOwner: Entity = {
      ...owner,
      id: `prev-owner-${Date.now()}`,
      permissions: { read: true, write: false },
      data: updatedNftData,
      isPreviousOwner: true,
    }

    setPreviousOwners([...previousOwners, previousOwner])

    setNftData(updatedNftData)

    const keys = generateWalletKeys()
    setConnectedWallet({
      address: newOwner.publicKey.slice(0, 12),
      publicKey: newOwner.publicKey,
      privateKey: keys.privateKey,
      isConnected: true,
      ownerName: newOwner.name, // Preserving owner name
    })

    setPotentialOwners(potentialOwners.filter((o) => o.id !== ownerId))

    setEntities(
      entities.map((e) => ({
        ...e,
        permissions: { read: false, write: false },
      })),
    )

    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: transferTimestamp,
      action: "NFT Transferida",
      entityName: newOwner.name,
      description: `NFT transferida de ${owner.name} para ${newOwner.name}`,
      txHash,
    }
    setTimeline([event, ...timeline])
  }

  const handleLoadData = (entityId: string) => {
    setEntities(
      entities.map((entity) => (entity.id === entityId ? { ...entity, data: nftData, hasLoadedData: true } : entity)),
    )
  }

  const handleRequestPermission = (entityId: string, type: "read" | "write") => {
    const entity = entities.find((e) => e.id === entityId)
    if (!entity) return

    const request: PermissionRequest = {
      id: Date.now().toString(),
      entityId,
      entityName: entity.name,
      type,
      timestamp: new Date(),
    }

    setPendingRequests([...pendingRequests, request])
  }

  const handleGrantPermission = (requestId: string, granted: boolean) => {
    const request = pendingRequests.find((r) => r.id === requestId)
    if (!request) return

    if (granted) {
      setEntities(
        entities.map((entity) =>
          entity.id === request.entityId
            ? {
                ...entity,
                permissions: {
                  ...entity.permissions,
                  [request.type]: true,
                },
              }
            : entity,
        ),
      )

      const event: TimelineEvent = {
        id: Date.now().toString(),
        timestamp: new Date(),
        action: `Permissão ${request.type === "read" ? "Leitura" : "Escrita"} Concedida`,
        entityName: request.entityName,
        description: `Proprietário concedeu permissão de ${request.type === "read" ? "leitura" : "escrita"} para ${request.entityName}`,
      }
      setTimeline([event, ...timeline])
    }

    setPendingRequests(pendingRequests.filter((r) => r.id !== requestId))
  }

  const handleRevokePermission = (entityId: string, type: "read" | "write") => {
    const entity = entities.find((e) => e.id === entityId)
    if (!entity) return

    setEntities(
      entities.map((e) =>
        e.id === entityId
          ? {
              ...e,
              permissions: {
                ...e.permissions,
                [type]: false,
              },
            }
          : e,
      ),
    )

    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: `Permissão ${type === "read" ? "Leitura" : "Escrita"} Revogada`,
      entityName: entity.name,
      description: `Proprietário revogou permissão de ${type === "read" ? "leitura" : "escrita"} de ${entity.name}`,
    }
    setTimeline([event, ...timeline])
  }

  const handleWriteData = (entityId: string, newData: Partial<NFTData>) => {
    const entity = entityId === "owner" ? owner : entities.find((e) => e.id === entityId)
    if (!entity) return

    if (entityId !== "owner" && !entity.permissions.write) {
      alert("Sem permissão de escrita")
      return
    }

    const updatedData = {
      ...nftData!,
      ...newData,
      metadata: {
        ...nftData!.metadata,
        ...(newData.metadata || {}),
      },
    }
    setNftData(updatedData)

    const event: TimelineEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: "Dados Atualizados",
      entityName: entity.name,
      description: `${entity.name} adicionou novos dados à NFT`,
    }
    setTimeline([event, ...timeline])
  }

  const handleRemoveOwner = (ownerId: string) => {
    setPotentialOwners(potentialOwners.filter((o) => o.id !== ownerId))
  }

  return (
    <div className="min-h-screen bg-background">
      <WelcomeDialog language={language} />
      <Header
        connectedWallet={connectedWallet}
        onConnectWallet={() => setShowConnectWallet(true)}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeToggle={() => setTheme(theme === "light" ? "dark" : "light")}
      />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="nft" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="nft">{t.nftAndOwnerTab}</TabsTrigger>
            <TabsTrigger value="systems">{t.systemsTab}</TabsTrigger>
            <TabsTrigger value="owners">{t.ownersTab}</TabsTrigger>
            <TabsTrigger value="timeline">{t.timelineTab}</TabsTrigger>
          </TabsList>

          {/* Tab 1: NFT and Owner */}
          <TabsContent value="nft" className="space-y-6">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowCreateNFT(true)}
                disabled={!!nftData || !connectedWallet}
                size="lg"
                className="gap-2"
              >
                <Hexagon className="h-5 w-5" />
                {t.createNFT}
              </Button>
              <Button
                onClick={() => window.open('/nft-data-sharing', '_blank')}
                size="lg"
                variant="outline"
                className="gap-2"
              >
                <Database className="h-5 w-5" />
                Ver Contrato Real
              </Button>
            </div>

            {nftData && owner && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex items-center justify-center">
                  <NFTHexagon data={nftData} />
                </div>
                <OwnerCard
                  entity={owner}
                  entities={entities}
                  pendingRequests={pendingRequests}
                  onGrantPermission={handleGrantPermission}
                  onRevokePermission={handleRevokePermission}
                  onWriteData={handleWriteData}
                  onTransferNFT={() => setShowTransferNFT(true)}
                />
              </div>
            )}

            {!nftData && !connectedWallet && (
              <div className="text-center py-12 text-muted-foreground">Conecte uma carteira para começar</div>
            )}

            {!nftData && connectedWallet && (
              <div className="text-center py-12 text-muted-foreground">Crie uma NFT para começar</div>
            )}

            {previousOwners.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-foreground">Proprietários Anteriores</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {previousOwners.map((prevOwner) => (
                    <PreviousOwnerCard key={prevOwner.id} entity={prevOwner} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Systems */}
          <TabsContent value="systems" className="space-y-6">
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setShowCreateEntity(true)}
                disabled={!nftData || entities.length >= 7}
                size="lg"
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                {t.createEntity} ({entities.length}/7)
              </Button>
            </div>

            {entities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entities.map((entity) => (
                  <EntityCard
                    key={entity.id}
                    entity={entity}
                    nftExists={!!nftData}
                    onLoadData={handleLoadData}
                    onRequestPermission={handleRequestPermission}
                    onWriteData={handleWriteData}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                {nftData ? "Nenhum sistema criado ainda" : "Crie uma NFT primeiro"}
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Owners */}
          <TabsContent value="owners" className="space-y-6">
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setShowGenerateOwner(true)} size="lg" className="gap-2">
                <UserPlus className="h-5 w-5" />
                {t.generateOwner}
              </Button>
            </div>

            <OwnersList owners={potentialOwners} onRemove={handleRemoveOwner} />
          </TabsContent>

          {/* Tab 4: Timeline */}
          <TabsContent value="timeline">
            {timeline.length > 0 ? (
              <Timeline events={timeline} />
            ) : (
              <div className="text-center py-12 text-muted-foreground">Nenhuma atividade registrada ainda</div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ConnectWalletDialog
        open={showConnectWallet}
        onOpenChange={setShowConnectWallet}
        onConnect={handleConnectWallet}
      />

      <CreateNFTDialog
        open={showCreateNFT}
        onOpenChange={setShowCreateNFT}
        onCreateNFT={handleCreateNFT}
        ownerName={owner?.name || "Proprietário"}
      />

      <CreateEntityDialog
        open={showCreateEntity}
        onOpenChange={setShowCreateEntity}
        onCreateEntity={handleCreateEntity}
      />

      <TransferNFTDialog
        open={showTransferNFT}
        onOpenChange={setShowTransferNFT}
        potentialOwners={potentialOwners}
        onTransfer={handleTransferNFT}
        onGenerateOwner={() => setShowGenerateOwner(true)}
      />

      <GenerateOwnerDialog
        open={showGenerateOwner}
        onOpenChange={setShowGenerateOwner}
        onGenerate={handleGenerateOwner}
      />
    </div>
  )
}
