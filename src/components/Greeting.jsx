import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConfettiGenerator from 'confetti-js';

const Greeting = () => {
  const navigate = useNavigate();
  const [typingComplete, setTypingComplete] = useState(false);
  const [hearts, setHearts] = useState([]);

  // Personal message - update this with your own heartfelt message
  const message = `Dearest Bestie,

On your special day, I want to take a moment to say just how much you mean to me. Through all our adventures, late-night talks, silly moments, and even the tough times, you've been my rock.

Your kindness, laughter, and amazing spirit light up every room you enter. You have this incredible way of making everyone feel special, especially me.

I'm so grateful for all the memories we've created together, and I can't wait to make many more. You deserve all the happiness in the world today and always.

Happy Birthday to the most amazing person I know! Here's to celebrating you today and always.

With all my love,
Your Bestie ❤️`;

  // Set up confetti and floating heart effects
  useEffect(() => {
    // Pause any playing music when greeting page loads
    const globalPlayer = document.querySelector('.music-player audio');
    if (globalPlayer && !globalPlayer.paused) {
      // Store that music was playing
      sessionStorage.setItem('globalMusicWasPlaying', 'true');
      
      // Pause the music
      const musicPlayerButton = document.querySelector('.music-player button');
      if (musicPlayerButton) {
        musicPlayerButton.click();
      }
    }
    
    // Confetti settings
    const confettiSettings = {
      target: 'greeting-confetti',
      max: 60,
      size: 1.5,
      animate: true,
      props: ['circle', 'square', 'triangle', 'line'],
      colors: [[255, 113, 168], [255, 204, 224], [255, 51, 133], [226, 41, 163], [255, 215, 0]],
      clock: 40,
      rotate: true,
      width: window.innerWidth,
      height: window.innerHeight,
      start_from_edge: true,
      respawn: false
    };
    
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
    
    // Generate random floating hearts
    const interval = setInterval(() => {
      if (hearts.length < 10) {
        const newHeart = {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 10 + 10,
          rotation: Math.random() * 360
        };
        setHearts(prevHearts => [...prevHearts, newHeart]);
      }
    }, 1000);
    
    // Set typing complete after delay
    const timeout = setTimeout(() => {
      setTypingComplete(true);
    }, 4000);
    
    // Handle window resize for confetti
    const handleResize = () => {
      confetti.clear();
      confetti.render();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      confetti.clear();
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
      
      // Resume romantic music (index 0) when leaving the greeting page
      setTimeout(() => {
        // Set song index to romantic song (0)
        if (sessionStorage.getItem('currentSongIndex') !== '0') {
          const musicPlayerDiv = document.querySelector('.music-player');
          if (musicPlayerDiv) {
            // Find the previous button and click it to switch to the romantic song
            const prevButton = musicPlayerDiv.querySelector('button:nth-child(1)');
            if (prevButton) {
              prevButton.click();
            }
          }
        }
        
        // Resume the romantic song if it was playing before
        if (sessionStorage.getItem('globalMusicWasPlaying') === 'true') {
          setTimeout(() => {
            const musicPlayerButton = document.querySelector('.music-player button');
            if (musicPlayerButton) {
              musicPlayerButton.click();
            }
            // Clear the flag
            sessionStorage.removeItem('globalMusicWasPlaying');
          }, 500);
        }
      }, 1000);
    };
  }, [hearts.length]);

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

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="container pink-gradient-bg">
      <canvas id="greeting-confetti" className="confetti"></canvas>
      
      {/* Floating hearts */}
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', x: `${heart.x}vw`, opacity: 0.7, rotate: heart.rotation }}
          animate={{ 
            y: '-10vh', 
            opacity: [0.7, 1, 0.7],
            rotate: heart.rotation + 360
          }}
          transition={{ 
            duration: heart.duration,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            fontSize: `${heart.size}px`,
            zIndex: 1,
            pointerEvents: 'none',
            filter: 'drop-shadow(0 0 5px rgba(255, 113, 168, 0.5))'
          }}
        >
          ❤️
        </motion.div>
      ))}
      
      <motion.div 
        className="greeting-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          backdropFilter: 'blur(5px)',
          maxWidth: '700px',
          width: '90%',
          boxShadow: '0 10px 30px rgba(255, 113, 168, 0.3)',
          position: 'relative',
          zIndex: 3
        }}
      >
        <motion.h1 
          className="page-title"
          variants={itemVariants}
          style={{ color: '#e429a3', marginBottom: '30px' }}
        >
          A Special Birthday Message
        </motion.h1>
        
        <motion.div 
          className="message-container"
          variants={itemVariants}
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '30px',
            borderRadius: '15px',
            border: '2px dashed #ff71a8',
            marginBottom: '30px',
            textAlign: 'left',
            position: 'relative',
            maxHeight: '350px',
            overflowY: 'auto'
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#4a154b',
              whiteSpace: 'pre-line'
            }}
          >
            {message}
            <motion.span
              animate={{ opacity: typingComplete ? 0 : 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              style={{ marginLeft: '2px' }}
            >
              |
            </motion.span>
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '24px'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            ✨
          </motion.div>
          <motion.div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              fontSize: '24px'
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            ✨
          </motion.div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          <motion.button 
            className="btn"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 20px rgba(228, 41, 163, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={goToHome}
          >
            Back to Start ✨
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Greeting; 