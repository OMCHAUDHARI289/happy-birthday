import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConfettiGenerator from 'confetti-js';

const CakeCutting = () => {
  const navigate = useNavigate();
  const [cakeCut, setCakeCut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [blowProgress, setBlowProgress] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cakeRef = useRef(null);
  const [cakeImageLoaded, setCakeImageLoaded] = useState(false);
  const [cakeImageError, setCakeImageError] = useState(false);

  // Define candles with more detail
  const candles = [
    { id: 1, top: '80px', left: '70%', size: '10px', height: '40px', color: '#ffcc00', blown: false },
    { id: 2, top: '80px', left: '85%', size: '10px', height: '40px', color: '#ffcc00', blown: false },
    { id: 3, top: '80px', left: '100%', size: '10px', height: '40px', color: '#ffcc00', blown: false },
    { id: 4, top: '80px', left: '115%', size: '10px', height: '40px', color: '#ffcc00', blown: false },
    { id: 5, top: '80px', left: '130%', size: '10px', height: '40px', color: '#ffcc00', blown: false },
  ];

  // State to track blown candles
  const [candleStates, setCandleStates] = useState(candles.map(candle => ({ ...candle, blown: false })));
  
  // Current playing song
  const [currentSong, setCurrentSong] = useState('Birthday Song');

  // Define cake image sources with fallbacks - using only local image
  const cakeImageSrc = '/images/birthday-cake.png';

  // Simplified cake image loading
  useEffect(() => {
    setCakeImageLoaded(true);
  }, []);

  // Set up confetti effect
  useEffect(() => {
    if (cakeCut) {
      const confettiSettings = {
        target: 'cake-confetti',
        max: 150,
        size: 2,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[255, 113, 168], [255, 204, 224], [255, 51, 133], [226, 41, 163], [255, 215, 0]],
        clock: 35,
        rotate: true,
        start_from_edge: true,
        respawn: false,
        width: window.innerWidth,
        height: window.innerHeight
      };
      
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
      
      // Show message after a delay
      setTimeout(() => {
        setShowMessage(true);
      }, 1500);
      
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
    }
  }, [cakeCut]);

  // Check if all candles are blown
  useEffect(() => {
    const allBlown = candleStates.every(candle => candle.blown);
    if (allBlown && candleStates.length > 0) {
      setCandlesBlown(true);
      setShowInstructions(false);
      setBlowProgress(100);
    } else {
      // Calculate progress based on blown candles
      const blownCount = candleStates.filter(candle => candle.blown).length;
      const progress = (blownCount / candleStates.length) * 100;
      setBlowProgress(progress);
    }
  }, [candleStates]);

  // Handle blowing on a specific candle
  const handleBlowCandle = (id) => {
    setCandleStates(prev => 
      prev.map(candle => 
        candle.id === id ? { ...candle, blown: true } : candle
      )
    );
  };

  // Handle general blowing (increases probability of blowing out candles)
  const handleBlowCandles = () => {
    setCandleStates(prev => {
      // Get unblown candles
      const unblownCandles = prev.filter(candle => !candle.blown);
      
      if (unblownCandles.length === 0) return prev;
      
      // Randomly select a candle to blow out
      const randomIndex = Math.floor(Math.random() * unblownCandles.length);
      const candleToBlowId = unblownCandles[randomIndex].id;
      
      return prev.map(candle => 
        candle.id === candleToBlowId ? { ...candle, blown: true } : candle
      );
    });
  };

  // Handle cake cutting - only works after candles are blown
  const handleCakeCut = () => {
    if (candlesBlown) {
      setCakeCut(true);
    }
  };

  // Added slice animation state and controls
  const [slicePosition, setSlicePosition] = useState({ x: 0, y: 0 });
  const [isSlicing, setIsSlicing] = useState(false);
  const [sliceComplete, setSliceComplete] = useState(false);
  const [sliceAnimating, setSliceAnimating] = useState(false);
  const [sliceProgress, setSliceProgress] = useState(0);
  const [slicePath, setSlicePath] = useState([]);
  
  const handleMouseDown = (e) => {
    if (candlesBlown && !cakeCut && !sliceAnimating) {
      setIsSlicing(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setSlicePosition(position);
      setSlicePath([position]);
    }
  };
  
  const handleMouseMove = (e) => {
    if (isSlicing && !sliceComplete && !sliceAnimating) {
      const rect = e.currentTarget.getBoundingClientRect();
      const currentPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Add point to slice path
      setSlicePath(prev => [...prev, currentPosition]);
      
      // If slice moved down enough, start slice animation
      if (currentPosition.y > slicePosition.y + 100) {
        setSliceComplete(true);
        setSliceAnimating(true);
        
        // Animate the slice
        let progress = 0;
        const sliceInterval = setInterval(() => {
          progress += 5;
          setSliceProgress(progress);
          
          if (progress >= 100) {
            clearInterval(sliceInterval);
            handleCakeCut();
          }
        }, 50);
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsSlicing(false);
  };

  const goToNextPage = () => {
    navigate('/greeting');
  };

  // Toggle music playing state and communicate with parent MusicPlayer
  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying);
    
    // Find and control the global music player
    const musicPlayerButton = document.querySelector('.music-player button');
    if (musicPlayerButton) {
      musicPlayerButton.click();
    }
  };

  // Listen for changes in the global music player
  useEffect(() => {
    const intervalId = setInterval(() => {
      const globalPlayer = document.querySelector('.music-player audio');
      if (globalPlayer) {
        setMusicPlaying(!globalPlayer.paused);
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Memory message for after cake is cut
  const memories = [
    "Our first meeting was on September 24, 2023. It feels like yesterday!",
    "Remember our first laugh together? That moment will stay with me forever.",
    "From strangers to something special, what a beautiful journey it's been.",
    "Every moment with you has been a gift I'll always cherish.",
    "Here's to creating many more beautiful memories together!"
  ];
  
  // Auto-play birthday song when component loads and hide main music player
  useEffect(() => {
    // Force play the birthday song and hide global controls
    setTimeout(() => {
      // Pause any existing music
      const globalPlayer = document.querySelector('.music-player audio');
      if (globalPlayer && !globalPlayer.paused) {
        // Store the current global song for later
        sessionStorage.setItem('previousSong', globalPlayer.src);
        sessionStorage.setItem('globalMusicWasPlaying', 'true');
        
        // Pause the global music
        const musicPlayerButton = document.querySelector('.music-player button');
        if (musicPlayerButton) {
          musicPlayerButton.click();
        }
      }
      
      // Play the birthday song
      setMusicPlaying(true);
      const birthdaySongButton = document.querySelector('.music-controls button');
      if (birthdaySongButton) {
        birthdaySongButton.click();
      }
      
      // Hide the global music player controls temporarily
      const musicPlayerDiv = document.querySelector('.music-player');
      if (musicPlayerDiv) {
        musicPlayerDiv.style.display = 'none';
      }
    }, 1000);
  }, []);

  // Resume original music when leaving this page
  useEffect(() => {
    return () => {
      // Show the music player again
      const musicPlayerDiv = document.querySelector('.music-player');
      if (musicPlayerDiv) {
        musicPlayerDiv.style.display = 'block';
      }
      
      // Resume the previous song if it was playing
      if (sessionStorage.getItem('globalMusicWasPlaying') === 'true') {
        setTimeout(() => {
          const musicPlayerButton = document.querySelector('.music-player button');
          if (musicPlayerButton) {
            musicPlayerButton.click();
          }
        }, 500);
      }
    };
  }, []);
  
  // Resume romantic music after cake is cut
  useEffect(() => {
    if (cakeCut) {
      // Pause birthday song
      setMusicPlaying(false);
      
      // After a small delay, show and resume the global music player
      setTimeout(() => {
        const musicPlayerDiv = document.querySelector('.music-player');
        if (musicPlayerDiv) {
          musicPlayerDiv.style.display = 'block';
        }
        
        // Resume the previous romantic song
        if (sessionStorage.getItem('globalMusicWasPlaying') === 'true') {
          const musicPlayerButton = document.querySelector('.music-player button');
          if (musicPlayerButton) {
            musicPlayerButton.click();
          }
        }
      }, 2000); // Wait for 2 seconds after cake is cut
    }
  }, [cakeCut]);

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

  return (
    <div className="container pink-gradient-bg">
      <canvas id="cake-confetti" className="confetti"></canvas>
      
      {/* Hidden music controls for automatic playback only */}
      <motion.div
        className="music-controls"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(5px)',
          padding: '8px 15px',
          borderRadius: '30px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ marginRight: '10px', fontSize: '14px', fontWeight: 'bold', color: '#e429a3' }}>
          {currentSong}
        </div>
        <motion.button
          onClick={toggleMusic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(228, 41, 163, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(228, 41, 163, 0.5)'
          }}
        >
          {musicPlaying ? '⏸️' : '▶️'}
        </motion.button>
      </motion.div>
      
      <motion.div 
        className="cake-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          padding: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          backdropFilter: 'blur(5px)',
          maxWidth: '600px',
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
          {!candlesBlown 
            ? "Make a Wish & Blow the Candles!" 
            : !cakeCut 
              ? "Now Cut the Cake!" 
              : "Happy Birthday!"}
        </motion.h1>
        
        {/* Blow progress indicator */}
        {!candlesBlown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              width: '200px',
              height: '10px',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '10px',
              margin: '0 auto 20px',
              overflow: 'hidden'
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${blowProgress}%` }}
              transition={{ type: 'spring', damping: 10 }}
              style={{
                height: '100%',
                background: 'linear-gradient(to right, #ff71a8, #e429a3)',
                borderRadius: '10px'
              }}
            />
          </motion.div>
        )}
        
        {/* Cartoon Cake */}
        <motion.div
          ref={cakeRef}
          variants={itemVariants}
          className="cake-container"
          style={{
            marginTop: '30px',
            marginBottom: '40px',
            position: 'relative',
            width: '280px',
            height: '280px',
            margin: '30px auto 40px'
          }}
        >
          {/* Cartoon Cake */}
          <motion.div
            className="cake"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              cursor: candlesBlown && !cakeCut ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><polygon points=\'16,0 32,32 0,32\' fill=\'%23000\'/></svg>") 16 32, auto' : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Cake plate */}
            <motion.div
              style={{
                width: '200px',
                height: '10px',
                background: '#ffd1dc',
                borderRadius: '50%',
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                border: '2px solid #000',
                zIndex: 1
              }}
            />
            
            {/* Bottom tier */}
            <motion.div
              style={{
                width: '180px',
                height: '60px',
                background: '#fdf5e6', // Off-white cake base
                position: 'absolute',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '5px 5px 20px 20px',
                border: '2px solid #000',
                zIndex: 2
              }}
            />
            
            {/* Bottom tier frosting */}
            <motion.div
              style={{
                width: '180px',
                height: '30px',
                background: '#a7e8ff', // Light blue frosting
                position: 'absolute',
                bottom: '90px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '5px 5px 0 0',
                border: '2px solid #000',
                borderBottom: 'none',
                zIndex: 3,
                display: 'flex'
              }}
            >
              {/* Wavy bottom edge */}
              <svg height="30" width="180" style={{ position: 'absolute', top: '25px', left: '-2px', zIndex: 4 }}>
                <path d="M0,0 Q15,10 30,0 Q45,10 60,0 Q75,10 90,0 Q105,10 120,0 Q135,10 150,0 Q165,10 180,0 V15 H0 Z" 
                      fill="#a7e8ff" stroke="#000" strokeWidth="2px" />
              </svg>
            </motion.div>

            {/* Middle tier */}
            <motion.div
              style={{
                width: '140px',
                height: '45px',
                background: '#fdf5e6', // Off-white cake base
                position: 'absolute',
                bottom: '90px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '5px 5px 20px 20px',
                border: '2px solid #000',
                zIndex: 5
              }}
            />
            
            {/* Middle tier frosting */}
            <motion.div
              style={{
                width: '140px',
                height: '25px',
                background: '#a7e8ff', // Light blue frosting
                position: 'absolute',
                bottom: '135px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '5px 5px 0 0',
                border: '2px solid #000',
                borderBottom: 'none',
                zIndex: 6
              }}
            >
              {/* Wavy bottom edge */}
              <svg height="30" width="140" style={{ position: 'absolute', top: '20px', left: '-2px', zIndex: 7 }}>
                <path d="M0,0 Q10,10 20,0 Q30,10 40,0 Q50,10 60,0 Q70,10 80,0 Q90,10 100,0 Q110,10 120,0 Q130,10 140,0 V15 H0 Z" 
                      fill="#a7e8ff" stroke="#000" strokeWidth="2px" />
              </svg>
            </motion.div>

            {/* Top tier */}
            <motion.div
              style={{
                width: '100px',
                height: '35px',
                background: '#fdf5e6', // Off-white cake base
                position: 'absolute',
                bottom: '135px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '5px 5px 20px 20px',
                border: '2px solid #000',
                zIndex: 8
              }}
            />
            
            {/* Top tier frosting */}
            <motion.div
              style={{
                width: '100px',
                height: '20px',
                background: '#a7e8ff', // Light blue frosting
                position: 'absolute',
                bottom: '170px',
                left: '50%',
                transform: 'translateX(-50%)',
                borderRadius: '5px 5px 0 0', 
                border: '2px solid #000',
                borderBottom: 'none',
                zIndex: 9
              }}
            >
              {/* Wavy bottom edge */}
              <svg height="30" width="100" style={{ position: 'absolute', top: '15px', left: '-2px', zIndex: 10 }}>
                <path d="M0,0 Q8,10 16,0 Q24,10 32,0 Q40,10 48,0 Q56,10 64,0 Q72,10 80,0 Q88,10 96,0 V15 H0 Z" 
                      fill="#a7e8ff" stroke="#000" strokeWidth="2px" />
              </svg>
            </motion.div>

            {/* Sprinkles */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: `${2 + Math.random() * 3}px`,
                  height: `${1 + Math.random() * 2}px`,
                  background: ['#ff9eb5', '#ffcc00', '#6bd5e1', '#9fe26b', '#e29ff7'][Math.floor(Math.random() * 5)],
                  position: 'absolute',
                  bottom: `${40 + Math.random() * 150}px`,
                  left: `${80 + Math.random() * 120}px`,
                  transform: `rotate(${Math.random() * 180}deg)`,
                  zIndex: 12,
                  border: '1px solid #000'
                }}
              />
            ))}
            
            {/* Pink candles with yellow flames */}
            {candleStates.map(candle => (
              <div key={candle.id} style={{ position: 'absolute', zIndex: 15 }}>
                {/* Candle stem */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: candle.top,
                    left: candle.left,
                    transform: 'translateX(-50%)',
                    width: '6px',
                    height: candle.height,
                    background: '#ffd1dc', // Pink candle
                    border: '1px solid #000',
                    zIndex: 16
                  }}
                />
                
                {/* Candle wick */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: `calc(${candle.top} - 7px)`,
                    left: candle.left,
                    transform: 'translateX(-50%)',
                    width: '1px',
                    height: '7px',
                    background: '#000', // Black wick
                    zIndex: 17
                  }}
                />
                
                {/* Candle flame - only visible if not blown */}
                {!candle.blown && (
                  <motion.div
                    onClick={() => handleBlowCandle(candle.id)}
                    style={{
                      position: 'absolute',
                      top: `calc(${candle.top} - 15px)`,
                      left: candle.left,
                      transform: 'translateX(-50%)',
                      width: '12px',
                      height: '15px',
                      background: '#ffcc00', // Yellow flame
                      borderRadius: '50% 50% 50% 50%',
                      border: '1px solid #000',
                      cursor: 'pointer',
                      zIndex: 18
                    }}
                    animate={{ 
                      scaleY: [1, 1.1, 1],
                      scaleX: [1, 0.9, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.8
                    }}
                  >
                    {/* Inner flame */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        bottom: '25%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '6px',
                        height: '8px',
                        background: '#ffffcc',
                        borderRadius: '50%',
                        zIndex: 19
                      }}
                    />
                  </motion.div>
                )}
              </div>
            ))}
            
            {/* Slice guide - only shows after candles blown */}
            {candlesBlown && !cakeCut && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: '70px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  textAlign: 'center',
                  color: '#333',
                  background: 'rgba(255,255,255,0.7)',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  zIndex: 22,
                  pointerEvents: 'none'
                }}
              >
                ↓ Slice Here ↓
              </motion.div>
            )}
            
            {/* Slicing visual indicator with path */}
            {isSlicing && !cakeCut && (
              <>
                {/* Main slice line */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: slicePosition.y,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'rgba(255, 0, 0, 0.7)',
                    zIndex: 25,
                    pointerEvents: 'none'
                  }}
                />
                
                {/* Slice path visualization */}
                <svg 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 26,
                    pointerEvents: 'none'
                  }}
                >
                  {slicePath.length > 1 && (
                    <path
                      d={`M ${slicePath.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                      stroke="rgba(255, 0, 0, 0.5)"
                      strokeWidth="3"
                      fill="none"
                    />
                  )}
                </svg>
              </>
            )}
            
            {/* Slice animation */}
            {sliceAnimating && !cakeCut && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: slicePosition.y,
                  left: 0,
                  width: '100%',
                  height: `${sliceProgress}%`,
                  background: 'rgba(255, 0, 0, 0.2)',
                  borderTop: '2px solid rgba(255, 0, 0, 0.8)',
                  borderBottom: '2px solid rgba(255, 0, 0, 0.8)',
                  zIndex: 24,
                  pointerEvents: 'none',
                  clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)'
                }}
              />
            )}

            {/* Cake cut effect */}
            {cakeCut && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '25%',
                  width: '60px',
                  height: '140px',
                  background: '#fdf5e6',
                  border: '2px solid #000',
                  borderRight: 'none',
                  borderBottomRightRadius: '20px',
                  clipPath: 'polygon(0 0, 100% 20%, 80% 100%, 0 100%)',
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Cake slice layers */}
                <div style={{
                  height: '33%', 
                  background: '#a7e8ff',
                  borderBottom: '1px solid #000'
                }}/>
                <div style={{
                  height: '33%', 
                  background: '#fdf5e6',
                  borderBottom: '1px solid #000'
                }}/>
                <div style={{
                  height: '34%', 
                  background: '#a7e8ff'
                }}/>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        {showInstructions ? (
          <motion.div
            variants={itemVariants}
            style={{ marginBottom: '30px' }}
          >
            <motion.p>
              Click on each candle flame to blow it out! Or use the button below. 🎂🌬️
            </motion.p>
            {/* Blow button that works on mobile too */}
            <motion.button
              onClick={handleBlowCandles}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'rgba(255, 113, 168, 0.2)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '50px',
                marginTop: '15px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Blow! 💨
            </motion.button>
          </motion.div>
        ) : !cakeCut ? (
          <motion.p 
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginBottom: '30px' }}
          >
            Great job! Now drag the knife to cut the cake or tap it! 🎂✨
          </motion.p>
        ) : (
          <AnimatePresence>
            {showMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.p 
                  style={{ 
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    color: '#ff3385'
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: 2 }}
                >
                  Happy Birthday! May all your wishes come true! 🎉
                </motion.p>
                
                <motion.p
                  style={{
                    fontSize: '16px',
                    fontStyle: 'italic',
                    marginBottom: '30px',
                    color: '#e429a3'
                  }}
                >
                  {memories[Math.floor(Math.random() * memories.length)]}
                </motion.p>
                
                <motion.button 
                  className="btn"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 20px rgba(228, 41, 163, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToNextPage}
                >
                  See Your Birthday Message! 💌
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default CakeCutting; 
 