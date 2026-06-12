'use client';

import React from 'react';

interface PlaybackPanelProps {
  isPlaying: boolean;
  stepIdx: number;
  totalSteps: number;
  speedMs: number;
  onPlayToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function PlaybackPanel({
  isPlaying,
  stepIdx,
  totalSteps,
  speedMs,
  onPlayToggle,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
}: PlaybackPanelProps) {
  // Map speedMs back to slider range (value = 1000 - speedMs)
  const sliderValue = 1000 - speedMs;

  return (
    <div id="playback-controls">
      <div className="playback-buttons">
        <button
          className="btn-icon"
          id="btn-step-bk"
          title="Step Backward"
          disabled={stepIdx === 0}
          onClick={onStepBackward}
        >
          ◀ BACK
        </button>
        <button
          className={`btn-icon ${isPlaying ? 'active' : ''}`}
          id="btn-play"
          title="Play / Pause"
          disabled={totalSteps <= 1}
          onClick={onPlayToggle}
        >
          {isPlaying ? '⚡ PAUSE' : '▶ PLAY'}
        </button>
        <button
          className="btn-icon"
          id="btn-step-fw"
          title="Step Forward"
          disabled={stepIdx === totalSteps - 1 || totalSteps <= 1}
          onClick={onStepForward}
        >
          FWD ▶
        </button>
        <button
          className="btn-icon"
          id="btn-reset"
          title="Reset Simulation"
          onClick={onReset}
        >
          ♻ RESET
        </button>
      </div>

      {/* Speed Slider */}
      <div className="speed-slider-row">
        <span>SPEED DELAY:</span>
        <input
          type="range"
          id="speed-range"
          min="50"
          max="950"
          value={sliderValue}
          onChange={(e) => onSpeedChange(1000 - parseInt(e.target.value, 10))}
        />
        <span id="speed-label">{speedMs}ms</span>
      </div>
    </div>
  );
}
