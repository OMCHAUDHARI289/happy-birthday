import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConfettiGenerator from 'confetti-js';

const MemoryLane = () => {
  const navigate = useNavigate();
  
  // Sample memory images - REPLACE THESE WITH YOUR OWN IMAGES
  // You can:
  // 1. Add your images to the src/assets folder
  // 2. Import them like: import image1 from '../assets/your-image.jpg'
  // 3. Use them in the memories array like: { id: 1, src: image1, alt: 'Description', caption: 'Your caption' }
  // OR you can use external image URLs like the placeholders below
  const memories = [
    { id: 1, src: 'https://via.placeholder.com/300x200/ffb6c1/ffffff?text=Memory+1', alt: 'Memory 1' },
    { id: 2, src: 'https://via.placeholder.com/300x200/ffb6c1/ffffff?text=Memory+2', alt: 'Memory 2' },
    { id: 3, src: 'https://via.placeholder.com/300x200/ffb6c1/ffffff?text=Memory+3', alt: 'Memory 3' },
    { id: 4, src: 'https://via.placeholder.com/300x200/ffb6c1/ffffff?text=Memory+4', alt: 'Memory 4' },
  ];

  // Set up confetti and balloon effects
  useEffect(() => {
    // Confetti settings
    const confettiSettings = {
      target: 'memory-confetti',
      max: 50,
      size: 1.2,
      animate: true,
      props: ['circle', 'square', 'triangle', 'line'],
      colors: [[255, 113, 168], [255, 204, 224], [255, 51, 133], [226, 41, 163]],
      clock: 40,
      rotate: true,
      width: window.innerWidth,
      height: window.innerHeight,
      start_from_edge: true,
      respawn: false
    };
    
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    
    // Handle window resize for confetti
    const handleResize = () => {
      confetti.clear();
      confetti.render();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      confetti.clear();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartSlideshow = () => {
    navigate('/slideshow');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  const photoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: 'spring',
        damping: 15,
        stiffness: 100
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="container pink-gradient-bg">
      <canvas id="memory-confetti" className="confetti"></canvas>
      
      <motion.div 
        className="memory-lane-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          backdropFilter: 'blur(5px)',
          maxWidth: '800px',
          width: '90%',
          boxShadow: '0 10px 30px rgba(255, 113, 168, 0.3)',
          zIndex: 3,
          position: 'relative'
        }}
      >
        <motion.h1 
          className="page-title"
          variants={itemVariants}
          style={{ color: '#e429a3' }}
        >
          Our Memory Lane
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          style={{ 
            fontSize: '16px', 
            marginBottom: '30px',
            maxWidth: '600px',
            margin: '0 auto 30px'
          }}
        >
          A journey through the most incredible moments we've shared together. 
          Hover over each photo to see why these memories mean so much to me! ✨❤️
        </motion.p>
        
        <motion.div 
          className="memory-grid"
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              variants={photoVariants}
              whileHover="hover"
              className="memory-item"
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                background: '#ffffff',
                height: '100%'
              }}
            >
              <img 
                src={memory.src} 
                alt={memory.alt}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.button 
          className="btn"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 8px 20px rgba(228, 41, 163, 0.5)'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartSlideshow}
          style={{ padding: '12px 25px' }}
        >
          <motion.span 
            style={{ marginRight: '8px' }}
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ▶
          </motion.span>
          Start Slideshow
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MemoryLane; 