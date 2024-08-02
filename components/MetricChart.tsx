'use client';

import { useState } from 'react'
import { TrendingUp, TrendingDown } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AnalysisSheet } from '@/components/AnalysisSheet'

interface MetricChartProps {
  title: string;
  data: Array<{ date: string; value: number }>;
  color: string;
  unit: string;
  trend: number;
  description: string;
}

export function MetricChart({ title, data, color, unit, trend, description }: MetricChartProps) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false)

  const chartConfig = {
    metric: {
      label: title,
      color: color,
    },
  } satisfies ChartConfig

  const formattedData = data.map(item => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' });
    return {
      date: formattedDate,
      metric: item.value
    }
  })

  const renderCustomLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text x={x} y={y} dy={-10} fill={color} fontSize={12} textAnchor="middle">
        {`${value} ${unit}`}
      </text>
    );
  };

  return (
    <div >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-lg">
            <span>{title}</span>
            <Button onClick={() => setIsAnalysisOpen(true)} variant="outline" size="sm">
              Analyze
            </Button>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={formattedData}
              margin={{
                top: 30,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(5)} // Show only MM-DD
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="metric"
                type="monotone"
                stroke={color}
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: color,
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: color,
                  strokeWidth: 2,
                }}
              >
                <LabelList content={renderCustomLabel} />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            {trend > 0 ? (
              <>
                Trending up by {trend.toFixed(1)}% <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : trend < 0 ? (
              <>
                Trending down by {Math.abs(trend).toFixed(1)}% <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            ) : (
              'No significant trend'
            )}
          </div>
          <div className="text-muted-foreground">
            Based on the last {data.length} measurements
          </div>
        </CardFooter>
        <AnalysisSheet
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          title={title}
          data={data}
          unit={unit}
        />
      </Card>
    </div>
  )
}