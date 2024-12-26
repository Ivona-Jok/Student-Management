import React, { useState, useEffect } from "react";

const Popup = ({ message, duration = 10000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false); // Ukloni popup nakon isteka trajanja
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!message || !isVisible) return null;

  return (
    <div className="success-message fade-in" role="alert">
      {message}
    </div>
  );
};

export default Popup;
