'use client';
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CombinedChartComponent = () => {
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

        const grades = data.works.map(work => parseInt(work.grade));
        const gradeCounts = [];
        for (let i = 6; i <= 10; i++) {
          const count = grades.filter(grade => grade === i).length;
          gradeCounts.push({ grade: i, gradeCount: count });
        }

        const students = data.users.filter(user => user.role === "student");
        const studentIdsWithWorks = new Set(data.works.map(work => work.studentId));
        const studentsWithWorksCount = students.filter(student => studentIdsWithWorks.has(student.id)).length;

        const formattedData = gradeCounts.map(item => ({
          grade: item.grade,
          gradeCount: item.gradeCount,
          studentsWithWorks: studentsWithWorksCount,
        }));

        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <h4>Combined Grades and Students Chart</h4>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grade" label={{ value: 'Grades', position: 'insideBottom', offset: -5 }} />
          <YAxis allowDecimals={false} label={{ value: 'Students', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />

          <Area
            type="monotone"
            dataKey="studentsWithWorks"
            name="Students with Works"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.4}
          />

          <Area
            type="monotone"
            dataKey="gradeCount"
            name="Students per Grade"
            stroke="#0f65f0"
            fill="#0f65f0"
            fillOpacity={0.4}
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedChartComponent;
