
import React, { useEffect, useState } from 'react';

const GeometricBackground: React.FC = () => {
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const shapeTypes = ['circle', 'square', 'triangle'];
    const colors = ['#8B5CF6', '#7E69AB', '#6E59A5', '#D6BCFA'];
    const newShapes = [];
    
    for (let i = 0; i < 25; i++) {
      const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 100 + 20;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const animationDuration = Math.random() * 20 + 10;
      const animationDelay = Math.random() * 5;
      
      newShapes.push(
        <div
          key={i}
          className={`shape ${shapeType}`}
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            animation: `float ${animationDuration}s ease-in-out ${animationDelay}s infinite, spin-slow ${animationDuration + 10}s linear ${animationDelay}s infinite`
          }}
        />
      );
    }
    
    setShapes(newShapes);
  }, []);
  
  return <div className="geometric-bg">{shapes}</div>;
};

export default GeometricBackground;
