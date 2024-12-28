import React from "react";

const YearSelect = ({ startYear = 1970, endYear = new Date().getFullYear(), onChange }) => {
  
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  return (
    <select onChange={(e) => onChange && onChange(e.target.value)}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};
export default YearSelect;