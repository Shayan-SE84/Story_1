import React, { useState, useEffect } from 'react';
import {
  STORY_CHAPTERS,
  CASE_EXHIBITS,
  GENERATED_IMAGES,
  StoryChapter,
} from './data/storyData';
import { soundEngine } from './utils/soundEngine';
import { voiceNarrator, VoiceState } from './utils/voiceNarrator';
import { ResilientImage } from './components/ResilientImage';
import { CctvConsole } from './components/CctvConsole';
import { PhoneCallSimulator } from './components/PhoneCallSimulator';
import { StoryVoicePlayer } from './components/StoryVoicePlayer';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Eye,
  ZapOff,
  FileSearch,
  BookOpen,
  Headphones,
  Play,
  Pause,
} from 'lucide-react';

export function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [ambienceActive, setAmbienceActive] = useState<boolean>(false);
  const [activeChapterFilter, setActiveChapterFilter] = useState<string>('all');
  const [doorLeanedCloser, setDoorLeanedCloser] = useState<boolean>(false);
  const [breakerTested, setBreakerTested] = useState<boolean>(false);
  const [selectedExhibitId, setSelectedExhibitId] = useState<string>(
    CASE_EXHIBITS[0].id
  );
  const [activeSoundToast, setActiveSoundToast] = useState<string | null>(null);

  const [voiceState, setVoiceState] = useState<VoiceState>({
    isPlaying: false,
    isPaused: false,
    currentChapterId: null,
    currentParagraphIndex: null,
    currentText: '',
    speed: 0.92,
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const unsubscribe = voiceNarrator.subscribe((state) => {
      setVoiceState(state);
    });
    return unsubscribe;
  }, []);

  const triggerToast = (msg: string) => {
    setActiveSoundToast(msg);
    setTimeout(() => {
      setActiveSoundToast((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const handleToggleAmbience = () => {
    const nextState = soundEngine.toggleAmbience();
    setAmbienceActive(nextState);
    triggerToast(
      nextState
        ? '2:13 AM Room Resonance Active'
        : 'Audio Ambience Muted'
    );
  };

  const handleSoundCue = (
    cue?: 'footsteps' | 'knock' | 'whisper' | 'alert' | 'ring'
  ) => {
    if (!cue) return;
    if (cue === 'footsteps') {
      soundEngine.playFootsteps();
      triggerToast('THUD... THUD... THUD... (Voice: "Please... help me.")');
      setTimeout(() => {
        voiceNarrator.speakSnippet('Please... help me.', 'Voice from Upper Floor');
      }, 1400);
    } else if (cue === 'knock') {
      soundEngine.playDoorKnock();
      triggerToast('KNOCK... KNOCK... (Voice: "Daniel, open the door. It’s Mom.")');
      setTimeout(() => {
        voiceNarrator.speakSnippet(
          "Daniel, open the door. It's Mom... Daniel, I know you're awake.",
          'Outside Bedroom Door'
        );
      }, 800);
    } else if (cue === 'whisper') {
      soundEngine.playWhisperPulse();
      setDoorLeanedCloser(true);
      triggerToast('Whisper from Room 13: "Daniel... why did you come back?"');
      setTimeout(() => {
        voiceNarrator.speakSnippet(
          'Daniel... why did you come back?',
          'Inside Room 13'
        );
      }, 300);
    } else if (cue === 'alert') {
      soundEngine.playMotionAlert();
      triggerToast('02:13 AM Motion Detection Alert — CAM-02 Stairwell');
    } else if (cue === 'ring') {
      soundEngine.playPhoneRingPulse();
      triggerToast('Incoming Call: DANIEL CALLING... (02:13 AM)');
      setTimeout(() => {
        voiceNarrator.speakSnippet(
          'Alex... why did you leave me alone in Room 13?',
          'The Girl in Room 13'
        );
      }, 1500);
    }
  };

  const handleLeanDoor = () => {
    const next = !doorLeanedCloser;
    setDoorLeanedCloser(next);
    if (next) {
      soundEngine.playWhisperPulse();
      triggerToast('Voice from inside Room 13: "Daniel... why did you come back?"');
      setTimeout(() => {
        voiceNarrator.speakSnippet(
          'Daniel... why did you come back?',
          'Inside Room 13'
        );
      }, 350);
    }
  };

  const handlePlayChapterVoice = (chapter: StoryChapter) => {
    if (
      voiceState.isPlaying &&
      voiceState.currentChapterId === chapter.id &&
      !voiceState.isPaused
    ) {
      voiceNarrator.pause();
      return;
    }

    const items: {
      text: string;
      speaker?: string;
      chapterId: string;
      paragraphIndex: number;
      soundCue?: () => void;
    }[] = [
      {
        text: `Chapter ${chapter.number}. ${chapter.title}. ${chapter.subtitle}.`,
        chapterId: chapter.id,
        paragraphIndex: -1,
      },
    ];

    chapter.paragraphs.forEach((p, pIdx) => {
      let cueFn: (() => void) | undefined = undefined;
      if (p.soundCue === 'footsteps') cueFn = () => soundEngine.playFootsteps();
      if (p.soundCue === 'knock') cueFn = () => soundEngine.playDoorKnock();
      if (p.soundCue === 'alert') cueFn = () => soundEngine.playMotionAlert();
      if (p.soundCue === 'whisper') cueFn = () => soundEngine.playWhisperPulse();
      if (p.soundCue === 'ring') cueFn = () => soundEngine.playPhoneRingPulse();

      items.push({
        text: p.text,
        speaker: p.speaker,
        chapterId: chapter.id,
        paragraphIndex: pIdx,
        soundCue: cueFn,
      });
    });

    voiceNarrator.startChapterQueue(items);
    triggerToast(`Reading Chapter ${chapter.number} Aloud in Voice`);
  };

  const visibleChapters =
    activeChapterFilter === 'all'
      ? STORY_CHAPTERS
      : STORY_CHAPTERS.filter((ch) => ch.id === activeChapterFilter);

  const selectedExhibit =
    CASE_EXHIBITS.find((ex) => ex.id === selectedExhibitId) || CASE_EXHIBITS[0];

  return (
    <div className="min-h-screen bg-[#F7F4EE] dark:bg-[#0B0A09] text-[#1C1917] dark:text-[#EBE6DF] transition-colors duration-200">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#F7F4EE]/95 dark:bg-[#0B0A09]/95 backdrop-blur-sm border-b border-[#D6CEBE] dark:border-[#262320]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-xl lg:text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#F5F2EB] whitespace-nowrap shrink-0"
        >
          The Girl in Room 13
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#57534E] dark:text-[#A8A29E]"
        >
          <a
            href="#narrative"
            className="hover:text-[#1C1917] dark:hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Narrative
          </a>
          <a
            href="#security-logs"
            className="hover:text-[#1C1917] dark:hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Security Logs
          </a>
          <a
            href="#evidence"
            className="hover:text-[#1C1917] dark:hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Case Evidence
          </a>
          <a
            href="#ending"
            className="hover:text-[#1C1917] dark:hover:text-[#F5F2EB] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            The Ending
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleAmbience}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              ambienceActive
                ? 'bg-[#9A3412] text-white hover:bg-[#7C2D12]'
                : 'bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09] hover:opacity-90'
            }`}
          >
            {ambienceActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                Mute Ambience
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                2:13 AM Hum
              </>
            )}
          </button>
        </div>
      </header>

      {/* Subtle Floating Acoustic Caption Toast */}
      {activeSoundToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md px-4 py-3 bg-[#1C1917] text-[#F7F4EE] border border-[#9A3412] shadow-lg text-xs font-mono-tabular"
        >
          {activeSoundToast}
        </div>
      )}

      {/* HERO SECTION & OPERATIONAL ARCHIVE RIBBON */}
      <main id="top">
        <section className="max-w-[1360px] mx-auto px-6 lg:px-12 pt-8 lg:pt-12 pb-10">
          {/* Workspace Mode & Lighting Utility Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D6CEBE] dark:border-[#262320] text-xs text-[#57534E] dark:text-[#A8A29E]">
            <div className="flex flex-wrap items-center gap-2 font-mono-tabular">
              <span>ARCHIVE DOSSIER NO. 2021-13</span>
              <span aria-hidden="true">·</span>
              <span>14 BLACKWOOD ROAD</span>
              <span aria-hidden="true">·</span>
              <span>RECORDED TIME: 02:13 AM</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => soundEngine.playFootsteps()}
                className="px-3 py-1.5 text-xs font-medium border border-[#D6CEBE] dark:border-[#292524] hover:border-[#9A3412] dark:hover:border-[#D97706] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Test Footsteps Audio
              </button>
              <button
                type="button"
                onClick={() => setIsDark((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#EBE6DF] dark:bg-[#1C1917] text-[#1C1917] dark:text-[#EBE6DF] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                aria-label="Toggle reading lighting mode"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5" />
                    Archival Daylight
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    2:13 AM Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2-Column Hero Split (items-stretch for balanced height) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left 6 Cols: Editorial Typography & Lead */}
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div>
                <p className="text-xs font-mono-tabular tracking-widest uppercase text-[#9A3412] dark:text-[#D97706] mb-3">
                  PSYCHOLOGICAL HORROR NARRATIVE & SPOKEN VOICE AUDIOBOOK
                </p>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1C1917] dark:text-[#F5F2EB] leading-[1.08]">
                  The Girl in Room 13
                </h1>

                <p className="font-display text-xl lg:text-2xl italic text-[#57534E] dark:text-[#A8A29E] mt-3">
                  "Listen carefully. You can use every room in this house, but never open Room 13."
                </p>

                <p className="font-prose text-base lg:text-lg text-[#44403C] dark:text-[#D6D3D1] leading-relaxed mt-6 max-w-xl">
                  In October 2021, Daniel moved into an inexplicable bargain of an old house. Four nights later, at 2:13 AM, his security cameras revealed who had been standing behind his bed all night—and why the landlord was asked to bring him there.
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-[#D6CEBE] dark:border-[#262320]">
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="#narrative"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read Full Story
                  </a>
                  <button
                    type="button"
                    onClick={handleLeanDoor}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[#1C1917] dark:border-[#EBE6DF] text-[#1C1917] dark:text-[#EBE6DF] hover:bg-[#1C1917] hover:text-[#F7F4EE] dark:hover:bg-[#EBE6DF] dark:hover:text-[#0B0A09] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-[#9A3412] dark:text-[#D97706]" />
                    {doorLeanedCloser
                      ? 'Step Back from Door 13'
                      : 'Lean Closer & Hear Whisper'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Interactive Room 13 Threshold Plate */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="relative h-full min-h-[340px] bg-[#0B0A09] border border-[#D6CEBE] dark:border-[#262320] overflow-hidden flex flex-col justify-end">
                <ResilientImage
                  src={GENERATED_IMAGES.hallway}
                  alt="Dark upstairs wooden corridor showing Room 13 door with eerie warm light spilling from underneath the threshold"
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    doorLeanedCloser
                      ? 'scale-105 brightness-110 contrast-125'
                      : 'scale-100 brightness-95'
                  }`}
                />

                {/* Measured Dark Scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Interactive Threshold Whisper Reveal */}
                <div className="relative z-10 p-6 lg:p-8 text-[#EBE6DF]">
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-[#D97706] mb-2">
                    <span>SECOND FLOOR CORRIDOR · 02:13 AM</span>
                    <span>CIRCUIT #13: DISCONNECTED</span>
                  </div>

                  {doorLeanedCloser ? (
                    <div className="p-4 bg-black/85 border border-[#9A3412] mt-2">
                      <p className="text-xs font-mono-tabular text-[#D97706] mb-1">
                        SPOKEN VOICE FROM INSIDE ROOM 13:
                      </p>
                      <p className="font-display text-2xl italic text-white">
                        "Daniel... why did you come back?"
                      </p>
                      <p className="font-prose text-xs text-[#A8A29E] mt-1">
                        Daniel froze. He had never told anyone in that house his name.
                      </p>
                    </div>
                  ) : (
                    <p className="font-prose text-sm text-[#D6D3D1] leading-relaxed">
                      Fig. 1 — A strange warm light spills from underneath Room 13. Click "Lean Closer & Hear Whisper" to hear the voice whispering inside.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DEDICATED STORY VOICE NARRATION PLAYER BANNER */}
          <div className="mt-10">
            <StoryVoicePlayer onChapterFocus={(id) => setActiveChapterFilter('all')} />
          </div>

          {/* Full-Width 4-Column Operational Fact Strip Below Hero Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 pt-8 border-t border-[#D6CEBE] dark:border-[#262320]">
            <div>
              <div className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                01 · TENANCY WARNING
              </div>
              <div className="font-display text-xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                Never Open Room 13
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                Landlord Elias Finch’s sole lease stipulation upon handing over the keys in 2021.
              </p>
            </div>

            <div>
              <div className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                02 · RECURRING TIMESTAMP
              </div>
              <div className="font-display text-xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1 font-mono-tabular">
                02:13:00 AM
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                Exact minute of the third-night footsteps, fourth-night camera alert, and Alex’s final phone call.
              </p>
            </div>

            <div>
              <div className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                03 · PRIOR TENANTS (2016–2021)
              </div>
              <div className="font-display text-xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                100% Disappearance Rate
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                Every occupant since the landlord’s daughter died in Room 13 five years earlier vanished.
              </p>
            </div>

            <div>
              <div className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                04 · FINAL MANUSCRIPT LINE
              </div>
              <div className="font-display text-xl font-semibold text-[#9A3412] dark:text-[#D97706] mt-1 font-mono-tabular">
                "2:13 AM. Sud—"
              </div>
              <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1">
                Alex’s account ends mid-word immediately after answering Daniel’s caller ID after midnight.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 1: ASYMMETRIC TWO-COLUMN NARRATIVE & MARGIN DOSSIER */}
        <section
          id="narrative"
          className="max-w-[1360px] mx-auto px-6 lg:px-12 py-12 lg:py-16 border-t border-[#D6CEBE] dark:border-[#262320]"
        >
          {/* Chapter Navigation & Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#D6CEBE] dark:border-[#262320]">
            <div>
              <span className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                COMPLETE ARCHIVAL TEXT · FIVE CHAPTERS WITH AUDIO VOICE
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                The Chronicle of Room 13
              </h2>
            </div>

            {/* Interactive Chapter Filter Segmented Control */}
            <div
              className="flex flex-wrap items-center gap-1 p-1 bg-[#E2DDD5] dark:bg-[#161412] rounded-md"
              role="tablist"
              aria-label="Filter story chapters"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeChapterFilter === 'all'}
                onClick={() => setActiveChapterFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeChapterFilter === 'all'
                    ? 'bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09]'
                    : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                }`}
              >
                All Chapters (01–05)
              </button>
              {STORY_CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  role="tab"
                  aria-selected={activeChapterFilter === ch.id}
                  onClick={() => setActiveChapterFilter(ch.id)}
                  className={`px-3 py-1.5 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeChapterFilter === ch.id
                      ? 'bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09]'
                      : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                  }`}
                >
                  {ch.number}. {ch.title.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Chapter List in Two-Column Asymmetric Layout (70% Main Prose / 30% Margin Notes) */}
          <div className="space-y-20">
            {visibleChapters.map((chapter) => {
              const isCurrentChapterSpeaking =
                voiceState.isPlaying && voiceState.currentChapterId === chapter.id;

              return (
                <article
                  key={chapter.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pb-16 border-b border-[#D6CEBE]/70 dark:border-[#262320]/80 last:border-b-0 last:pb-0"
                >
                  {/* Left 8 Columns (~70%): Editorial Reading Column */}
                  <div className="lg:col-span-8 max-w-2xl">
                    {/* Chapter Kicker Metadata with Voice Narration Trigger */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                        <span>CHAPTER {chapter.number}</span>
                        <span aria-hidden="true">·</span>
                        <span>{chapter.timestamp}</span>
                        <span aria-hidden="true">·</span>
                        <span>{chapter.location}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlayChapterVoice(chapter)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isCurrentChapterSpeaking && !voiceState.isPaused
                            ? 'bg-[#9A3412] text-white'
                            : 'bg-[#E2DDD5] dark:bg-[#1C1917] text-[#1C1917] dark:text-[#EBE6DF] hover:bg-[#D6CEBE] dark:hover:bg-[#262320]'
                        }`}
                      >
                        {isCurrentChapterSpeaking && !voiceState.isPaused ? (
                          <>
                            <Pause className="w-3 h-3 fill-current" />
                            Pause Chapter Voice
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            Listen to Chapter {chapter.number} Voice
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C1917] dark:text-[#F5F2EB]">
                      {chapter.number}. {chapter.title}
                    </h3>
                    <p className="font-display text-lg italic text-[#57534E] dark:text-[#A8A29E] mt-1 mb-6 pb-4 border-b border-[#D6CEBE] dark:border-[#262320]">
                      {chapter.subtitle}
                    </p>

                    {/* Body Paragraphs with Drop Cap & Realtime Active Voice Highlight */}
                    <div className="space-y-5 font-prose text-base lg:text-[17px] leading-[1.8] text-[#292524] dark:text-[#E7E5E4]">
                      {chapter.paragraphs.map((para, pIdx) => {
                        const isFirstParagraph = pIdx === 0;
                        const isThisParagraphSpeaking =
                          voiceState.isPlaying &&
                          voiceState.currentChapterId === chapter.id &&
                          voiceState.currentParagraphIndex === pIdx;

                        return (
                          <div
                            key={pIdx}
                            className={`space-y-2 transition-all duration-300 ${
                              isThisParagraphSpeaking
                                ? 'bg-[#9A3412]/10 dark:bg-[#B45309]/15 border-l-2 border-[#9A3412] dark:border-[#D97706] pl-4 py-1.5 -ml-4 rounded-r'
                                : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 group">
                              <p
                                className={`flex-1 ${
                                  isFirstParagraph
                                    ? 'first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-[#9A3412] dark:first-letter:text-[#D97706]'
                                    : ''
                                } ${
                                  para.isDialogue
                                    ? 'font-display text-xl lg:text-2xl italic text-[#1C1917] dark:text-[#F5F2EB] py-1'
                                    : ''
                                } ${
                                  para.isEmphasis && !para.isDialogue
                                    ? 'font-semibold text-[#9A3412] dark:text-[#F59E0B] tracking-wide'
                                    : ''
                                }`}
                              >
                                {para.text}
                              </p>

                              {/* Quick snippet voice speaker button */}
                              <button
                                type="button"
                                onClick={() => voiceNarrator.speakSnippet(para.text, para.speaker)}
                                className="opacity-40 group-hover:opacity-100 focus:opacity-100 p-1 text-[#57534E] dark:text-[#A8A29E] hover:text-[#9A3412] dark:hover:text-[#D97706] transition-all cursor-pointer shrink-0 mt-1"
                                title="Hear this sentence in voice"
                                aria-label="Speak sentence aloud"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Interactive Sound & Voice Cue Button */}
                            {para.soundCue && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSoundCue(para.soundCue)}
                                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-[#EBE6DF] dark:bg-[#1C1917] text-[#1C1917] dark:text-[#EBE6DF] border border-[#D6CEBE] dark:border-[#292524] hover:border-[#9A3412] dark:hover:border-[#D97706] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-[#9A3412] dark:text-[#D97706]" />
                                  {para.soundLabel}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Editorial Pull Quote */}
                    {chapter.pullQuote && (
                      <blockquote className="my-10 py-6 border-y border-[#D6CEBE] dark:border-[#262320] text-center">
                        <p className="font-display text-2xl lg:text-3xl italic text-[#1C1917] dark:text-[#F5F2EB]">
                          "{chapter.pullQuote.quote}"
                        </p>
                        <footer className="mt-2 text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                          — {chapter.pullQuote.attribution}
                        </footer>
                      </blockquote>
                    )}
                  </div>

                  {/* Right 4 Columns (~30%): Synchronized Archival Margin Note */}
                  <aside className="lg:col-span-4 bg-[#EFECE6] dark:bg-[#141210] border border-[#D6CEBE] dark:border-[#262320] p-6">
                    <div className="flex items-center justify-between text-xs font-mono-tabular text-[#9A3412] dark:text-[#D97706] pb-3 mb-4 border-b border-[#D6CEBE] dark:border-[#262320]">
                      <span>MARGIN DOSSIER</span>
                      <span>{chapter.marginNote.accessionId}</span>
                    </div>

                    <h4 className="font-display text-xl font-semibold text-[#1C1917] dark:text-[#F5F2EB]">
                      {chapter.marginNote.title}
                    </h4>

                    <p className="font-prose text-sm text-[#44403C] dark:text-[#D6D3D1] leading-relaxed mt-2">
                      {chapter.marginNote.summary}
                    </p>

                    <p className="font-prose text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed mt-3 pt-3 border-t border-[#D6CEBE] dark:border-[#262320]">
                      {chapter.marginNote.detail}
                    </p>

                    {/* Contextual Interactive Margin Widget */}
                    <div className="mt-5 pt-4 border-t border-[#D6CEBE] dark:border-[#262320]">
                      {chapter.marginNote.interactiveType === 'breaker' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs font-mono-tabular">
                            <span>CIRCUIT #13 BREAKER:</span>
                            <span className="text-[#9A3412] dark:text-[#D97706]">
                              {breakerTested ? '0.0V (SEVERED) · LIGHT ACTIVE' : 'DISCONNECTED'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setBreakerTested((prev) => !prev);
                              soundEngine.playMotionAlert();
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <ZapOff className="w-3.5 h-3.5" />
                            {breakerTested ? 'Reset Multimeter Test' : 'Test Room 13 Circuit'}
                          </button>
                        </div>
                      )}

                      {chapter.marginNote.interactiveType === 'door13' && (
                        <button
                          type="button"
                          onClick={() => handleSoundCue('whisper')}
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          Hear Voice at Room 13 Keyhole
                        </button>
                      )}

                      {chapter.marginNote.interactiveType === 'cctv' && (
                        <a
                          href="#security-logs"
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09] rounded transition-colors whitespace-nowrap shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Open 02:13 AM Camera Console
                        </a>
                      )}

                      {chapter.marginNote.interactiveType === 'landlord' && (
                        <div className="space-y-2 text-xs font-mono-tabular">
                          <div className="text-[#78716C] dark:text-[#A8A29E]">
                            MISSING TENANT REGISTRY:
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#D6CEBE] dark:border-[#262320]">
                            <span>2017 · M. Halstead</span>
                            <span>Unlocated</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#D6CEBE] dark:border-[#262320]">
                            <span>2018 · R. Kestrel</span>
                            <span>Unlocated</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-[#D6CEBE] dark:border-[#262320]">
                            <span>2020 · E. Vance</span>
                            <span>Unlocated</span>
                          </div>
                          <div className="flex justify-between py-1 text-[#9A3412] dark:text-[#D97706] font-medium">
                            <span>2021 · Daniel Mercer</span>
                            <span>Chosen by Daughter</span>
                          </div>
                        </div>
                      )}

                      {chapter.marginNote.interactiveType === 'phonecall' && (
                        <a
                          href="#ending"
                          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-[#9A3412] text-white hover:bg-[#7C2D12] rounded transition-colors whitespace-nowrap shrink-0"
                        >
                          <FileSearch className="w-3.5 h-3.5" />
                          Inspect "Sud—" & Call Simulator
                        </a>
                      )}
                    </div>
                  </aside>
                </article>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: 2:13 AM SECURITY CAMERA DVR CONSOLE */}
        <section
          id="security-logs"
          className="max-w-[1360px] mx-auto px-6 lg:px-12 py-12 lg:py-16 border-t border-[#D6CEBE] dark:border-[#262320]"
        >
          <div className="mb-8">
            <span className="text-xs font-mono-tabular text-[#9A3412] dark:text-[#D97706]">
              RECOVERED SURVEILLANCE ARCHIVE · NIGHT FOUR
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
              2:13 AM Motion Detection & Overnight Playback
            </h2>
            <p className="font-prose text-base text-[#57534E] dark:text-[#A8A29E] mt-2 max-w-2xl">
              Scrub through the recovered camera frames from October 18, 2021—from the initial motion alert on the upper stairs to the morning discovery of who stood behind Daniel’s bed all night.
            </p>
          </div>

          <CctvConsole soundEnabled={true} />
        </section>

        {/* SECTION 3: MUSEUM ACCESSION & FORENSIC EVIDENCE ARCHIVE */}
        <section
          id="evidence"
          className="max-w-[1360px] mx-auto px-6 lg:px-12 py-12 lg:py-16 border-t border-[#D6CEBE] dark:border-[#262320]"
        >
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                PHYSICAL & DIGITAL EXHIBITS · CASE FILE 13
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                Archival Evidence Catalog
              </h2>
            </div>

            {/* Exhibit Selector Tabs */}
            <div
              className="flex flex-wrap items-center gap-1 p-1 bg-[#E2DDD5] dark:bg-[#161412] rounded-md"
              role="tablist"
              aria-label="Select archival exhibit"
            >
              {CASE_EXHIBITS.map((ex, idx) => (
                <button
                  key={ex.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedExhibitId === ex.id}
                  onClick={() => setSelectedExhibitId(ex.id)}
                  className={`px-3 py-1.5 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedExhibitId === ex.id
                      ? 'bg-[#1C1917] text-[#F7F4EE] dark:bg-[#EBE6DF] dark:text-[#0B0A09]'
                      : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#1C1917] dark:hover:text-[#F5F2EB]'
                  }`}
                >
                  Exhibit {String.fromCharCode(65 + idx)}
                </button>
              ))}
            </div>
          </div>

          {/* Museum Accession Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-[#EFECE6] dark:bg-[#12100E] border border-[#D6CEBE] dark:border-[#262320] p-6 lg:p-10">
            {/* Left 7 Cols: High-Resolution Framed Plate & Figure Caption */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="bg-[#0B0A09] border border-[#262320] overflow-hidden aspect-[16/10]">
                <ResilientImage
                  src={selectedExhibit.imagePath}
                  alt={selectedExhibit.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-prose italic text-[#57534E] dark:text-[#A8A29E] mt-3">
                {selectedExhibit.imageCaption}
              </p>
            </div>

            {/* Right 5 Cols: Structured Accession Definition List */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono-tabular text-[#9A3412] dark:text-[#D97706]">
                  {selectedExhibit.exhibitNumber}
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
                  {selectedExhibit.title}
                </h3>
                <p className="font-prose text-sm text-[#44403C] dark:text-[#D6D3D1] leading-relaxed mt-3">
                  {selectedExhibit.description}
                </p>

                <dl className="mt-6 pt-4 border-t border-[#D6CEBE] dark:border-[#262320] divide-y divide-[#D6CEBE] dark:divide-[#262320] text-xs">
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                      TIMESTAMP
                    </dt>
                    <dd className="font-mono-tabular text-[#1C1917] dark:text-[#EBE6DF] text-right">
                      {selectedExhibit.dateRecorded}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                      PROVENANCE
                    </dt>
                    <dd className="text-[#1C1917] dark:text-[#EBE6DF] text-right">
                      {selectedExhibit.source}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                      MEDIUM
                    </dt>
                    <dd className="text-[#1C1917] dark:text-[#EBE6DF] text-right">
                      {selectedExhibit.medium}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-4">
                    <dt className="font-mono-tabular text-[#78716C] dark:text-[#A8A29E]">
                      DIMENSIONS
                    </dt>
                    <dd className="font-mono-tabular text-[#1C1917] dark:text-[#EBE6DF] text-right">
                      {selectedExhibit.dimensions}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 p-4 bg-[#F7F4EE] dark:bg-[#181512] border border-[#D6CEBE] dark:border-[#262320]">
                <div className="flex items-center justify-between text-xs font-mono-tabular text-[#78716C] dark:text-[#A8A29E] mb-1">
                  <span>ASSOCIATED AUDIO TRANSCRIPT</span>
                  <button
                    type="button"
                    onClick={() => voiceNarrator.speakSnippet(selectedExhibit.transcriptExcerpt)}
                    className="inline-flex items-center gap-1 text-[#9A3412] dark:text-[#D97706] hover:underline cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    Speak Voice
                  </button>
                </div>
                <p className="font-display text-lg italic text-[#1C1917] dark:text-[#F5F2EB]">
                  {selectedExhibit.transcriptExcerpt}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE 2:13 AM PHONE CALL & THE UNFINISHED ENDING ("Sud—") */}
        <section
          id="ending"
          className="max-w-[1360px] mx-auto px-6 lg:px-12 py-12 lg:py-16 border-t border-[#D6CEBE] dark:border-[#262320]"
        >
          <div className="mb-8">
            <span className="text-xs font-mono-tabular text-[#9A3412] dark:text-[#D97706]">
              OCTOBER 21, 2021 · 02:13 AM · FINAL TRANSMISSION
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1C1917] dark:text-[#F5F2EB] mt-1">
              Caller ID: Daniel & The "Sud—" Truncation
            </h2>
            <p className="font-prose text-base text-[#57534E] dark:text-[#A8A29E] mt-2 max-w-2xl">
              Replay Daniel’s final video message, answer the 2:13 AM call to hear the girl’s voice speaking on the line, and examine or author the ending where Alex’s manuscript abruptly stopped.
            </p>
          </div>

          <PhoneCallSimulator />
        </section>
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="max-w-[1360px] mx-auto px-6 lg:px-12 py-10 border-t border-[#D6CEBE] dark:border-[#262320] flex flex-wrap items-center justify-between gap-4 text-xs text-[#78716C] dark:text-[#A8A29E]">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-[#1C1917] dark:text-[#EBE6DF]">
            The Girl in Room 13
          </span>
          <span aria-hidden="true">·</span>
          <span>Audiobook & Spoken Horror Dossier</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#top" className="hover:underline whitespace-nowrap shrink-0">
            Back to Top
          </a>
          <a href="#narrative" className="hover:underline whitespace-nowrap shrink-0">
            Narrative
          </a>
          <a href="#security-logs" className="hover:underline whitespace-nowrap shrink-0">
            2:13 AM Camera Logs
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
