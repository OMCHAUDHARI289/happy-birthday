import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import memory1 from '../assets/images/First.jpg';
import memory2 from '../assets/images/Second.jpg'; 
import memory3 from '../assets/images/Third.jpg';
import memory4 from '../assets/images/Fourth.jpg';
// Images are now directly accessed from the public directory

const Slideshow = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showHeartCursor, setShowHeartCursor] = useState(false);

  // Function to track mouse movement for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setShowHeartCursor(true);
    };

    const handleMouseLeave = () => {
      setShowHeartCursor(false);
    };

    const container = document.querySelector('.pink-gradient-bg');
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseEnter);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Function to handle image loading
  const handleImageLoad = (id) => {
    setImagesLoaded(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Function to handle image loading errors
  const handleImageError = (id) => {
    console.log(`Error loading image ${id}`);
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Generate fallback image for errors
  const getFallbackImage = (id) => {
    const colors = ['#ffb6c1', '#ffd700', '#98fb98', '#87cefa'];
    const color = colors[(id - 1) % colors.length];
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="${color}"/><text x="50%" y="50%" font-family="Arial" font-size="36" fill="white" text-anchor="middle">Memory ${id}</text></svg>`;
  };

  // Using direct paths to the images in public folder
  const memories = [
    { 
      id: 1, 
      src: '/images/First.jpg', 
      fallbackSrc: getFallbackImage(1),
      alt: 'Memory1',
      caption: 'That time we stayed up all night just talking and watching the sunrise. I\'ve never laughed so hard in my life!'
    },
    { 
      id: 2, 
      src: '/images/Second.jpg',
      fallbackSrc: getFallbackImage(2),
      alt: 'Memory2',
      caption: 'Our first road trip together. The car broke down but we still had the best time!'
    },
    { 
      id: 3, 
      src: '/images/Third.jpg',
      fallbackSrc: getFallbackImage(3),
      alt: 'Memory3',
      caption: 'Your birthday last year when we went dancing until 3am. You were glowing with happiness.'
    },
    { 
      id: 4, 
      src: '/images/Fourth.jpg',
      fallbackSrc: getFallbackImage(4),
      alt: 'Memory4',
      caption: 'The day we cooked together and almost burned down the kitchen, but the pasta was still somehow amazing!'
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === memories.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? memories.length - 1 : prev - 1));
  };

  const goToNextPage = () => {
    navigate('/cake-cutting');
  };

  const goToWelcome = () => {
    navigate('/');
  };

  // Preload all images
  useEffect(() => {
    // Create new image objects to preload
    memories.forEach(memory => {
      const img = new Image();
      img.src = memory.src;
      img.onload = () => handleImageLoad(memory.id);
      img.onerror = () => {
        handleImageError(memory.id);
        // Try loading the fallback
        const fallbackImg = new Image();
        fallbackImg.src = memory.fallbackSrc;
        fallbackImg.onload = () => handleImageLoad(memory.id);
      };
    });
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    let slideInterval;
    
    if (!isPaused) {
      slideInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev === memories.length - 1 ? 0 : prev + 1));
      }, 4000); // Change slide every 4 seconds
    }
    
    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [isPaused, memories.length]);

  // Function to handle drag/swipe gestures
  const handleDragStart = (e) => {
    if (e.type === 'touchstart') {
      setDragStart(e.touches[0].clientX);
    } else {
      setDragStart(e.clientX);
    }
  };

  const handleDragEnd = (e) => {
    if (e.type === 'touchend') {
      setDragEnd(e.changedTouches[0].clientX);
    } else {
      setDragEnd(e.clientX);
    }
    
    // If drag distance is significant, change slide
    const dragDistance = dragEnd - dragStart;
    if (Math.abs(dragDistance) > 50) { // Minimum drag distance to register
      if (dragDistance > 0) {
        // Dragged right - go to previous slide
        prevSlide();
      } else {
        // Dragged left - go to next slide
        nextSlide();
      }
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="container pink-gradient-bg">
      {showHeartCursor && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0.5 }}
          animate={{ 
            scale: [0.8, 1, 0.8], 
            opacity: [0.7, 1, 0.7], 
            rotate: [0, 10, 0, -10, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{
            position: 'fixed',
            left: cursorPosition.x - 15,
            top: cursorPosition.y - 15,
            pointerEvents: 'none',
            zIndex: 9999,
            width: '30px',
            height: '30px',
            color: '#ff3385',
            fontSize: '30px',
            userSelect: 'none'
          }}
        >
          ❤️
        </motion.div>
      )}
      <motion.div 
        className="slideshow-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <motion.div
          className="slideshow-controls-top"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            width: '100%'
          }}
        >
          <motion.button
            className="btn"
            onClick={() => setIsPaused(!isPaused)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ marginRight: '10px' }}
          >
            {isPaused ? '▶ Resume Slideshow' : '⏸ Pause Slideshow'}
          </motion.button>
        </motion.div>

        <motion.div 
          className="slideshow-content"
          style={{
            position: 'relative',
            width: '100%',
            height: '450px',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(255, 113, 168, 0.5)',
            background: 'white',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          <AnimatePresence initial={false} custom={currentSlide}>
            <motion.div
              key={memories[currentSlide].id}
              custom={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div 
                style={{
                  position: 'relative',
                  flex: '1',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={imageErrors[memories[currentSlide].id] ? memories[currentSlide].fallbackSrc : memories[currentSlide].src}
                  alt={memories[currentSlide].alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: imagesLoaded[memories[currentSlide].id] ? 1 : 0,
                    transition: 'opacity 0.5s ease'
                  }}
                  onLoad={() => handleImageLoad(memories[currentSlide].id)}
                  onError={() => handleImageError(memories[currentSlide].id)}
                />
                
                {!imagesLoaded[memories[currentSlide].id] && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: 'rgba(255, 204, 224, 0.5)'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '4px solid white',
                        borderTopColor: '#ff3385',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
                
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    padding: '20px',
                    background: 'linear-gradient(transparent, rgba(255, 113, 168, 0.9))',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <p style={{ fontSize: '16px', fontWeight: '500' }}>{memories[currentSlide].caption}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              right: '0',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0 20px',
              transform: 'translateY(-50%)',
              zIndex: 10
            }}
          >
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#ff3385',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              &lt;
            </motion.button>
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#ff3385',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              &gt;
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="slideshow-controls-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
            width: '100%'
          }}
        >
          <motion.button
            className="btn"
            onClick={goToWelcome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              backgroundColor: 'rgba(226, 41, 163, 0.7)',
              padding: '10px 20px'
            }}
          >
            ← Back to Welcome
          </motion.button>

          <motion.button
            className="btn"
            onClick={goToNextPage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next Surprise! →
          </motion.button>
        </motion.div>

        <motion.div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '20px' 
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {memories.map((memory, index) => (
            <motion.div
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? '#ff3385' : 'rgba(255, 255, 255, 0.7)',
                margin: '0 5px',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                position: 'relative'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Thumbnail preview on hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -10 }}
                whileHover={{ opacity: 1, scale: 1, y: -50 }}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '40px',
                  borderRadius: '5px',
                  overflow: 'hidden',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                  zIndex: 10,
                  border: '2px solid white'
                }}
              >
                <img
                  src={imageErrors[memory.id] ? memory.fallbackSrc : memory.src}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={() => handleImageError(memory.id)}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Slideshow; 