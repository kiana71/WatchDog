import { useState, useRef, useEffect } from 'react';

const TruncatedText = ({ text, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkAndTruncateText = () => {
      if (!containerRef.current || !text) return;

      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      
      // If expanded, show full text
      if (isExpanded) {
        setDisplayText(text);
        setIsTruncated(text.length > 0);
        return;
      }

      // Create a temporary element to measure text width
      const measurer = document.createElement('span');
      measurer.style.visibility = 'hidden';
      measurer.style.position = 'absolute';
      measurer.style.whiteSpace = 'nowrap';
      measurer.style.fontSize = window.getComputedStyle(container).fontSize;
      measurer.style.fontFamily = window.getComputedStyle(container).fontFamily;
      measurer.style.fontWeight = window.getComputedStyle(container).fontWeight;
      
      document.body.appendChild(measurer);

      // Test if full text fits
      measurer.textContent = text;
      const fullTextWidth = measurer.offsetWidth;

      if (fullTextWidth <= containerWidth - 3) {
        // Text fits, no truncation needed
        setDisplayText(text);
        setIsTruncated(false);
      } else {
        // Text doesn't fit, find the right length
        let truncatedLength = text.length;
        while (truncatedLength > 0) {
          const truncatedText = text.substring(0, truncatedLength) + '...';
          measurer.textContent = truncatedText;
          
          if (measurer.offsetWidth <= containerWidth - 3) {
            setDisplayText(truncatedText);
            setIsTruncated(true);
            break;
          }
          truncatedLength--;
        }
        
        // Fallback if even single character doesn't fit
        if (truncatedLength === 0) {
          setDisplayText('...');
          setIsTruncated(true);
        }
      }

      document.body.removeChild(measurer);
    };

    // Check on mount and when dependencies change
    const timeoutId = setTimeout(checkAndTruncateText, 0);

    // Set up ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      checkAndTruncateText();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [text, isExpanded]);

  if (!text) {
    return <span>N/A</span>;
  }

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent row click
    setIsExpanded(!isExpanded);
  };

  const needsClick = isTruncated || (isExpanded && text.length > displayText.replace('...', '').length);

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
    >
      <span
        className={`
          ${isExpanded ? 'whitespace-normal break-words' : 'whitespace-nowrap'} 
          ${needsClick ? 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors' : ''}
          block
        `}
        onClick={needsClick ? handleClick : undefined}
        title={
          needsClick
            ? (isExpanded ? "Click to collapse" : "Click to expand") 
            : undefined
        }
      >
        {displayText}
      </span>
    </div>
  );
};

export default TruncatedText;