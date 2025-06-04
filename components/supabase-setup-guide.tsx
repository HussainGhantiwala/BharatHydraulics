"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Database, Key, Settings, CheckCircle } from "lucide-react"
import { useState } from "react"

export function SupabaseSetupGuide() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((n) => n !== stepNumber) : [...prev, stepNumber],
    )
  }

  const steps = [
    {
      number: 1,
      title: "Create Supabase Project",
      description: "Sign up at supabase.com and create a new project",
      action: "Visit Supabase",
      link: "https://supabase.com/dashboard",
      icon: Database,
    },
    {
      number: 2,
      title: "Get Project Credentials",
      description: "Copy your project URL and anon key from Settings > API",
      action: "Open Settings",
      icon: Key,
    },
    {
      number: 3,
      title: "Set Environment Variables",
      description: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file",
      action: "Configure",
      icon: Settings,
    },
    {
      number: 4,
      title: "Run Database Scripts",
      description: "Execute the SQL scripts to create tables and seed data",
      action: "Run Scripts",
      icon: Database,
    },
  ]

  return (
    <Card className="border-teal-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-green-400">
          <Database className="h-5 w-5" />
          Supabase Setup Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-teal-50 dark:bg-green-950 p-4 rounded-lg">
          <p className="text-sm text-teal-700 dark:text-green-300">
            Follow these steps to connect your application to Supabase for full database functionality.
          </p>
        </div>

        {steps.map((step) => {
          const Icon = step.icon
          const isCompleted = completedSteps.includes(step.number)

          return (
            <div
              key={step.number}
              className={`border rounded-lg p-4 transition-colors ${
                isCompleted
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-teal-100 text-teal-600 dark:bg-green-900 dark:text-green-400"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">
                      Step {step.number}: {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{step.description}</p>
                    {step.number === 3 && (
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono">
                        <div>NEXT_PUBLIC_SUPABASE_URL=your-project-url</div>
                        <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isCompleted ? "default" : "outline"}
                    onClick={() => toggleStep(step.number)}
                    className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isCompleted ? "Completed" : "Mark Done"}
                  </Button>
                  {step.link && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={step.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
            Progress: {completedSteps.length}/{steps.length} steps completed
          </h4>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
            />
          </div>
          {completedSteps.length === steps.length && (
            <Badge className="mt-2 bg-green-600">Setup Complete! Refresh the page to see Supabase in action.</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
