import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = () => {
   const audioRef = useRef<HTMLAudioElement | null>(null);
   const [volume, setVolume] = useState(0.5); 

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.volume = volume;
      }
   }, [volume]);

   return (
      <div>
         <audio ref={audioRef} src="your-audio-file.mp3" controls></audio>
         <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
         />
      </div>
   );
};

export default AudioPlayer;