'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from './ui/chart';
import { calculatePercentage, convertFileSize } from "@/lib/utils";

const chartConfig = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

/**
 * This component shows the used storage as a circle chart.
 * @param used The amount of used storage to show in the chart.
 * @returns A JSX element representing the chart.
 */
function Chart({ used = 0 }: { used: number }) {

  const chartData = [{ storage: "used", 10: used, fill: "white" }];

  return (
    <Card className="chart">
      {/* This component shows the used storage as a circle chart. */}
      <CardContent className="flex-1 p-0">
        {/* The container for the chart. */}
        <ChartContainer config={chartConfig} className="chart-container">
          {/* The chart itself. */}
          <RadialBarChart
            // The data to show in the chart.
            data={chartData}
            // The angle at which the chart starts.
            startAngle={90}
            // The angle at which the chart ends. This is calculated based on the used space.
            endAngle={Number(calculatePercentage(used)) + 90}
            // The inner radius of the circle.
            innerRadius={80}
            // The outer radius of the circle.
            outerRadius={110}
          >
            {/* The polar grid. */}
            <PolarGrid
              // The type of grid to show.
              gridType="circle"
              // Whether to show radial lines.
              radialLines={false}
              // The color of the grid lines.
              stroke="none"
              // The class name to apply to the grid.
              className="polar-grid"
              // The radius of the grid circles.
              polarRadius={[86, 74]}
            />
            {/* The bar in the chart. */}
            <RadialBar dataKey="storage" background cornerRadius={10} />
            {/* The axis labels. */}
            <PolarRadiusAxis
              // Whether to show tick lines.
              tick={false}
              // Whether to show the tick line.
              tickLine={false}
              // Whether to show the axis line.
              axisLine={false}
            >
              {/* The label to show in the center of the chart. */}
              <Label
                // The content of the label.
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        // The x position of the label.
                        x={viewBox.cx}
                        // The y position of the label.
                        y={viewBox.cy}
                        // The text anchor of the label.
                        textAnchor="middle"
                        // The dominant baseline of the label.
                        dominantBaseline="middle"
                      >
                        {/* The percentage label. */}
                        <tspan
                          // The x position of the percentage label.
                          x={viewBox.cx}
                          // The y position of the percentage label.
                          y={viewBox.cy}
                          // The class name to apply to the percentage label.
                          className="chart-total-percentage"
                        >
                          {/* The percentage value to show. This is calculated based on the used space. */}
                          {used && calculatePercentage(used)
                            ? calculatePercentage(used)
                                .toString()
                                .replace(/^0+/, "")
                            : "0"}
                          %
                        </tspan>
                        {/* The space used label. */}
                        <tspan
                          // The x position of the space used label.
                          x={viewBox.cx}
                          // The y position of the space used label.
                          y={(viewBox.cy || 0) + 24}
                          // The class name to apply to the space used label.
                          className="fill-white/70"
                        >
                          {/* The text to show in the space used label. */}
                          Space used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {/* The details of the used storage. */}
      <CardHeader className="chart-details">
        {/* The title of the chart. */}
        <CardTitle className="chart-title">Available Storage</CardTitle>
        {/* The description of the chart. */}
        <CardDescription className="chart-description">
          {/* The size of the used storage. This is calculated based on the used space. */}
          {used ? convertFileSize(used) : "2GB"} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default Chart