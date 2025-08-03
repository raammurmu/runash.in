"use client"

import { useState } from "react"
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector"
import { PaymentProcessing } from "@/components/payment/payment-processing"
import type { PaymentMethod, PaymentTransaction } from "@/lib/payment-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ShoppingCart } from "lucide-react"

export default function PaymentPage() {
  const [step, setStep] = useState<"amount" | "method" | "processing" | "success">("amount")
  const [amount, setAmount] = useState<number>(1000)
  const [currency] = useState<string>("INR")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null)

  const handleAmountSubmit = () => {
    if (amount > 0) {
      setStep("method")
    }
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
  }

  const handleProceedToPayment = () => {
    if (selectedMethod) {
      setStep("processing")
    }
  }

  const handlePaymentSuccess = (txn: PaymentTransaction) => {
    setTransaction(txn)
    setStep("success")
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
    // Stay on processing step to allow retry
  }

  const handleCancel = () => {
    if (step === "processing") {
      setStep("method")
    } else if (step === "method") {
      setStep("amount")
    } else {
      // Reset everything
      setStep("amount")
      setSelectedMethod(null)
      setTransaction(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {step !== "amount" && (
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold">Payment Checkout</h1>
              <p className="text-gray-600">Secure payment processing</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "amount" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 ${
                ["method", "processing", "success"].includes(step) ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "method"
                  ? "bg-blue-500 text-white"
                  : ["processing", "success"].includes(step)
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
            <div
              className={`flex-1 h-1 ${["processing", "success"].includes(step) ? "bg-green-500" : "bg-gray-300"}`}
            />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "processing"
                  ? "bg-blue-500 text-white"
                  : step === "success"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === "amount" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Enter Payment Amount</span>
              </CardTitle>
              <CardDescription>Enter the amount you want to pay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({currency})</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <h4 className="font-medium mb-2">Payment Summary</h4>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(amount)}</div>
                <p className="text-sm text-gray-600 mt-1">
                  Processing fees will be calculated based on your selected payment method
                </p>
              </div>

              <Button className="w-full" onClick={handleAmountSubmit} disabled={amount <= 0}>
                Continue to Payment Methods
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "method" && (
          <div className="space-y-4">
            <PaymentMethodSelector
              amount={amount}
              currency={currency}
              onMethodSelect={handleMethodSelect}
              selectedMethod={selectedMethod || undefined}
            />

            {selectedMethod && (
              <Button className="w-full" onClick={handleProceedToPayment}>
                Proceed to Payment
              </Button>
            )}
          </div>
        )}

        {step === "processing" && selectedMethod && (
          <PaymentProcessing
            amount={amount}
            currency={currency}
            paymentMethod={selectedMethod}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  )
}
