export function encryptData(data: string): string {
  // Convert string to hex representation
  let hex = ""
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i)
    hex += charCode.toString(16).padStart(2, "0")
  }
  // Add some random padding to make it look more encrypted
  const padding = Math.random().toString(16).substring(2, 10)
  return `0x${padding}${hex}${padding}`
}

export function decryptData(encryptedData: string): string {
  // This is a simulation - in reality, decryption would use private keys
  // For display purposes, we'll just show the encrypted hex
  return encryptedData
}

export function generateWalletKeys(): { publicKey: string; privateKey: string } {
  const randomHex = () => Math.random().toString(36).substring(2, 15).toUpperCase()
  return {
    publicKey: `GD${randomHex()}${randomHex()}${randomHex()}`,
    privateKey: `SD${randomHex()}${randomHex()}${randomHex()}`,
  }
}
