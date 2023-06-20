import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function CCChart({ data, xkey, ykey, type }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{ backgroundColor: "#ffffff", padding: "1%", width: "150px" }}
        >
          <p style={{ color: "#000000", margin: 0 }}>{xkey + " : " + ykey}</p>
          <p
            style={{ color: "#000000", margin: 0 }}
          >{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }
  };

  return (
    <div className="CCChart">
      {type === "radar" ? (
        <ResponsiveContainer width={500} height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xkey} />
            <PolarRadiusAxis />
            <Radar
              //   name="Mike"
              dataKey={ykey}
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <ComposedChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xkey} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {type === "line" && (
            <Line
              type="monotone"
              dataKey={ykey}
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          )}
          {type === "bar" && <Bar dataKey={ykey} barSize={20} fill="#413ea0" />}
        </ComposedChart>
      )}
    </div>
  );
}
