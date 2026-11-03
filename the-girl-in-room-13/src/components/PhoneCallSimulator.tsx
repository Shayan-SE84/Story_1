import React, { useState, useEffect } from 'react';
import { ENDING_RECONSTRUCTIONS } from '../data/storyData';
import { soundEngine } from '../utils/soundEngine';
import { voiceNarrator } from '../utils/voiceNarrator';
import { PhoneCall, PhoneOff, Play, RotateCcw, FileText, Volume2 } from 'lucide-react';

export const PhoneCallSimulator: React.FC = () => {
  const [callStage, setCallStage] = useState<'idle' | 'video' | 'ringing' | 'connected' | 'ended'>('idle');
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [selectedEndingId, setSelectedEndingId] = useState<string>('original');
  const [customEndingText, setCustomEndingText] = useState<string>(
    'Suddenly, the bedroom door behind Alex unlatched by itself, and the smell of old damp wood filled the room.'
  );
  const [isUsingCustomEnding, setIsUsingCustomEnding] = useState<boolean>(false);

  useEffect(() => {
    let timer: number | undefined;
    if (callStage === 'connected') {
      timer = window.setInterval(() => {
        setCallSeconds((prev) => {
          if (prev >= 8) {
            soundEngine.playDisconnectTone();
            setCallStage('ended');
            return 8;
          }
          if (prev === 2) {
            soundEngine.playWhisperPulse();
            voiceNarrator.speakSnippet(
              "Alex... why did you leave me alone in Room 13?",
              "The Girl in Room 13"
            );
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStage]);

  const handlePlayVideoMessage = () => {
    setCallStage('video');
    soundEngine.playMotionAlert();
    voiceNarrator.speakSnippet(
      "Alex... if you ever receive a phone call from me after midnight, don't answer it. SHE'S NOT DEAD! SHE'S SITTING RIGHT BESIDE ME!",
      "Daniel"
    );
  };

  const handleTriggerRing = () => {
    voiceNarrator.stop();
    setCallStage('ringing');
    setCallSeconds(0);
    soundEngine.playPhoneRingPulse();
  };

  const handleAnswerCall = () => {
    setCallStage('connected');
    setCallSeconds(0);
  };

  const handleReset = () => {
    voiceNarrator.stop();
    setCallStage('idle');
    setCallSeconds(0);
  };

  const currentEnding =
    ENDING_RECONSTRUCTIONS.find((e) => e.id === selectedEndingId) ||
    ENDING_RECONSTRUCTIONS[0];

  return (
    <div className="border border-[#D6CEBE] dark:border-[#262320] bg-[#EFECE6] dark:bg-[#12100E] p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 5 Columns: Interactive 2:13 AM Phone Terminal */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#0B0A09] text-[#EBE6DF] border border-[#262320] p-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#262320] text-xs font-mono-tabular text-[#A8A29E]">
              <span>ALEX’S DEVICE LOG</span>
              <span>02:13 AM · OCT 21, 2021</span>
            </div>

            {callStage === 'idle' && (
              <div className="py-8 text-center">
                <p className="text-xs font-mono-tabular text-[#A8A29E] mb-2">
                  RECOVERED MEDIA · 3 DAYS AFTER DEPARTURE
                </p>
                <h4 className="font-display text-2xl font-semibold text-white mb-3">
                  Daniel’s Final Transmission
                </h4>
                <p className="font-prose text-sm text-[#D6D3D1] leading-relaxed mb-6">
                  Step through the final sequence recorded on Alex’s phone at 2:13 AM before the manuscript cuts off at "Sud—".
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handlePlayVideoMessage}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#EBE6DF] text-[#0B0A09] hover:bg-white rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    1. Play Video Message
                  </button>
                  <button
                    type="button"
                    onClick={handleTriggerRing}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    2. Simulate 2:13 AM Call
                  </button>
                </div>
              </div>
            )}

            {callStage === 'video' && (
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono-tabular text-[#D97706]">
                  <span>VIDEO_MSG_FINAL.MP4</span>
                  <span>00:19 / 00:19</span>
                </div>
                <div className="p-4 bg-[#161412] border border-[#262320] space-y-3 font-prose text-sm">
                  <p className="text-[#A8A29E] italic">
                    [Daniel sits in a dark room. His face is pale, eyes full of tears.]
                  </p>
                  <p className="text-white">
                    "Alex... if you ever receive a phone call from me after midnight, don’t answer it."
                  </p>
                  <p className="text-[#A8A29E]">
                    Alex (text reply): "Where are you?"
                  </p>
                  <p className="text-[#A8A29E] italic">
                    [Daniel slowly turns his head toward something behind him.]
                  </p>
                  <p className="text-[#F87171] font-semibold">
                    "SHE’S NOT DEAD! SHE’S SITTING RIGHT BESIDE ME!"
                  </p>
                  <p className="text-xs font-mono-tabular text-[#A8A29E] pt-1">
                    — STREAM TERMINATED UNEXPECTEDLY —
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleTriggerRing}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Continue: Phone Starts Ringing
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#A8A29E] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {callStage === 'ringing' && (
              <div className="py-8 text-center space-y-5">
                <p className="text-xs font-mono-tabular tracking-widest text-[#D97706]">
                  INCOMING CELLULAR CALL · 02:13 AM
                </p>
                <h4 className="font-display text-3xl font-semibold text-white">
                  DANIEL CALLING...
                </h4>
                <p className="font-prose text-xs text-[#A8A29E]">
                  Daniel warned: "If you ever receive a phone call from me after midnight, don’t answer it."
                </p>
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleAnswerCall}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-emerald-800 text-white hover:bg-emerald-700 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Answer Call
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playDisconnectTone();
                      setCallStage('ended');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-[#262320] text-[#EBE6DF] hover:bg-[#34302C] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </div>
              </div>
            )}

            {callStage === 'connected' && (
              <div className="py-8 text-center space-y-4">
                <p className="text-xs font-mono-tabular text-[#A8A29E]">
                  CONNECTED · 00:0{callSeconds}
                </p>
                <h4 className="font-display text-2xl font-semibold text-white">
                  DANIEL
                </h4>
                {callSeconds < 3 ? (
                  <p className="font-prose text-sm italic text-[#A8A29E] py-4">
                    [Complete silence on the line...]
                  </p>
                ) : (
                  <div className="p-4 bg-[#161412] border border-[#9A3412]/60 my-2">
                    <p className="text-xs font-mono-tabular text-[#D97706] mb-1">
                      LITTLE GIRL’S VOICE (WHISPERING):
                    </p>
                    <p className="font-display text-xl italic text-white">
                      "Alex... why did you leave me alone in Room 13?"
                    </p>
                  </div>
                )}
              </div>
            )}

            {callStage === 'ended' && (
              <div className="py-8 text-center space-y-4">
                <p className="text-xs font-mono-tabular text-[#F87171]">
                  CALL DISCONNECTED · 02:13 AM
                </p>
                <div className="p-4 bg-[#161412] border border-[#262320] text-left font-prose text-sm space-y-2">
                  <p className="text-[#D6D3D1]">
                    "Alex... why did you leave me alone in Room 13?"
                  </p>
                  <p className="text-[#A8A29E]">
                    The call disconnected. Alex looked at the time. 2:13 AM.
                  </p>
                  <p className="font-mono-tabular text-base text-white pt-1">
                    Sud—
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#262320] text-[#EBE6DF] hover:bg-[#34302C] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Replay Sequence
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#262320] flex items-center justify-between text-xs font-mono-tabular text-[#78716C]">
            <span>CELL TOWER: BLACKWOOD RELAY</span>
            <span>SIGNAL: -98 dBm</span>
          </div>
        </div>

        {/* Right 7 Columns: Reconstructing the Final Cutoff ("Sud—") */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#D6CEBE] dark:border-[#262320]">
              <div>
                <span className="text-xs font-mono-tabular text-[#9A3412] dark:text-[#D97706]">
                  MANUSCRIPT FRAGMENT ANALYSIS · LINE 84
                </span>
                <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-0.5">
                  What Happened After "Sud—"?
                </h3>
              </div>

              {/* Filter Tabs for Ending Reconstruction */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#E2DDD5] dark:bg-[#1C1917] rounded-md">
                {ENDING_RECONSTRUCTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setIsUsingCustomEnding(false);
                      setSelectedEndingId(option.id);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      !isUsingCustomEnding && selectedEndingId === option.id
                        ? 'bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09]'
                        : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsUsingCustomEnding(true)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isUsingCustomEnding
                      ? 'bg-[#9A3412] text-white'
                      : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                  }`}
                >
                  Write Epilogue
                </button>
              </div>
            </div>

            {!isUsingCustomEnding ? (
              <div className="mt-6 space-y-4">
                <div className="p-5 bg-[#F7F4EE] dark:bg-[#181512] border border-[#D6CEBE] dark:border-[#262320]">
                  <p className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E] mb-2">
                    RECONSTRUCTED FINAL PASSAGE · 02:13:44 AM
                  </p>
                  <p className="font-prose text-lg font-semibold text-[#1C1917] dark:text-[#F5F2EB] leading-relaxed">
                    {currentEnding.completionText}
                  </p>
                  {currentEnding.paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className="font-prose text-base text-[#44403C] dark:text-[#D6D3D1] leading-relaxed mt-3"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <label
                  htmlFor="custom-ending-input"
                  className="block text-xs font-mono-tabular text-[#57534E] dark:text-[#A8A29E]"
                >
                  COMPLETE THE INTERRUPTED SENTENCE ("Sud...") FOR THE ARCHIVE:
                </label>
                <textarea
                  id="custom-ending-input"
                  rows={3}
                  value={customEndingText}
                  onChange={(e) => setCustomEndingText(e.target.value)}
                  className="w-full p-4 bg-[#F7F4EE] dark:bg-[#181512] border border-[#D6CEBE] dark:border-[#292524] text-[#1C1917] dark:text-[#EBE6DF] font-prose text-base focus:outline-none focus:border-[#9A3412]"
                  placeholder="Suddenly..."
                />
                <div className="p-4 bg-[#F7F4EE] dark:bg-[#181512] border border-[#D6CEBE] dark:border-[#262320]">
                  <p className="text-xs font-mono-tabular text-[#9A3412] dark:text-[#D97706] mb-1">
                    SEALED ARCHIVAL ENTRY · 02:13 AM
                  </p>
                  <p className="font-prose text-base text-[#1C1917] dark:text-[#EBE6DF] leading-relaxed">
                    Alex looked at the time. 2:13 AM. {customEndingText}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#D6CEBE] dark:border-[#262320] flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>
                {isUsingCustomEnding
                  ? 'Reader-Submitted Archival Addendum'
                  : currentEnding.archivalVerdict}
              </span>
            </span>
            <span>CASE FILE #2021-RM13</span>
          </div>
        </div>
      </div>
    </div>
  );
};
