"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useModerationRules } from "@/hooks/use-ai-tools"
import { Shield, Plus, AlertTriangle, Ban, Trash2, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ChatModeration() {
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'spam' as const,
    action: 'warn' as const,
    severity: 'medium' as const,
    enabled: true
  })
  
  const { rules, loading, error, createRule } = useModerationRules()
  const { toast } = useToast()

  const handleCreateRule = async () => {
    if (!newRule.name.trim()) {
      toast({
        title: "Rule Name Required",
        description: "Please provide a name for the moderation rule",
        variant: "destructive"
      })
      return
    }

    const result = await createRule(newRule)
    if (result) {
      setNewRule({
        name: '',
        type: 'spam',
        action: 'warn',
        severity: 'medium',
        enabled: true
      })
      toast({
        title: "Rule Created!",
        description: "New moderation rule has been added",
      })
    }
  }

  const getRuleIcon = (type: string) => {
    const icons = {
      spam: AlertTriangle,
      toxicity: Ban,
      profanity: Trash2,
      caps: Settings,
      links: Shield
    }
    const Icon = icons[type as keyof typeof icons] || Shield
    return <Icon className="h-4 w-4" />
  }

  const getActionColor = (action: string) => {
    const colors = {
      warn: 'bg-yellow-100 text-yellow-800',
      timeout: 'bg-orange-100 text-orange-800',
      ban: 'bg-red-100 text-red-800',
      delete: 'bg-gray-100 text-gray-800'
    }
    return colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            AI Chat Moderation
          </CardTitle>
          <CardDescription>
            Set up automated chat moderation rules to keep your stream chat clean and welcoming
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rules" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="rules">Moderation Rules</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create New Rule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ruleName">Rule Name</Label>
                      <Input
                        id="ruleName"
                        placeholder="e.g., Spam Detection"
                        value={newRule.name}
                        onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Rule Type</Label>
                      <Select 
                        value={newRule.type} 
                        onValueChange={(value: any) => setNewRule(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spam">Spam Detection</SelectItem>
                          <SelectItem value="toxicity">Toxicity Filter</SelectItem>
                          <SelectItem value="profanity">Profanity Filter</SelectItem>
                          <SelectItem value="caps">Caps Lock Limit</SelectItem>
                          <SelectItem value="links">Link Blocker</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Action</Label>
                      <Select 
                        value={newRule.action} 
                        onValueChange={(value: any) => setNewRule(prev => ({ ...prev, action: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warn">Warn User</SelectItem>
                          <SelectItem value="timeout">Timeout User</SelectItem>
                          <SelectItem value="ban">Ban User</SelectItem>
                          <SelectItem value="delete">Delete Message</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Severity</Label>
                      <Select 
                        value={newRule.severity} 
                        onValueChange={(value: any) => setNewRule(prev => ({ ...prev, severity: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enabled"
                      checked={newRule.enabled}
                      onCheckedChange={(checked) => setNewRule(prev => ({ ...prev, enabled: checked }))}
                    />
                    <Label htmlFor="enabled">Enable rule immediately</Label>
                  </div>

                  <Button onClick={handleCreateRule} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Active Rules</h3>
                {loading ? (
                  <div className="text-center py-8">Loading rules...</div>
                ) : rules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No moderation rules configured yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rules.map((rule) => (
                      <Card key={rule.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getRuleIcon(rule.type)}
                            <div>
                              <h4 className="font-medium">{rule.name}</h4>
                              <p className="text-sm text-gray-500 capitalize">{rule.type} detection</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getActionColor(rule.action)}>
                              {rule.action}
                            </Badge>
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity}
                            </Badge>
                            <Switch checked={rule.enabled} />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recent Moderation Events</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: 1,
                      username: 'spammer123',\
                      message: 'CHECK OUT MY CHANNEL
