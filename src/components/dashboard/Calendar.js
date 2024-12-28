import React, { useState, useContext } from "react";
import "../../styles/Dashboard.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";

function Calendar() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();
  const startDay = firstDayOfMonth.getDay();

  const changeMonth = (offset) => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const changeYear = (offset) => {
    setCurrentDate((prev) => new Date(prev.getFullYear() + offset, prev.getMonth(), 1));
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => changeYear(-1)}>«</button>
        <button onClick={() => changeMonth(-1)}>‹</button>
        <span>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </span>
        <button onClick={() => changeMonth(1)}>›</button>
        <button onClick={() => changeYear(1)}>»</button>
      </div>

      <table className={`calendar-table ${theme}`}>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <tr key={weekIndex}>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = weekIndex * 7 + dayIndex - startDay + 1;
                return (
                  <td
                    key={dayIndex}
                    className={day > 0 && day <= daysInMonth ? (isToday(day) ? "today" : "active") : "inactive"}
                  >
                    {day > 0 && day <= daysInMonth ? day : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
