import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConfettiGenerator from 'confetti-js';

const Welcome = ({ onStart }) => {
  const navigate = useNavigate();
  const [showGiftText, setShowGiftText] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Set up confetti effect
  useEffect(() => {
    const confettiSettings = {
      target: 'confetti-canvas',
      max: 80,
      size: 1.8,
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

  // Ensure romantic music is playing on this page
  useEffect(() => {
    // Make sure romantic music (index 0) is playing
    const musicPlayerDiv = document.querySelector('.music-player');
    if (musicPlayerDiv) {
      // Check if we need to switch to the romantic song
      if (sessionStorage.getItem('currentSongIndex') !== '0') {
        // Find the previous button and click it to switch to the romantic song
        const prevButton = musicPlayerDiv.querySelector('button:nth-child(1)');
        if (prevButton) {
          prevButton.click();
        }
      }
      
      // Play the music if it's not already playing
      setTimeout(() => {
        const globalPlayer = document.querySelector('.music-player audio');
        if (globalPlayer && globalPlayer.paused) {
          const playButton = musicPlayerDiv.querySelector('button');
          if (playButton) {
            playButton.click();
          }
        }
      }, 800);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    // Set birthday for tomorrow
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = tomorrow - now;
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Track mouse position for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 15;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleButtonClick = () => {
    onStart();
    navigate('/memory-lane');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  // Floating animation
  const floatingAnimation = {
    y: [0, -10, 0],
    rotateZ: [0, 1, 0, -1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Format countdown time
  const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');

  return (
    <div className="container pink-gradient-bg">
      <canvas id="confetti-canvas" className="confetti"></canvas>
      
      {/* Countdown timer */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute',
          top: '20px',
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '10px 20px',
          borderRadius: '50px',
          boxShadow: '0 5px 15px rgba(228, 41, 163, 0.3)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 3
        }}
      >
        <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#e429a3' }}>
          Birthday In: 
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              background: 'rgba(255, 51, 133, 0.1)',
              padding: '2px 6px',
              borderRadius: '5px'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{formatTimeUnit(countdown.hours)}</span>
            <span style={{ fontSize: '10px' }}>hrs</span>
          </motion.div>
          <span style={{ fontWeight: 'bold' }}>:</span>
          <motion.div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              background: 'rgba(255, 51, 133, 0.1)',
              padding: '2px 6px',
              borderRadius: '5px'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: 0.2 }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{formatTimeUnit(countdown.minutes)}</span>
            <span style={{ fontSize: '10px' }}>mins</span>
          </motion.div>
          <span style={{ fontWeight: 'bold' }}>:</span>
          <motion.div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              background: 'rgba(255, 51, 133, 0.1)',
              padding: '2px 6px',
              borderRadius: '5px'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: 0.4 }}
          >
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{formatTimeUnit(countdown.seconds)}</span>
            <span style={{ fontSize: '10px' }}>secs</span>
          </motion.div>
        </div>
      </motion.div>
      
      {/* 3D floating card with perspective effect */}
      <motion.div 
        className="welcome-card-perspective"
        style={{
          perspective: "1000px",
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          justifyContent: "center"
        }}
        animate={floatingAnimation}
      >
        <motion.div 
          className="welcome-card"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(5px)',
            width: '90%',
            boxShadow: '0 10px 30px rgba(255, 113, 168, 0.3), 0 0 100px rgba(255, 113, 168, 0.2)',
            transformStyle: "preserve-3d",
            transform: `rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`,
            transition: "transform 0.2s ease-out"
          }}
        >
          <motion.h1 
            className="page-title"
            variants={itemVariants}
            style={{ 
              marginBottom: '10px', 
              color: '#e429a3',
              textShadow: '2px 2px 4px rgba(228, 41, 163, 0.3)',
              transform: "translateZ(50px)"
            }}
          >
            Happy Birthday, My Baby! 
          </motion.h1>
          
          <motion.div 
            variants={itemVariants} 
            style={{ 
              fontSize: '30px', 
              marginBottom: '30px',
              transform: "translateZ(40px)"
            }}
          >
            <motion.span
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ display: 'inline-block', marginRight: '8px', filter: "drop-shadow(0 0 5px gold)" }}
            >
              🎉
            </motion.span>
            <motion.span
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                y: [0, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              style={{ display: 'inline-block', filter: "drop-shadow(0 0 5px rgba(255, 0, 0, 0.5))" }}
            >
              🎂
            </motion.span>
          </motion.div>
          
          <motion.div
            style={{ position: 'relative', transform: "translateZ(30px)" }}
            onHoverStart={() => setShowGiftText(true)}
            onHoverEnd={() => setShowGiftText(false)}
          >
            <motion.button 
              className="btn"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 8px 20px rgba(228, 41, 163, 0.5)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleButtonClick}
            >
              Let's Go! ✨
            </motion.button>
            
            {/* Gift hint text on hover */}
            <AnimatePresence>
              {showGiftText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '5px 10px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#e429a3',
                    boxShadow: '0 3px 10px rgba(228, 41, 163, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🎁 Click for your special gifts!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Welcome; 