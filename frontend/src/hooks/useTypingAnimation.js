// Extracted typing logic from Home.jsx
// Keeps Home.jsx clean

import { useEffect, useRef, useState } from 'react';
import { typedTexts } from './homeData';

export function useTypingAnimation(enabled = true) {
  const typingRef = useRef(null);
  const timerRef = useRef(null);
  const [showHeroText, setShowHeroText] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const words = typedTexts;
    let wordIndex = 0;
    let charIndex = 0;
    let currentText = "";
    let isDeleting = false;

    const typeEffect = () => {
      const typingEl = typingRef.current;
      if (!typingEl) return;

      const currentWord = words[wordIndex];

      if (!isDeleting) {
        currentText = currentWord.substring(0, charIndex + 1);
        charIndex += 1;
      } else {
        currentText = currentWord.substring(0, charIndex - 1);
        charIndex -= 1;
      }

      typingEl.textContent = currentText;

      let speed = isDeleting ? 60 : 120;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 400;
      }

      timerRef.current = window.setTimeout(typeEffect, speed);
    };

    timerRef.current = window.setTimeout(() => {
      setShowHeroText(true);
      typeEffect();
    }, 2400);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [enabled]);

  return { typingRef, showHeroText };
}