"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileJson } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WriteDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Record<string, string>) => void
}

export function WriteDataDialog({ open, onOpenChange, onSubmit }: WriteDataDialogProps) {
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [jsonData, setJsonData] = useState<Record<string, string> | null>(null)
  const [fileName, setFileName] = useState("")
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!key || !value) return

    onSubmit({ metadata: { [key]: value } })
    setKey("")
    setValue("")
    onOpenChange(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".json")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo JSON válido",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsed = JSON.parse(content)

        // Validate that it's an object with string key:value pairs
        if (typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("JSON deve ser um objeto com pares chave:valor")
        }

        // Convert all values to strings
        const stringData: Record<string, string> = {}
        for (const [k, v] of Object.entries(parsed)) {
          stringData[k] = String(v)
        }

        setJsonData(stringData)
        setFileName(file.name)
        toast({
          title: "Arquivo carregado",
          description: `${Object.keys(stringData).length} pares chave:valor encontrados`,
        })
      } catch (error) {
        toast({
          title: "Erro ao ler arquivo",
          description: error instanceof Error ? error.message : "Formato JSON inválido",
          variant: "destructive",
        })
        setJsonData(null)
        setFileName("")
      }
    }
    reader.readAsText(file)
  }

  const handleJsonSubmit = () => {
    if (!jsonData || Object.keys(jsonData).length === 0) return

    onSubmit({ metadata: jsonData })
    setJsonData(null)
    setFileName("")
    onOpenChange(false)
  }

  const handleClose = () => {
    setKey("")
    setValue("")
    setJsonData(null)
    setFileName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Dados à NFT</DialogTitle>
          <DialogDescription>Adicione novos metadados manualmente ou via arquivo JSON</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="json">Arquivo JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="dataKey">Chave</Label>
              <Input id="dataKey" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Ex: autor" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataValue">Valor</Label>
              <Input
                id="dataValue"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={!key || !value}>
                Adicionar
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="json" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="jsonFile">Arquivo JSON</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="jsonFile"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Formato esperado: {`{ "chave1": "valor1", "chave2": "valor2" }`}
              </p>
            </div>

            {jsonData && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  Dados carregados de {fileName}
                </Label>
                <div className="max-h-[200px] overflow-y-auto rounded-md border bg-muted/50 p-3 text-sm">
                  {Object.entries(jsonData).map(([k, v]) => (
                    <div key={k} className="flex gap-2 py-1">
                      <span className="font-medium text-primary">{k}:</span>
                      <span className="text-muted-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button onClick={handleJsonSubmit} disabled={!jsonData || Object.keys(jsonData).length === 0}>
                Adicionar {jsonData ? `(${Object.keys(jsonData).length})` : ""}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
