'use client';
import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const ProfileChart = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);

        const gradeCounts = {}; // To count total works for each grade
        const studentCounts = {}; // To count distinct students for each grade

        // Iterate over works to build data for chart
        data.works.forEach((work) => {
          const grade = parseInt(work.grade);
          
          // Count total works for each grade
          if (!gradeCounts[grade]) {
            gradeCounts[grade] = 0;
            studentCounts[grade] = new Set(); // Set to track distinct students for each grade
          }

          gradeCounts[grade]++; // Increment total works for the grade
          studentCounts[grade].add(work.studentId); // Add student to the set (ensuring distinct students)
        });

        // Prepare formatted data for the chart
        const formattedData = Object.keys(gradeCounts).map((grade) => ({
          grade: grade,
          gradeCount: gradeCounts[grade], // Total number of works for this grade
          studentsWithWorks: studentCounts[grade].size, // Number of distinct students for this grade
        }));

        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  return (
    <div className="chart">
      <h4>{t("chart")}</h4>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" label={{ value: 'Grades', position: 'insideBottom', offset: -5 }} />
          <YAxis allowDecimals={false} label={{ value: 'Students', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend wrapperStyle={{ marginTop: "20px" }} />
          
          <Area
            type="monotone"
            dataKey="studentsWithWorks"
            name={t("works")}
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.4}
          />

          <Area
            type="monotone"
            dataKey="gradeCount"
            name={t("grades")}
            stroke="#0f65f0"
            fill="#0f65f0"
            fillOpacity={0.4}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfileChart;
