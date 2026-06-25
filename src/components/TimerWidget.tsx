import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw } from "lucide-react";

export default function TimerWidget() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [totalDuration, setTotalDuration] = useState(0); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const adjustTimer = (unit: "H" | "M" | "S", value: number) => {
    if (isTimerRunning) return;
    if (unit === "H") {
      setHours((prev) => Math.max(0, Math.min(23, prev + value)));
    } else if (unit === "M") {
      setMinutes((prev) => Math.max(0, Math.min(59, prev + value)));
    } else if (unit === "S") {
      setSeconds((prev) => Math.max(0, Math.min(59, prev + value)));
    }
  };

  // Synchronize initial remaining state when selectors are changed
  useEffect(() => {
    if (!isTimerRunning) {
      const total = hours * 3600 + minutes * 60 + seconds;
      setTimeLeft(total);
      setTotalDuration(total);
    }
  }, [hours, minutes, seconds, isTimerRunning]);

  useEffect(() => {
    if (isTimerRunning) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            triggerAlarm();
            setIsTimerRunning(false);
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total <= 0) return;
      if (timeLeft <= 0) {
        setTimeLeft(total);
        setTotalDuration(total);
      }
      setIsTimerRunning(true);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setIsTimeUp(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTimeLeft(0);
    setTotalDuration(0);
  };

  const triggerAlarm = () => {
    setIsTimeUp(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, startTime);
        osc.type = "sine";
        gainNode.gain.setValueAtTime(0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      playBeep(880, now, 0.3);
      playBeep(880, now + 0.4, 0.3);
      playBeep(880, now + 0.8, 0.4);
    } catch (e) {
      console.warn("Web Audio API not supported/allowed in this iframe context.");
    }
  };

  const formatTimeStr = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Circle stroke offset calculations
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    totalDuration > 0 ? circumference - (timeLeft / totalDuration) * circumference : circumference;

  return (
    <div
      id="widget_working_timer"
      className="bg-[#1e1e1e]/60 border border-[#2d2d2d] rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8 shadow-2xl min-h-[220px] relative overflow-hidden"
    >
      {/* Visual Alarm Alert Overlay */}
      {isTimeUp && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 text-center z-30 border border-red-500/20">
          <span className="text-4xl mb-2 animate-bounce">⏰</span>
          <h4 className="text-lg font-black text-white uppercase tracking-wider mb-1">Time's Up!</h4>
          <p className="text-xs text-gray-400 mb-4 font-medium">Your countdown has finished successfully.</p>
          <button
            onClick={() => setIsTimeUp(false)}
            className="px-6 py-2.5 bg-[#FF4ADE] hover:bg-[#eb42cd] text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Left Timer Dial Progress */}
      <div id="timer_visual_dial" className="relative flex items-center justify-center shrink-0">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-gray-800"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-[#FF4ADE] transition-all duration-1000 ease-linear"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span id="countdown_clock_time" className="text-xl md:text-2xl font-black font-mono tracking-tight text-white">
            {formatTimeStr(timeLeft)}
          </span>
          <span className="text-[9px] text-gray-500 font-black uppercase tracking-wider mt-0.5">
            {isTimerRunning ? "running" : "paused"}
          </span>
        </div>
      </div>

      {/* Right Controls Area */}
      <div id="timer_config_panel" className="flex-1 flex flex-col gap-4 w-full">
        <div className="grid grid-cols-3 gap-3 text-center bg-[#111111]/40 p-4 rounded-2xl border border-white/5">
          {/* Hours Selector */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Hours</span>
            <button
              id="btn_hours_up"
              disabled={isTimerRunning}
              onClick={() => adjustTimer("H", 1)}
              className="p-1 hover:text-[#FF4ADE] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <span id="timer_hours_val" className="text-2xl font-black font-mono my-0.5">
              {String(hours).padStart(2, "0")}
            </span>
            <button
              id="btn_hours_down"
              disabled={isTimerRunning}
              onClick={() => adjustTimer("H", -1)}
              className="p-1 hover:text-[#FF4ADE] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Minutes Selector */}
          <div className="flex flex-col items-center border-x border-white/5">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Minutes</span>
            <button
              id="btn_minutes_up"
              disabled={isTimerRunning}
              onClick={() => adjustTimer("M", 1)}
              className="p-1 hover:text-[#FF4ADE] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <span id="timer_minutes_val" className="text-2xl font-black font-mono my-0.5">
              {String(minutes).padStart(2, "0")}
            </span>
            <button
              id="btn_minutes_down"
              disabled={isTimerRunning}
              onClick={() => adjustTimer("M", -1)}
              className="p-1 hover:text-[#FF4ADE] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Seconds Selector */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5">Seconds</span>
            <button
              id="btn_seconds_up"
              disabled={isTimerRunning}
              onClick={() => adjustTimer("S", 1)}
              className="p-1 hover:text-[#FF4ADE] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <span id="timer_seconds_val" className="text-2xl font-black font-mono my-0.5">
              {String(seconds).padStart(2, "0")}
            </span>
            <button
              id="btn_seconds_down"
              disabled={isTimerRunning}
              onClick={() => adjustTimer("S", -1)}
              className="p-1 hover:text-[#FF4ADE] disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Start / Stop and Reset buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            id="btn_play_pause"
            onClick={toggleTimer}
            className="flex-1 py-3 bg-[#FF4ADE] hover:bg-[#eb42cd] text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isTimerRunning ? (
              <>
                <Pause className="w-4 h-4 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            id="btn_reset_timer"
            onClick={resetTimer}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white rounded-xl transition-all cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
