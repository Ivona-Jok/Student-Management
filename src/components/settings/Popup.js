import React, { useState, useEffect } from "react";
import '../../styles/Popup.css';

const Popup = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      // Automatically fade out the message after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      // Clean up the timer when component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Return null if no message or it's fading out
  if (!message || !isVisible) return null;

  return (
    <div className={`success-message ${!isVisible ? 'fade-out' : ''}`}>
      {message}
    </div>
  );
};

export default Popup;