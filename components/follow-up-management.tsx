"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useSupabaseQuotations } from "@/hooks/use-supabase-quotations"
import type { QuotationRequest } from "@/lib/supabase"

interface FollowUpManagementProps {
  quotations: QuotationRequest[]
}

export function FollowUpManagement({ quotations }: FollowUpManagementProps) {
  const { followUps, addFollowUp, markFollowUpCompleted } = useSupabaseQuotations()
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null)
  const [followUpData, setFollowUpData] = useState({
    message: "",
    followUpDate: "",
  })

  const handleAddFollowUp = (quotation: QuotationRequest) => {
    setSelectedQuotation(quotation)
    setFollowUpData({
      message: `Follow up on quotation for ${quotation.product?.name || "product"}`,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days from now
    })
    setShowFollowUpModal(true)
  }

  const handleSubmitFollowUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuotation) return

    await addFollowUp({
      quotation_id: selectedQuotation.id,
      message: followUpData.message,
      follow_up_date: followUpData.followUpDate,
      completed: false,
    })

    setShowFollowUpModal(false)
    setSelectedQuotation(null)
    setFollowUpData({ message: "", followUpDate: "" })
  }

  const pendingFollowUps = followUps.filter((f) => !f.completed)
  const upcomingFollowUps = pendingFollowUps.filter(
    (f) => new Date(f.follow_up_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  )

  const getQuotationAge = (createdAt: string) => {
    const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const quotationsNeedingFollowUp = quotations.filter((q) => {
    const age = getQuotationAge(q.created_at)
    const hasRecentFollowUp = followUps.some(
      (f) => f.quotation_id === q.id && new Date(f.follow_up_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    )
    return (q.status === "quoted" && age > 3 && !hasRecentFollowUp) || (q.status === "pending" && age > 1)
  })

  return (
    <>
      <div className="space-y-6">
        {/* Follow-up Alerts */}
        {upcomingFollowUps.length > 0 && (
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-5 w-5" />
                Upcoming Follow-ups ({upcomingFollowUps.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingFollowUps.slice(0, 3).map((followUp) => (
                  <div
                    key={followUp.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{followUp.message}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Due: {new Date(followUp.follow_up_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => markFollowUpCompleted(followUp.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quotations Needing Follow-up */}
        <Card className="border-teal-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-green-400">
              <MessageSquare className="h-5 w-5" />
              Customer Follow-up Required ({quotationsNeedingFollowUp.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quotationsNeedingFollowUp.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>All quotations are up to date!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotationsNeedingFollowUp.map((quotation) => {
                  const age = getQuotationAge(quotation.created_at)
                  const urgencyColor =
                    age > 7
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : age > 3
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"

                  return (
                    <div key={quotation.id} className="border rounded-lg p-4 border-teal-200 dark:border-green-800">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={quotation.product?.image || "/placeholder.svg?height=60&width=60"}
                            alt={quotation.product?.name || "Product"}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{quotation.product?.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Customer: {quotation.customer_name}
                            </p>
                            <div className="flex gap-2 mt-1">
                              <Badge className={urgencyColor}>{age} days old</Badge>
                              <Badge variant="outline">{quotation.status}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <p>Email: {quotation.email}</p>
                          <p>Phone: {quotation.phone}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddFollowUp(quotation)}
                          className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Schedule Follow-up
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Follow-ups */}
        <Card className="border-teal-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-green-400">
              <Calendar className="h-5 w-5" />
              All Follow-ups ({followUps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {followUps.slice(0, 10).map((followUp) => (
                <div
                  key={followUp.id}
                  className={`p-3 rounded-lg border ${
                    followUp.completed
                      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{followUp.message}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(followUp.follow_up_date).toLocaleDateString()}
                        </span>
                        <Badge
                          variant={followUp.completed ? "default" : "secondary"}
                          className={followUp.completed ? "bg-green-600" : ""}
                        >
                          {followUp.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    {!followUp.completed && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markFollowUpCompleted(followUp.id)}
                        className="border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-up Modal */}
      <Dialog open={showFollowUpModal} onOpenChange={setShowFollowUpModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-teal-600 dark:text-green-400">Schedule Follow-up</DialogTitle>
          </DialogHeader>

          {selectedQuotation && (
            <form onSubmit={handleSubmitFollowUp} className="space-y-4">
              <div className="bg-teal-50 dark:bg-green-950 p-3 rounded-lg">
                <p className="font-medium">{selectedQuotation.customer_name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedQuotation.product?.name}</p>
              </div>

              <div>
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={followUpData.followUpDate}
                  onChange={(e) => setFollowUpData((prev) => ({ ...prev, followUpDate: e.target.value }))}
                  className="border-teal-200 dark:border-green-800"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Follow-up Message</Label>
                <Textarea
                  id="message"
                  value={followUpData.message}
                  onChange={(e) => setFollowUpData((prev) => ({ ...prev, message: e.target.value }))}
                  className="border-teal-200 dark:border-green-800"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  Schedule Follow-up
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowFollowUpModal(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
