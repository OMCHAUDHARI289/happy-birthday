import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This is a reusable music player component that can be placed in any corner of the screen
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  // Array of songs to play with fallback URLs
  const songs = [
    { 
      title: "Birthday Song", 
      url: "/birthday-song.mp3",
      fallbackUrl: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3",
      artist: "Birthday Artist"
    },
    // Add more songs here as needed
  ];

  const currentSong = songs[currentSongIndex];

  // Initialize audio element with better error handling
  useEffect(() => {
    if (audioRef.current) {
      // Set volume
      audioRef.current.volume = volume;
      
      const handleLoadStart = () => {
        setIsLoading(true);
        setLoadError(false);
      };
      
      const handleCanPlay = () => {
        setIsLoading(false);
        // Try to play automatically
        if (isPlaying) {
          audioRef.current.play().catch(error => {
            console.log("Autoplay prevented:", error);
            setIsPlaying(false);
          });
        }
      };
      
      const handleError = (error) => {
        console.error("Audio error:", error);
        setLoadError(true);
        setIsLoading(false);
        
        // Try fallback URL
        if (currentSong.fallbackUrl && audioRef.current.src !== currentSong.fallbackUrl) {
          console.log("Trying fallback URL:", currentSong.fallbackUrl);
          audioRef.current.src = currentSong.fallbackUrl;
        }
      };
      
      audioRef.current.addEventListener('loadstart', handleLoadStart);
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('error', handleError);
      
      // Setup time update event
      const updateTime = () => {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      };
      
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', updateTime);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadstart', handleLoadStart);
          audioRef.current.removeEventListener('canplay', handleCanPlay);
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.removeEventListener('timeupdate', updateTime);
          audioRef.current.removeEventListener('loadedmetadata', updateTime);
        }
      };
    }
  }, []);

  // Update audio when song changes
  useEffect(() => {
    if (audioRef.current) {
      setIsLoading(true);
      
      // Try loading from relative URL first
      audioRef.current.src = currentSong.url;
      
      // Add a timeout to try fallback if loading takes too long
      const timeoutId = setTimeout(() => {
        if (isLoading && !loadError) {
          console.log("Loading taking too long, trying fallback URL");
          if (currentSong.fallbackUrl && audioRef.current.src !== currentSong.fallbackUrl) {
            audioRef.current.src = currentSong.fallbackUrl;
          }
        }
      }, 3000);
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.log("Play error:", error);
        });
      }
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentSongIndex, currentSong.url]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log("Play toggle error:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === songs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const playPreviousSong = () => {
    setCurrentSongIndex((prevIndex) => 
      prevIndex === 0 ? songs.length - 1 : prevIndex - 1
    );
  };
  
  // Format time to MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  
  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Handle seeking
  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    if (audioRef.current && !isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  return (
    <div className="music-player" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={playNextSong}
        loop={false}
        src={currentSong.url}
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: showControls ? '15px' : '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          width: showControls ? '280px' : 'auto',
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ width: '100%', overflow: 'hidden', marginBottom: '10px' }}
            >
              {/* Song info with artist */}
              <div style={{ 
                padding: '8px 0',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#e429a3'
              }}>
                <div>{currentSong.title}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{currentSong.artist}</div>
                {isLoading && (
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                    Loading audio...
                  </div>
                )}
                {loadError && (
                  <div style={{ fontSize: '11px', color: '#e74c3c', marginTop: '4px' }}>
                    Error loading audio. Trying alternative source...
                  </div>
                )}
              </div>
              
              {/* Progress bar */}
              <div 
                onClick={handleSeek}
                style={{
                  width: '100%',
                  height: '4px',
                  background: 'rgba(228, 41, 163, 0.2)',
                  borderRadius: '2px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'rgba(228, 41, 163, 0.8)',
                    borderRadius: '2px',
                    position: 'absolute'
                  }}
                />
              </div>
              
              {/* Time display */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                marginBottom: '10px',
                color: '#666'
              }}>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              {/* Song controls */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={playPreviousSong}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '5px 10px'
                  }}
                >
                  ⏮️
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  style={{
                    background: 'rgba(228, 41, 163, 0.8)',
                    border: 'none',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: 'white',
                    cursor: 'pointer',
                    margin: '0 10px'
                  }}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={playNextSong}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '5px 10px'
                  }}
                >
                  ⏭️
                </motion.button>
              </div>
              
              {/* Volume control */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0 10px'
              }}>
                <div style={{ marginRight: '10px' }}>
                  {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{
                    width: '100%',
                    height: '4px',
                    borderRadius: '2px',
                    appearance: 'none',
                    background: `linear-gradient(to right, rgba(228, 41, 163, 0.8) 0%, rgba(228, 41, 163, 0.8) ${volume * 100}%, rgba(228, 41, 163, 0.2) ${volume * 100}%, rgba(228, 41, 163, 0.2) 100%)`
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Always visible control */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!showControls && (
            <div style={{ 
              marginRight: '10px',
              fontSize: '12px',
              color: '#e429a3',
              fontWeight: 'bold',
              maxWidth: '100px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentSong.title}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            style={{
              background: 'rgba(228, 41, 163, 0.8)',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </motion.button>
          {!showControls && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'rgba(228, 41, 163, 0.3)',
                border: 'none',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#e429a3',
                cursor: 'pointer',
                marginLeft: '5px'
              }}
            >
              🎵
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MusicPlayer; 