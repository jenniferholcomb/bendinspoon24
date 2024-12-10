import { useState, useEffect } from "react";

function useResize() {
  const [orientation, setOrientation] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isWdDesktop, setIsWdDesktop] = useState(false);

  const handleResize = () => {
    window.innerWidth < window.innerHeight ?
    setOrientation('portrait')
    : setOrientation('landscape');

    window.innerWidth < 667 ?
    setIsMobile(true) 
    : (setIsMobile(false), setIsTablet(false));
  
    window.innerWidth < 1025 ?
      (setIsDesktop(false), setIsTablet(true))
      : setIsDesktop(true);

    window.innerWidth < 1400 ?
      setIsWdDesktop(false)
      : setIsWdDesktop(true);
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return _ => {
      window.removeEventListener('resize', handleResize);
    }
  });

  return [orientation, isMobile, isTablet, isDesktop, isWdDesktop ];
};

export default useResize;
