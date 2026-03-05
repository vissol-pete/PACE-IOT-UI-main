import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation(); // Get the current location (URL)

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when location changes
  }, [location]); // Trigger effect whenever the location changes

  return null;
};

export default ScrollToTop;