"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Country {
  code: string
  name: string
  flag: string
  currency: string
  timezone: string
}

interface CountrySelectorProps {
  className?: string
  onCountryChange?: (country: Country) => void
}

const countries: Country[] = [
  { code: "in", name: "India", flag: "🇮🇳", currency: "INR", timezone: "Asia/Kolkata" },
  { code: "us", name: "United States", flag: "🇺🇸", currency: "USD", timezone: "America/New_York" },
  { code: "gb", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", timezone: "Europe/London" },
  { code: "ca", name: "Canada", flag: "🇨🇦", currency: "CAD", timezone: "America/Toronto" },
  { code: "au", name: "Australia", flag: "🇦🇺", currency: "AUD", timezone: "Australia/Sydney" },
  { code: "sg", name: "Singapore", flag: "🇸🇬", currency: "SGD", timezone: "Asia/Singapore" },
  { code: "ae", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", timezone: "Asia/Dubai" },
  { code: "de", name: "Germany", flag: "🇩🇪", currency: "EUR", timezone: "Europe/Berlin" },
  { code: "fr", name: "France", flag: "🇫🇷", currency: "EUR", timezone: "Europe/Paris" },
  { code: "jp", name: "Japan", flag: "🇯🇵", currency: "JPY", timezone: "Asia/Tokyo" },
  { code: "kr", name: "South Korea", flag: "🇰🇷", currency: "KRW", timezone: "Asia/Seoul" },
  { code: "br", name: "Brazil", flag: "🇧🇷", currency: "BRL", timezone: "America/Sao_Paulo" },
  { code: "mx", name: "Mexico", flag: "🇲🇽", currency: "MXN", timezone: "America/Mexico_City" },
  { code: "nl", name: "Netherlands", flag: "🇳🇱", currency: "EUR", timezone: "Europe/Amsterdam" },
  { code: "se", name: "Sweden", flag: "🇸🇪", currency: "SEK", timezone: "Europe/Stockholm" },
  { code: "no", name: "Norway", flag: "🇳🇴", currency: "NOK", timezone: "Europe/Oslo" },
]

export function CountrySelector({ className = "", onCountryChange }: CountrySelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [isLoading, setIsLoading] = useState(false)

  // Auto-detect user's country on mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        // First check localStorage
        const savedCountry = localStorage.getItem("runash-country")
        if (savedCountry) {
          const country = countries.find((c) => c.code === savedCountry)
          if (country) {
            setSelectedCountry(country)
            return
          }
        }

        // Try to detect from timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const countryByTimezone = countries.find((c) => c.timezone === timezone)
        if (countryByTimezone) {
          setSelectedCountry(countryByTimezone)
          return
        }

        // Try to detect from locale
        const locale = navigator.language || navigator.languages[0]
        const countryCode = locale.split("-")[1]?.toLowerCase()
        if (countryCode) {
          const countryByLocale = countries.find((c) => c.code === countryCode)
          if (countryByLocale) {
            setSelectedCountry(countryByLocale)
            return
          }
        }

        // Fallback to IP-based detection (you could implement this)
        // const response = await fetch('/api/detect-country')
        // const data = await response.json()
        // if (data.country) {
        //   const detectedCountry = countries.find(c => c.code === data.country.toLowerCase())
        //   if (detectedCountry) {
        //     setSelectedCountry(detectedCountry)
        //   }
        // }
      } catch (error) {
        console.error("Failed to detect country:", error)
      }
    }

    detectCountry()
  }, [])

  const handleCountryChange = async (country: Country) => {
    setIsLoading(true)

    try {
      // Save to localStorage
      localStorage.setItem("runash-country", country.code)

      // Update state
      setSelectedCountry(country)

      // Call callback if provided
      if (onCountryChange) {
        onCountryChange(country)
      }

      // Simulate API call to update user preferences
      await new Promise((resolve) => setTimeout(resolve, 500))

      // You could also make an actual API call here:
      // await fetch('/api/user/country', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     country: country.code,
      //     currency: country.currency,
      //     timezone: country.timezone
      //   })
      // })
    } catch (error) {
      console.error("Failed to update country:", error)
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
          <MapPin className="h-4 w-4" />
          <span className="flex items-center gap-1">
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.name}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-80 overflow-y-auto">
        <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
          Select Country/Region
        </div>
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => handleCountryChange(country)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <span className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.name}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">({country.currency})</span>
            </span>
            {selectedCountry.code === country.code && <Check className="h-4 w-4 text-orange-500" />}
          </DropdownMenuItem>
        ))}
        <div className="p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-1">
          Affects pricing, content, and regional features
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
