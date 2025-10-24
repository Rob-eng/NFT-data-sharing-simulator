export interface NFTData {
  title: string
  description: string
  metadata: Record<string, string>
  txHash: string
  createdAt: Date
  currentOwner: string
  ownerHistory: OwnerHistoryEntry[]
}

export interface OwnerHistoryEntry {
  ownerName: string
  publicKey: string
  transferredAt: Date
  txHash: string
}

export interface Entity {
  id: string
  name: string
  publicKey: string
  privateKey: string
  permissions: {
    read: boolean
    write: boolean
  }
  data: NFTData | null
  hasLoadedData: boolean
  isPreviousOwner?: boolean
}

export interface ConnectedWallet {
  address: string
  publicKey: string
  privateKey: string
  isConnected: boolean
  ownerName?: string
}

export interface PotentialOwner {
  id: string
  name: string
  publicKey: string
}

export interface TimelineEvent {
  id: string
  timestamp: Date
  action: string
  entityName: string
  description: string
  txHash?: string
}

export interface PermissionRequest {
  id: string
  entityId: string
  entityName: string
  type: "read" | "write"
  timestamp: Date
}
