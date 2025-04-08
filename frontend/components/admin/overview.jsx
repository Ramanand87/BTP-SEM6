"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data - in a real app, this would come from your API
const chartData = [
  { name: "Jan", farmers: 400, contractors: 240 },
  { name: "Feb", farmers: 300, contractors: 139 },
  { name: "Mar", farmers: 200, contractors: 980 },
  { name: "Apr", farmers: 278, contractors: 390 },
  { name: "May", farmers: 189, contractors: 480 },
  { name: "Jun", farmers: 239, contractors: 380 },
  { name: "Jul", farmers: 349, contractors: 430 },
]

const contractData = [
  { name: "Jan", active: 400, completed: 240 },
  { name: "Feb", active: 300, completed: 139 },
  { name: "Mar", active: 200, completed: 980 },
  { name: "Apr", active: 278, completed: 390 },
  { name: "May", active: 189, completed: 480 },
  { name: "Jun", active: 239, completed: 380 },
  { name: "Jul", active: 349, completed: 430 },
]

export function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
          <CardDescription>Number of farmers and contractors registered over time</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="farmers" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="contractors" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Contract Status</CardTitle>
          <CardDescription>Active vs completed contracts over time</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={contractData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

