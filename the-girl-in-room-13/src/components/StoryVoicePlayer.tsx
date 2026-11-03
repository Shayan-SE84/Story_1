import React, { useEffect, useState } from 'react';
import { voiceNarrator, VoiceState } from '../utils/voiceNarrator';
import { soundEngine } from '../utils/soundEngine';
import { STORY_CHAPTERS } from '../data/storyData';
import { Play, Pause, Square, Volume2, FastForward, Headphones } from 'lucide-react';

interface StoryVoicePlayerProps {
  onChapterFocus?: (chapterId: string) => void;
}

export const StoryVoicePlayer: React.FC<StoryVoicePlayerProps> = ({ onChapterFocus }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isPlaying: false,
    isPaused: false,
    currentChapterId: null,
    currentParagraphIndex: null,
    currentText: '',
    speed: 0.92,
  });

  useEffect(() => {
    const unsubscribe = voiceNarrator.subscribe((state) => {
      setVoiceState(state);
      if (state.currentChapterId && onChapterFocus) {
        onChapterFocus(state.currentChapterId);
      }
    });
    return unsubscribe;
  }, [onChapterFocus]);

  const handlePlayAll = () => {
    if (voiceState.isPaused) {
      voiceNarrator.resume();
      return;
    }

    // Prepare all story paragraphs into a voice narration queue
    const allQueueItems: {
      text: string;
      speaker?: string;
      chapterId: string;
      paragraphIndex: number;
      soundCue?: () => void;
    }[] = [];

    STORY_CHAPTERS.forEach((ch) => {
      // Intro announcement for chapter
      allQueueItems.push({
        text: `Chapter ${ch.number}. ${ch.title}. ${ch.subtitle}.`,
        chapterId: ch.id,
        paragraphIndex: -1,
      });

      ch.paragraphs.forEach((p, pIdx) => {
        let cueFn: (() => void) | undefined = undefined;
        if (p.soundCue === 'footsteps') cueFn = () => soundEngine.playFootsteps();
        if (p.soundCue === 'knock') cueFn = () => soundEngine.playDoorKnock();
        if (p.soundCue === 'alert') cueFn = () => soundEngine.playMotionAlert();
        if (p.soundCue === 'whisper') cueFn = () => soundEngine.playWhisperPulse();
        if (p.soundCue === 'ring') cueFn = () => soundEngine.playPhoneRingPulse();

        allQueueItems.push({
          text: p.text,
          speaker: p.speaker,
          chapterId: ch.id,
          paragraphIndex: pIdx,
          soundCue: cueFn,
        });
      });
    });

    voiceNarrator.startChapterQueue(allQueueItems);
  };

  const handlePause = () => {
    voiceNarrator.pause();
  };

  const handleStop = () => {
    voiceNarrator.stop();
  };

  const handleSpeedToggle = () => {
    const current = voiceState.speed;
    let next = 0.92;
    if (current <= 0.85) next = 1.0;
    else if (current <= 1.05) next = 1.2;
    else next = 0.82;
    voiceNarrator.setSpeed(next);
  };

  return (
    <div className="border border-[#D6CEBE] dark:border-[#262320] bg-[#EFECE6] dark:bg-[#12100E] p-4 lg:p-5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1C1917] dark:bg-[#EBE6DF] text-[#F7F4EE] dark:text-[#0B0A09] rounded">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
              <span>STORY VOICE NARRATION</span>
              <span aria-hidden="true">·</span>
              <span className={voiceState.isPlaying ? 'text-[#9A3412] dark:text-[#D97706] font-medium' : ''}>
                {voiceState.isPlaying
                  ? voiceState.isPaused
                    ? 'Voice Paused'
                    : 'Speaking Aloud'
                  : 'Ready to Read Story'}
              </span>
            </div>
            <h4 className="font-display text-base lg:text-lg font-semibold text-[#1C1917] dark:text-[#F5F2EB] line-clamp-1">
              {voiceState.isPlaying && voiceState.currentText
                ? `"${voiceState.currentText}"`
                : 'Full Horror Story Voiceover (Audiobook & Dialogue Voices)'}
            </h4>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!voiceState.isPlaying || voiceState.isPaused ? (
            <button
              type="button"
              onClick={handlePlayAll}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#9A3412] text-white hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              title="Listen to story voice"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {voiceState.isPaused ? 'Resume Voice' : 'Play Story Voice'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              Pause Voice
            </button>
          )}

          {voiceState.isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[#D6CEBE] dark:border-[#292524] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Stop voice narration"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop
            </button>
          )}

          <button
            type="button"
            onClick={handleSpeedToggle}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-mono-tabular border border-[#D6CEBE] dark:border-[#292524] text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Adjust reading speed"
          >
            <FastForward className="w-3 h-3" />
            <span>
              {voiceState.speed <= 0.85
                ? '0.8x Eerie'
                : voiceState.speed <= 1.05
                ? '1.0x Normal'
                : '1.2x Fast'}
            </span>
          </button>
        </div>
      </div>

      {/* Real-time Subtitle Banner when playing */}
      {voiceState.isPlaying && voiceState.currentText && (
        <div className="mt-3 pt-3 border-t border-[#D6CEBE] dark:border-[#262320] flex items-center gap-2 text-xs">
          <Volume2 className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#D97706] animate-pulse shrink-0" />
          <p className="font-prose italic text-[#44403C] dark:text-[#D6D3D1] truncate">
            Speaking: <span className="font-medium text-[#1C1917] dark:text-[#F5F2EB]">"{voiceState.currentText}"</span>
          </p>
        </div>
      )}
    </div>
  );
};
