import React, { useState } from 'react';
import { CCTV_FRAMES, GENERATED_IMAGES } from '../data/storyData';
import { soundEngine } from '../utils/soundEngine';
import { voiceNarrator } from '../utils/voiceNarrator';
import { ResilientImage } from './ResilientImage';
import { Volume2, Camera, Eye, ShieldAlert } from 'lucide-react';

interface CctvConsoleProps {
  soundEnabled: boolean;
}

export const CctvConsole: React.FC<CctvConsoleProps> = ({ soundEnabled }) => {
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(1); // Default to 02:13:00 AM frame
  const [infraredBoost, setInfraredBoost] = useState<boolean>(false);
  const [knockTriggered, setKnockTriggered] = useState<boolean>(false);

  const activeFrame = CCTV_FRAMES[activeFrameIndex];

  const handleSelectFrame = (idx: number) => {
    setActiveFrameIndex(idx);
    if (soundEnabled) {
      soundEngine.playMotionAlert();
    }
  };

  const handleTriggerKnock = () => {
    setKnockTriggered(true);
    soundEngine.playDoorKnock();
    // Speak the terrifying dialogue in voice
    setTimeout(() => {
      voiceNarrator.speakSnippet(
        "Daniel, open the door. It's Mom... Daniel, I know you're awake.",
        'Outside Bedroom Door'
      );
    }, 850);
    setTimeout(() => setKnockTriggered(false), 5500);
  };

  return (
    <div className="border border-[#D6CEBE] dark:border-[#262320] bg-[#EFECE6] dark:bg-[#12100E] p-6 lg:p-8">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#D6CEBE] dark:border-[#262320]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
            <span>DVR ARCHIVE</span>
            <span aria-hidden="true">·</span>
            <span>OCTOBER 18, 2021</span>
            <span aria-hidden="true">·</span>
            <span>14 BLACKWOOD RD</span>
          </div>
          <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
            Security Camera Recording Playback
          </h3>
        </div>

        {/* Segmented Controls for Frame Timestamps */}
        <div
          className="flex flex-wrap items-center gap-1 p-1 bg-[#E2DDD5] dark:bg-[#1C1917] rounded-md"
          role="tablist"
          aria-label="Security camera timestamps"
        >
          {CCTV_FRAMES.map((frame, index) => (
            <button
              key={frame.id}
              role="tab"
              aria-selected={activeFrameIndex === index}
              onClick={() => handleSelectFrame(index)}
              className={`px-3 py-1.5 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeFrameIndex === index
                  ? 'bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09] font-medium'
                  : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
              }`}
            >
              {frame.timecode}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Feed Viewport & Forensic Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 7 Cols: Surveillance Viewport */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#0B0A09] border border-[#262320] relative overflow-hidden">
          <div className="relative aspect-video w-full overflow-hidden">
            <ResilientImage
              src={
                activeFrame.hasFigureBehindBed
                  ? GENERATED_IMAGES.hallway
                  : GENERATED_IMAGES.cctvStaircase
              }
              alt={activeFrame.caption}
              className={`w-full h-full object-cover transition-all duration-200 ${
                activeFrame.filterStyle
              } ${infraredBoost ? 'brightness-125 contrast-150' : ''} ${
                activeFrameIndex === 0 ? 'opacity-45 blur-[1px]' : 'opacity-90'
              }`}
            />

            {/* Measured Dark Scrim for HUD legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/60 pointer-events-none" />

            {/* Camera HUD Overlay (Clean unboxed monospace telemetry) */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-[#EBE6DF]/90 pointer-events-none">
              <span>{activeFrame.cameraName}</span>
              <span>{activeFrame.timecode} · 15 FPS</span>
            </div>

            {/* Frame-specific Visual Phenomenon Overlay */}
            {activeFrameIndex === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="font-mono-tabular text-xs text-[#EBE6DF]/80 bg-black/70 px-4 py-2 border border-white/15">
                  02:12:45 AM — Stairwell Clear · Pre-Motion Buffer
                </p>
              </div>
            )}

            {activeFrame.hasFigureBehindBed && (
              <div className="absolute inset-x-6 bottom-14 bg-black/85 border border-[#9A3412]/60 p-4 text-[#EBE6DF]">
                <p className="text-xs font-mono-tabular text-[#D97706] mb-1">
                  OVERNIGHT TIME-LAPSE REVEAL (02:14 AM – 05:42 AM)
                </p>
                <p className="font-prose text-sm leading-relaxed">
                  "The woman in white had been standing inside his bedroom all night. Right behind his bed. Watching him sleep."
                </p>
              </div>
            )}

            {knockTriggered && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-6 text-center">
                <p className="font-mono-tabular text-xs tracking-widest text-[#D97706] mb-2">
                  ACOUSTIC SENSOR TRIGGER · BEDROOM DOOR
                </p>
                <p className="font-display text-3xl italic text-white mb-2">
                  "Daniel, open the door. It’s Mom."
                </p>
                <p className="font-prose text-xs text-[#A8A29E]">
                  Voice matches Margaret Mercer (deceased 2018) · Door remained locked
                </p>
              </div>
            )}

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono-tabular text-[#A8A29E]">
              <span>IR ILLUMINATOR: {infraredBoost ? 'HIGH GAIN' : 'STANDARD'}</span>
              <span>{activeFrame.threatLevel}</span>
            </div>
          </div>

          {/* Viewport Utility Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#141210] border-t border-[#262320]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInfraredBoost((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#EBE6DF] bg-[#262320] hover:bg-[#34302C] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                {infraredBoost ? 'Standard Gain' : 'Enhance Night Vision'}
              </button>
              <button
                type="button"
                onClick={handleTriggerKnock}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F7F4EE] bg-[#9A3412] hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Play 02:13 AM Door Knock
              </button>
            </div>
            <span className="text-xs font-mono-tabular text-[#A8A29E]">
              Frame {activeFrameIndex + 1} of {CCTV_FRAMES.length}
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Forensic Frame Analysis */}
        <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#D6CEBE] dark:border-[#262320] pt-6 lg:pt-0 lg:pl-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-[#9A3412] dark:text-[#D97706]">
              <Camera className="w-3.5 h-3.5" />
              <span>{activeFrame.timecode}</span>
              <span aria-hidden="true">·</span>
              <span>{activeFrame.threatLevel}</span>
            </div>

            <h4 className="font-display text-2xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-2">
              {activeFrame.title}
            </h4>

            <p className="font-prose text-base text-[#44403C] dark:text-[#D6D3D1] leading-relaxed mt-3">
              {activeFrame.caption}
            </p>

            <dl className="mt-6 pt-5 border-t border-[#D6CEBE] dark:border-[#262320] space-y-4 text-sm">
              <div>
                <dt className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                  RECORDED ANOMALY
                </dt>
                <dd className="font-prose text-[#1C1917] dark:text-[#EBE6DF] mt-1">
                  {activeFrame.anomalyNote}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                  LANDLORD IDENTIFICATION
                </dt>
                <dd className="font-prose text-[#1C1917] dark:text-[#EBE6DF] mt-1">
                  Confirmed by property owner Elias Finch on Oct 18, 2021 as his deceased daughter (died in Room 13 in 2016).
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 pt-4 border-t border-[#D6CEBE] dark:border-[#262320] flex items-center justify-between text-xs text-[#57534E] dark:text-[#A8A29E]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#D97706]" />
              <span>Door Deadbolt Status: Locked from Inside</span>
            </span>
            <button
              type="button"
              onClick={() => handleSelectFrame((activeFrameIndex + 1) % CCTV_FRAMES.length)}
              className="font-medium text-[#9A3412] dark:text-[#D97706] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Next Timestamp →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
