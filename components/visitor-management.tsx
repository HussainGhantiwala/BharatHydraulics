"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { VisitorService, type VisitorWithSessions } from "@/lib/visitor-service"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, Building, MapPin, Calendar, Activity, Search, Loader2, Users, Eye } from "lucide-react"

export function VisitorManagement() {
  const [visitors, setVisitors] = useState<VisitorWithSessions[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorWithSessions[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    newVisitorsToday: 0,
    totalSessions: 0,
    averageSessionsPerVisitor: 0,
  })
  const { toast } = useToast()

  const fetchVisitors = async () => {
    try {
      setIsLoading(true)
      const [visitorsData, analyticsData] = await Promise.all([
        VisitorService.getVisitorsWithSessions(),
        VisitorService.getVisitorAnalytics(),
      ])

      setVisitors(visitorsData)
      setFilteredVisitors(visitorsData)
      setAnalytics(analyticsData)
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch visitor data: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitors()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = visitors.filter(
        (visitor) =>
          visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (visitor.company && visitor.company.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredVisitors(filtered)
    } else {
      setFilteredVisitors(visitors)
    }
  }, [searchTerm, visitors])

  const handleContactVisitor = (email: string) => {
    window.open(`mailto:${email}`, "_blank")
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600 dark:text-green-400" />
            <p className="text-gray-600 dark:text-gray-400">Loading visitor data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalVisitors}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.newVisitorsToday}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalSessions}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.averageSessionsPerVisitor}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visitor List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Website Visitors</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVisitors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm ? "No visitors found matching your search." : "No visitors registered yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVisitors.map((visitor) => (
                <Card key={visitor.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{visitor.name}</h3>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {visitor.total_visits} visit{visitor.total_visits !== 1 ? "s" : ""}
                          </Badge>
                          {visitor.total_visits > 1 && (
                            <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                              Returning Visitor
                            </Badge>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{visitor.email}</span>
                          </div>
                          {visitor.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {visitor.phone}
                            </div>
                          )}
                          {visitor.company && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span className="truncate">{visitor.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(visitor.last_visit).toLocaleDateString()}
                          </div>
                        </div>

                        {visitor.address && (
                          <div className="mb-4">
                            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-4 w-4 mt-0.5" />
                              <span>{visitor.address}</span>
                            </div>
                          </div>
                        )}

                        {/* Session Information */}
                        {visitor.sessions.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Activity:</h4>
                            <div className="space-y-1">
                              {visitor.sessions.slice(0, 3).map((session, index) => (
                                <div key={session.id} className="text-xs text-gray-500 dark:text-gray-400">
                                  Session {index + 1}: {new Date(session.created_at).toLocaleString()}
                                  {session.page_visited && ` - Visited: ${session.page_visited}`}
                                </div>
                              ))}
                              {visitor.sessions.length > 3 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  ... and {visitor.sessions.length - 3} more sessions
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          First visited: {new Date(visitor.created_at).toLocaleDateString()} at{" "}
                          {new Date(visitor.created_at).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleContactVisitor(visitor.email)}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-950"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
