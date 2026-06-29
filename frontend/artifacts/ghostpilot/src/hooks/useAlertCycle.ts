import { useState, useEffect } from 'react';

const statuses = ["Healthy", "Warning", "Critical"] as const;
type Status = typeof statuses[number];

export function useAlertCycle(intervalMs = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % statuses.length);
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [intervalMs]);

  return statuses[currentIndex];
}
