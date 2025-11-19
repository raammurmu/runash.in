'use client'

import { useState } from 'react'
import PlatformLayout from '@/components/video/platform-layout'
import ChatAgentStudio from '@/components/video/chat-agent-studio'
import MediaControls from '@/components/video/media-controls'
import AICapabilities from '@/components/video/ai-capabilities'
import AdvancedSearch from '@/components/video/advanced-search'
import UserManagement from '@/components/video/user-management'
import SettingsPanel from '@/components/video/settings-panel'

export default function RealTime() {
  const [activeTab, setActiveTab] = useState('studio')
  const [isDark, setIsDark] = useState(true)

  return (
    <PlatformLayout isDark={isDark} onThemeToggle={() => setIsDark(!isDark)}>
      {activeTab === 'studio' && <ChatAgentStudio />}
      {activeTab === 'media' && <MediaControls />}
      {activeTab === 'capabilities' && <AICapabilities />}
      {activeTab === 'search' && <AdvancedSearch />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'settings' && <SettingsPanel />}
    </PlatformLayout>
  )
}
