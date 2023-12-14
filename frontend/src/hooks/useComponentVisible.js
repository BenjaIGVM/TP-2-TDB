import { set } from 'date-fns';
import { useState, useEffect, useRef } from 'react';

// hook que permite cerrar un componente al hacer click fuera de el
export const useComponentVisible = (showResults) => {
  const [isComponentVisible, setIsComponentVisible] = useState(showResults);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setIsComponentVisible(false);
        // setSearch("");
      }
    });

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
};
