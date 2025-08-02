"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

interface LanguageSelectorProps {
  className?: string
  onLanguageChange?: (language: Language) => void
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
]

export function LanguageSelector({ className = "", onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [isLoading, setIsLoading] = useState(false)

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("runash-language")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setSelectedLanguage(language)
      }
    }
  }, [])

  const handleLanguageChange = async (language: Language) => {
    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("runash-language", language.code)

      // Update state
      setSelectedLanguage(language)

      // Call callback if provided
      if (onLanguageChange) {
        onLanguageChange(language)
      }

      // Simulate API call to update user preferences
      await new Promise((resolve) => setTimeout(resolve, 500))

      // You could also make an actual API call here:
      // await fetch('/api/user/language', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ language: language.code })
      // })
    } catch (error) {
      console.error("Failed to update language:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          <Globe className="h-4 w-4" />
          <span className="flex items-center gap-1">
            <span>{selectedLanguage.flag}</span>
            <span>{selectedLanguage.nativeName}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
        <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
          Select Language
        </div>
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <span className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.nativeName}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">({language.name})</span>
            </span>
            {selectedLanguage.code === language.code && <Check className="h-4 w-4 text-orange-500" />}
          </DropdownMenuItem>
        ))}
        <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-1">
          Language preferences are saved automatically
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
