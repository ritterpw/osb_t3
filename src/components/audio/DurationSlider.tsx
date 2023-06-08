import React, { useState, useEffect, useRef } from "react";

const DurationSlider = ({ audio }: { audio: HTMLAudioElement }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audio, isDragging]);

  useEffect(() => {
    const updateDuration = () => {
      setDuration(audio.duration);
    };

    if (audio.duration && audio.duration !== Infinity && duration === 0) {
      // If duration is already available, set it immediately
      setDuration(audio.duration);
    } else {
      // If duration is not available, add an event listener to update it
      audio.addEventListener("loadedmetadata", updateDuration);
    }

    return () => {
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audio, duration]);

  const handleSliderChange = (event: any) => {
    const seekTime = parseFloat(event.target.value);
    setCurrentTime(seekTime);
    audio.currentTime = seekTime;
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (event: any) => {
    if (isDragging && sliderRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const offsetX = event.nativeEvent.offsetX;
      const newTime = (offsetX / sliderWidth) * duration;

      setCurrentTime(newTime);
      audio.currentTime = newTime;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="">
      <input
        ref={sliderRef}
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={currentTime}
        onChange={handleSliderChange}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="range  accent-emerald-600 bg-vercel-500"
      />
      <div>
        <span>{formatTime(currentTime)}</span> /{" "}
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default DurationSlider;
