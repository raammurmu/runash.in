"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Bell, HelpCircle, Star, Send, Search, Filter } from "lucide-react"

interface CommunicationDashboardProps {
  userId: string
}

export default function CommunicationDashboard({ userId }: CommunicationDashboardProps) {
  const [activeTab, setActiveTab] = useState("chat")
  const [notifications, setNotifications] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "technical",
    priority: "medium",
  })

  useEffect(() => {
    loadNotifications()
    loadSupportTickets()
  }, [userId])

  const loadNotifications = async () => {
    try {
      const response = await fetch(`/api/communication/notifications?userId=${userId}`)
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const loadSupportTickets = async () => {
    try {
      const response = await fetch(`/api/communication/support?userId=${userId}`)
      const data = await response.json()
      setSupportTickets(data.tickets || [])
    } catch (error) {
      console.error("Error loading support tickets:", error)
    }
  }

  const createSupportTicket = async () => {
    try {
      const response = await fetch("/api/communication/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTicket, userId }),
      })

      if (response.ok) {
        setNewTicket({ subject: "", description: "", category: "technical", priority: "medium" })
        loadSupportTickets()
      }
    } catch (error) {
      console.error("Error creating support ticket:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 text-transparent bg-clip-text">
          Communication Center
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Live Chat</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            {notifications.filter((n: any) => !n.read).length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {notifications.filter((n: any) => !n.read).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4" />
            <span>Support</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Feedback</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Support team is online</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average response time: 2 minutes</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white">
                  Start Live Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="grid gap-4">
            {notifications.map((notification: any) => (
              <Card key={notification.id} className={!notification.read ? "border-orange-200" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, subject: e.target.value }))}
              />
              <Textarea
                placeholder="Describe your issue..."
                value={newTicket.description}
                onChange={(e) => setNewTicket((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="px-3 py-2 border rounded-md"
                  value={newTicket.category}
                  onChange={(e) => setNewTicket((prev) => ({ ...prev, category: e.target.value }))}
                >
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing</option>
                  <option value="feature">Feature Request</option>
                  <option value="general">General Question</option>
                </select>
                <select
                  className="px-3 py-2 border rounded-md"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket((prev) => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <Button
                onClick={createSupportTicket}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Support Tickets</h3>
            {supportTickets.map((ticket: any) => (
              <Card key={ticket.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{ticket.subject}</h4>
                        <Badge variant={ticket.status === "open" ? "destructive" : "secondary"}>{ticket.status}</Badge>
                        <Badge variant="outline">{ticket.priority}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ticket.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(ticket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rate your experience</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-6 w-6 text-gray-300 hover:text-yellow-500 cursor-pointer" />
                    ))}
                  </div>
                </div>
                <Textarea placeholder="Tell us about your experience..." rows={4} />
                <Button className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white">
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
