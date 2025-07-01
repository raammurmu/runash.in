import { DashboardLayout } from "@/components/dashboard-layout"
import { EmailVerificationBanner } from "@/components/email-verification-banner"
import { DashboardStats } from "@/components/dashboard-stats"
import { LiveStreamsWidget } from "@/components/live-streams-widget"
import { RecentActivity } from "@/components/recent-activity"
import { AnalyticsChart } from "@/components/analytics-chart"
import { QuickActions } from "@/components/quick-actions"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <EmailVerificationBanner />

        {/* Welcome Section */}
        <div className="rounded-xl bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border border-orange-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-orange-900">Welcome back, Alex! 👋</h1>
              <p className="text-orange-700">
                You have <span className="font-semibold">3 active streams</span> and{" "}
                <span className="font-semibold">12,483 viewers</span> watching right now.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">94.2%</div>
                <div className="text-xs text-orange-700">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">$45.2K</div>
                <div className="text-xs text-orange-700">This Month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics Charts */}
            <AnalyticsChart />

            {/* Live Streams */}
            <LiveStreamsWidget />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>

        {/* Bottom Section - Performance Insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Peak Performance</h3>
                <p className="text-sm text-blue-700 mt-1">Your best streaming day was Friday with 2,450 peak viewers</p>
              </div>
              <div className="text-2xl">📈</div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-900">Revenue Growth</h3>
                <p className="text-sm text-green-700 mt-1">+18.2% increase in earnings compared to last month</p>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900">Community Growth</h3>
                <p className="text-sm text-purple-700 mt-1">1,247 new followers this week across all platforms</p>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
