"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { translations, type Language } from "@/lib/translations"
import { Sparkles, Shield, Target, BookOpen } from "lucide-react"

interface WelcomeDialogProps {
  language: Language
}

export function WelcomeDialog({ language }: WelcomeDialogProps) {
  const [open, setOpen] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const t = translations[language]

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
    if (!hasSeenWelcome) {
      setOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("hasSeenWelcome", "true")
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {t.welcomeTitle}
          </DialogTitle>
          <DialogDescription className="text-base">{t.welcomeSubtitle}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* What is Web3 and Blockchain */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 text-cyan-500" />
                {t.whatIsWeb3Title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.whatIsWeb3Text}</p>
            </div>

            <Separator />

            {/* Why Secure Data Sharing */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5 text-green-500" />
                {t.whySecureTitle}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.whySecureText}</p>
            </div>

            <Separator />

            {/* Project Purpose */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <Target className="h-5 w-5 text-blue-500" />
                {t.projectPurposeTitle}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.projectPurposeText}</p>
            </div>

            <Separator />

            {/* How to Use */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-purple-500" />
                {t.howToUseTitle}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="leading-relaxed">{t.step1}</p>
                <p className="leading-relaxed">{t.step2}</p>
                <p className="leading-relaxed">{t.step3}</p>
                <p className="leading-relaxed">{t.step4}</p>
                <p className="leading-relaxed">{t.step5}</p>
                <p className="leading-relaxed">{t.step6}</p>
                <p className="leading-relaxed">{t.step7}</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dontShow"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dontShow"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {t.dontShowAgain}
            </label>
          </div>
          <Button onClick={handleClose} size="lg">
            {t.getStarted}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
