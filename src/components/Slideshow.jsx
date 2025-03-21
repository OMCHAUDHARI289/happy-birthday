import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Slideshow = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // CUSTOMIZE: Replace these sample memories with your own images and captions
  // You can:
  // 1. Add your images to the src/assets folder
  // 2. Import them like: import image1 from '../assets/your-image.jpg'
  // 3. Use them here like: { id: 1, src: image1, alt: 'Description', caption: 'Your caption' }
  // OR use external image URLs like the placeholders below
  const memories = [
    { 
      id: 1, 
      src: 'https://via.placeholder.com/600x400/ffb6c1/ffffff?text=Memory+1', 
      alt: 'Memory 1',
      caption: 'That time we stayed up all night just talking and watching the sunrise. I\'ve never laughed so hard in my life!'
    },
    { 
      id: 2, 
      src: 'https://via.placeholder.com/600x400/ffb6c1/ffffff?text=Memory+2', 
      alt: 'Memory 2',
      caption: 'Our first road trip together. The car broke down but we still had the best time!'
    },
    { 
      id: 3, 
      src: 'https://via.placeholder.com/600x400/ffb6c1/ffffff?text=Memory+3', 
      alt: 'Memory 3',
      caption: 'Your birthday last year when we went dancing until 3am. You were glowing with happiness.'
    },
    { 
      id: 4, 
      src: 'https://via.placeholder.com/600x400/ffb6c1/ffffff?text=Memory+4', 
      alt: 'Memory 4',
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
                  src={memories[currentSlide].src}
                  alt={memories[currentSlide].alt}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
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
          {memories.map((_, index) => (
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
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Slideshow; 