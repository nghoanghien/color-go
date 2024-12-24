import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

const InfoTooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState('center');
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    if (tooltipRef.current && isVisible) {
      const rect = tooltipRef.current.getBoundingClientRect();
      if (rect.left < 0) {
        setPosition('left');
      } else if (rect.right > window.innerWidth) {
        setPosition('right');
      } else {
        setPosition('center');
      }
    }
  }, [isVisible]);

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-0 translate-x-0';
      case 'right':
        return 'right-0 translate-x-0';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-pointer text-gray-500 hover:text-gray-700"
      >
        <Info size={20} />
      </div>
      
      <div 
        ref={tooltipRef}
        className={`absolute bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-sm rounded-lg transform transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        } ${getPositionClasses()}`}
      >
        {text}
        <div className={`absolute -bottom-1 ${
          position === 'left' ? 'left-2' : 
          position === 'right' ? 'right-2' : 
          'left-1/2 -translate-x-1/2'
        } w-2 h-2 bg-gray-800 rotate-45`}/>
      </div>
    </div>
  );
};

export default InfoTooltip;