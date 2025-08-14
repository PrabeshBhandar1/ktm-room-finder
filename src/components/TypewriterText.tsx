import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  words: string[];
  speed?: number;
  delay?: number;
  className?: string;
}

const TypewriterText = ({ words, speed = 100, delay = 2000, className = "" }: TypewriterTextProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeoutId: NodeJS.Timeout;
    
    if (isDeleting) {
      // Deleting effect
      if (currentText.length > 0) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, speed / 2);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      // Typing effect
      if (currentText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        }, speed);
      } else {
        // Finished typing, wait then start deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentText, currentWordIndex, isDeleting, words, speed, delay]);

  return (
    <span className={className}>
      {currentText}
      <span className="inline-block w-0.5 bg-brand-light-blue animate-pulse ml-1" style={{ height: '1em' }}></span>
    </span>
  );
};

export default TypewriterText;

