"use client"

import { Network, Wallet, Languages, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Language } from "@/lib/translations"

interface HeaderProps {
  connectedWallet: { address: string; isConnected: boolean; ownerName?: string } | null
  onConnectWallet: () => void
  language: Language
  onLanguageChange: (lang: Language) => void
  theme: "light" | "dark"
  onThemeToggle: () => void
}

export function Header({
  connectedWallet,
  onConnectWallet,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
}: HeaderProps) {
  const languageLabels = {
    pt: "Português",
    en: "English",
    es: "Español",
    fr: "Français",
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Network className="h-8 w-8 text-primary" strokeWidth={1.5} />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Blockchain Data Share</h1>
              <p className="text-sm text-muted-foreground">Simulador de Compartilhamento Descentralizado</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <DropdownMenuItem key={lang} onClick={() => onLanguageChange(lang)}>
                    {languageLabels[lang]} {language === lang && "✓"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="icon" onClick={onThemeToggle}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {connectedWallet?.isConnected ? (
              <Badge variant="secondary" className="gap-2 px-4 py-2">
                <Wallet className="h-4 w-4" />
                <span className="font-mono text-xs">{connectedWallet.address.slice(0, 8)}...</span>
              </Badge>
            ) : (
              <Button onClick={onConnectWallet} className="gap-2">
                <Wallet className="h-4 w-4" />
                Conectar Carteira
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
