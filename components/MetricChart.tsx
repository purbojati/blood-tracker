'use client'

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface MetricChartProps {
  title: string;
  description: string;
  data: Array<{ date: string; value: number }>;
  color: string;
  unit: string;
  trend: number;
}

export function MetricChart({ title, description, data, color, unit, trend }: MetricChartProps) {
  const chartConfig = {
    value: {
      label: title,
      color: color,
    },
  } satisfies ChartConfig

  return (
    <Card className="grid grid-cols-1 gap-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 5, left: 5, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  offset={12}
                  fill="var(--chart-text-color)"
                  fontSize={12}
                  formatter={(value: number) => `${value} ${unit}`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend > 0 ? 'Trending up' : 'Trending down'} by {Math.abs(trend).toFixed(1)}% from last measurement
          {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing {title.toLowerCase()} for the last 7 measurements
        </div>
      </CardFooter>
    </Card>
  )
}