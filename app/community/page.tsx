"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Calendar,
  Award,
  Heart,
  MessageSquare,
  BookOpen,
  Mic,
  Video,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  UserPlus,
  Search,
  X,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * Reworked community page
 *
 * What I changed:
 * - Removed all hard-coded "dummy" data and wired the page to fetch structured data from a single API endpoint:
 *   /api/community (it should return JSON shaped like { programs, events, members, resources, stats }).
 * - Added search and basic filtering for programs/events.
 * - Added an accessible slide-over (simple implementation) to show program details.
 * - Implemented optimistic local registration state for events (persisted to localStorage) with a server POST attempt.
 * - Improved layout responsiveness and added loading / empty states.
 * - Kept styling using existing UI components.
 *
 * Next steps (what you can do after merging):
 * - Implement /api/community and /api/community/register endpoints to serve and mutate real data.
 * - Add telemetry/auth to tie registrations/follows to real users.
 * - Extract slide-over into a reusable component and add animations.
 */

type Program = {
  id: string
  title: string
  description: string
  color?: string
  icon?: string
  participants?: number
  duration?: string
  nextCohort?: string
  benefits?: string[]
  requirements?: string[]
  tags?: string[]
}

type EventItem = {
  id: string
  title: string
  description: string
  date: string
  time?: string
  type?: string
  attendees?: number
  maxAttendees?: number
  speaker?: { name: string; role?: string; avatar?: string }
  tags?: string[]
  location?: string
}

type Member = {
  name: string
  avatar?: string
  role?: string
  followers?: string
  growth?: string
  achievement?: string
  quote?: string
  platforms?: string[]
  joinedDate?: string
  slug?: string
}

type ResourceCategory = {
  category: string
  icon?: string
  items: { title: string; type: string; duration?: string; url?: string }[]
}

type CommunityPayload = {
  programs: Program[]
  events: EventItem[]
  members: Member[]
  resources: ResourceCategory[]
  stats: { label: string; value: string; change?: string }[]
}

export default function CommunityPage() {
  const router = useRouter()
  const [data, setData] = useState<CommunityPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState<string>("")
  const [programFilter, setProgramFilter] = useState<string>("all")
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [openProgram, setOpenProgram] = useState(false)

  // keep track of registrations locally and persist to localStorage
  const [registrations, setRegistrations] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem("runash.registrations")
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  // optimistic follow state for featured members
  const [follows, setFollows] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {}
    try {
      const raw = localStorage.getItem("runash.follows")
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // fetch community data from a single API endpoint
    // The API should return JSON shaped like CommunityPayload
    setLoading(true)
    setError(null)
    fetch("/api/community")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          throw new Error(text || `Failed to fetch community data (${res.status})`)
        }
        return res.json()
      })
      .then((json: CommunityPayload) => {
        setData(json)
      })
      .catch((err: any) => {
        console.error("Failed to load community data", err)
        setError("Could not load community content. Try again later.")
        // fallback to empty structure so UI still renders
        setData({ programs: [], events: [], members: [], resources: [], stats: [] })
      })
      .finally(() => setLoading(false))
  }, [])

  // persist local registrations and follows
  useEffect(() => {
    try {
      localStorage.setItem("runash.registrations", JSON.stringify(registrations))
    } catch {}
  }, [registrations])

  useEffect(() => {
    try {
      localStorage.setItem("runash.follows", JSON.stringify(follows))
    } catch {}
  }, [follows])

  const programs = data?.programs ?? []
  const events = data?.events ?? []
  const members = data?.members ?? []
  const resources = data?.resources ?? []
  const stats = data?.stats ?? []

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase()
    return programs.filter((p) => {
      if (programFilter !== "all" && !(p.tags || []).includes(programFilter)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.benefits || []).some((b) => b.toLowerCase().includes(q))
      )
    })
  }, [programs, search, programFilter])

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((e) => {
      if (!q) return true
      return (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    })
  }, [events, search])

  function openProgramDetails(program: Program) {
    setSelectedProgram(program)
    setOpenProgram(true)
    // focus the slide-over for accessibility once it's open
    setTimeout(() => {
      const el = document.getElementById("program-slide-over")
      el?.focus()
    }, 100)
  }

  async function registerForEvent(eventId: string) {
    // optimistic toggle
    setRegistrations((s) => ({ ...s, [eventId]: !s[eventId] }))
    try {
      const res = await fetch("/api/community/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })
      if (!res.ok) {
        // revert on failure
        setRegistrations((s) => ({ ...s, [eventId]: !s[eventId] }))
        const txt = await res.text().catch(() => "")
        throw new Error(txt || "Registration failed")
      }
    } catch (err) {
      console.error("Register failed", err)
    }
  }

  function toggleFollow(memberName: string) {
    setFollows((s) => ({ ...s, [memberName]: !s[memberName] }))
  }

  function addToCalendar(eventItem: EventItem) {
    // create a simple .ics file and open in new tab
    try {
      const start = new Date(`${eventItem.date}T${(eventItem.time || "12:00 PM").replace(" ", "")}`)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const toICS = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//RunAsh//EN",
        "BEGIN:VEVENT",
        `UID:${eventItem.id}@runash.in`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(start)}`,
        `DTEND:${formatICSDate(end)}`,
        `SUMMARY:${escapeICSText(eventItem.title)}`,
        `DESCRIPTION:${escapeICSText(eventItem.description || "")}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")

      const blob = new Blob([toICS], { type: "text/calendar;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
      // release URL after a short time
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
    } catch (err) {
      console.error("Failed to create calendar entry", err)
    }
  }

  function formatICSDate(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(
      d.getUTCMinutes(),
    )}00Z`
  }

  function escapeICSText(s: string) {
    return s.replace(/\n/g, "\\n").replace(/,/g, "\\,")
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return ""
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/8 to-pink-600/8 dark:from-purple-600/4 dark:to-pink-600/4" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
                <Heart className="h-4 w-4" />
                Community driven • member-first
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-transparent bg-clip-text">
                RunAsh Creator Community
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Connect, learn, and grow with creators and industry experts. Programs, events, resources, and
                peer-support — all in one place.
              </p>

              <div className="flex gap-3 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => router.push("/get-started")}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Community
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/forum")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Visit Forum
                </Button>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-transparent dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-7 w-7 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-500">Active Members</div>
                    <div className="text-2xl font-bold text-purple-600">{stats[0]?.value ?? "—"}</div>
                  </div>
                  <div className="h-10 w-px bg-gray-100 dark:bg-gray-800 mx-3" />
                  <div>
                    <div className="text-sm text-gray-500">This Month</div>
                    <div className="text-2xl font-bold">{stats[0]?.change ?? "—"}</div>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Search community programs and events"
                      placeholder="Search programs, events, or creators..."
                      className="w-full border rounded-lg px-3 py-2 pl-10 dark:bg-gray-900 dark:border-gray-800"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  </div>

                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-900 dark:border-gray-800"
                    aria-label="Filter programs"
                  >
                    <option value="all">All Programs</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="innovation">Innovation</option>
                    <option value="content">Content Challenges</option>
                    <option value="success">Success Circle</option>
                  </select>
                </div>
                <div className="mt-3 text-xs text-gray-500">Tip: use search to quickly find programs, events or creators.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Programs / events list */}
          <div className="lg:col-span-2 space-y-8">
            {/* Programs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Programs</h2>
                <div className="text-sm text-gray-500">{filteredPrograms.length} available</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 bg-gray-50 dark:bg-gray-900/40 rounded" />
                      </CardContent>
                    </Card>
                  ))
                ) : filteredPrograms.length === 0 ? (
                  <div className="text-center text-gray-500 col-span-full">No matching programs found.</div>
                ) : (
                  filteredPrograms.map((program) => (
                    <Card key={program.id} className="hover:shadow-lg transition" onClick={() => openProgramDetails(program)}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${program.color ?? "from-gray-200 to-gray-300"} text-white`}>
                            {/* keep icon minimal if string provided */}
                            <Users className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{program.title}</CardTitle>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{program.description}</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Next</div>
                            <div className="font-medium">{program.nextCohort ?? "Rolling"}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Duration</div>
                            <div className="font-medium">{program.duration ?? "Varies"}</div>
                          </div>
                          <div>
                            <Button variant="ghost" size="sm" onClick={() => openProgramDetails(program)}>
                              Learn more
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <div className="text-sm text-gray-500">{filteredEvents.length} upcoming</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-24 bg-gray-50 dark:bg-gray-900/40 rounded" />
                      </CardContent>
                    </Card>
                  ))
                ) : filteredEvents.length === 0 ? (
                  <div className="text-center text-gray-500 col-span-full">No upcoming events found.</div>
                ) : (
                  filteredEvents.map((event) => {
                    const isRegistered = Boolean(registrations[event.id])
                    const pct = event.maxAttendees ? Math.min(100, Math.round(((event.attendees ?? 0) / event.maxAttendees) * 100)) : 0
                    return (
                      <Card key={event.id} className="hover:shadow-md transition">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{event.type ?? "Event"}</Badge>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {(event.attendees ?? 0)}/{event.maxAttendees ?? "—"}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{event.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <div>{formatDate(event.date)}</div>
                              <Clock className="h-4 w-4 ml-3" />
                              <div>{event.time ?? "TBD"}</div>
                            </div>

                            <Progress value={pct} className="h-2" />

                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => registerForEvent(event.id)}>{isRegistered ? "Registered" : "Register"}</Button>
                              <Button size="sm" variant="outline" onClick={() => addToCalendar(event)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                  Add to calendar
                              </Button>
                              <div className="ml-auto text-xs text-gray-500 self-center">{event.tags?.slice(0, 3).join(" • ")}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: Members and Resources */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Featured Members
                </CardTitle>
                <div className="text-sm text-gray-500">Spotlight on community success</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-1" />
                          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : members.length === 0 ? (
                    <div className="text-sm text-gray-500">No members to show yet</div>
                  ) : (
                    members.slice(0, 4).map((m) => (
                      <div key={m.name} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={m.avatar ?? "/placeholder.svg"} alt={m.name} />
                          <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{m.name}</div>
                          <div className="text-xs text-gray-500">{m.role}</div>
                        </div>
                        <div className="flex flex-col items-end">
                          <Button size="sm" variant={follows[m.name] ? undefined : "outline"} onClick={() => toggleFollow(m.name)}>
                            {follows[m.name] ? "Following" : "Follow"}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/creator/${m.slug ?? encodeURIComponent(m.name)}`)}>
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Resources
                </CardTitle>
                <div className="text-sm text-gray-500">Guides, workshops and podcasts</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    <div className="h-20 bg-gray-50 dark:bg-gray-900/40 rounded" />
                  ) : resources.length === 0 ? (
                    <div className="text-sm text-gray-500">No resources available.</div>
                  ) : (
                    resources.slice(0, 3).map((r) => (
                      <div key={r.category}>
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                          {r.icon ? <span className="h-4 w-4">{r.icon}</span> : <BookOpen className="h-4 w-4" />}
                          {r.category}
                        </div>
                        <div className="space-y-2">
                          {r.items.slice(0, 3).map((it) => (
                            <div key={it.title} className="flex items-center justify-between">
                              <div>
                                <div className="text-sm">{it.title}</div>
                                <div className="text-xs text-gray-500">{it.type} • {it.duration ?? ""}</div>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => it.url ? window.open(it.url, "_blank") : null}>
                                Open
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      {/* Program slide-over (simple, accessible) */}
      {openProgram && selectedProgram && (
        <div
          id="program-slide-over"
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:justify-end bg-black/40"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpenProgram(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 w-full md:w-[520px] h-[80vh] md:h-auto overflow-auto rounded-t-xl md:rounded-l-xl md:rounded-r-none p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedProgram.title}</h3>
                <div className="text-sm text-gray-500">{selectedProgram.description}</div>
              </div>
              <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpenProgram(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Key benefits</h4>
                <ul className="space-y-2">
                  {(selectedProgram.benefits && selectedProgram.benefits.length > 0) ? selectedProgram.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <span>{b}</span>
                    </li>
                  )) : <div className="text-sm text-gray-500">No benefits listed for this program.</div>}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Requirements</h4>
                <div className="text-sm text-gray-600">
                   {(selectedProgram.requirements && selectedProgram.requirements.length > 0) ? (
                    <ul className="list-disc list-inside">
                      {selectedProgram.requirements!.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-500">No specific requirements.</div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => { setOpenProgram(false); router.push(`/programs/${selectedProgram.id}`) }}>
                  View Program
                </Button>
                <Button variant="outline" onClick={() => { setOpenProgram(false); router.push("/get-started") }}>
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to join? Start growing today.</h2>
          <p className="text-sm md:text-base mb-6 max-w-2xl mx-auto">Members get priority event access, program invites, and exclusive resources.</p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" className="bg-white text-purple-600" onClick={() => router.push("/get-started")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Join Community
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white" onClick={() => router.push("/forum")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Visit Forum
            </Button>
          </div>
        </div>
      </section>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-red-50 dark:bg-red-900/70 border border-red-100 dark:border-red-700 text-red-800 dark:text-red-200 p-3 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
