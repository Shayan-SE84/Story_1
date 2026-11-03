export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  timestamp: string;
  location: string;
  paragraphs: {
    text: string;
    isDialogue?: boolean;
    speaker?: string;
    soundCue?: 'footsteps' | 'knock' | 'whisper' | 'alert' | 'ring';
    soundLabel?: string;
    isEmphasis?: boolean;
  }[];
  pullQuote?: {
    quote: string;
    attribution: string;
  };
  marginNote: {
    accessionId: string;
    title: string;
    summary: string;
    detail: string;
    interactiveType: 'door13' | 'breaker' | 'cctv' | 'landlord' | 'phonecall';
  };
}

export interface CctvFrame {
  id: string;
  timecode: string;
  cameraName: string;
  title: string;
  caption: string;
  anomalyNote: string;
  threatLevel: string;
  filterStyle: string;
  hasFigureBehindBed?: boolean;
}

export interface CaseExhibit {
  id: string;
  exhibitNumber: string;
  title: string;
  dateRecorded: string;
  source: string;
  medium: string;
  dimensions: string;
  description: string;
  transcriptExcerpt: string;
  imagePath: string;
  imageCaption: string;
}

export const GENERATED_IMAGES = {
  hallway: '/src/assets/images/room_13_hallway_1793706070033.jpg',
  cctvStaircase: '/src/assets/images/cctv_staircase_footage_1793706069688.jpg',
  keysEvidence: '/src/assets/images/landlord_keys_evidence_1793706069626.jpg',
  alexPhone: '/src/assets/images/alex_phone_call_1793706070617.jpg',
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter-1',
    number: '01',
    title: 'The Lease & The Warning',
    subtitle: 'Some Doors Are Better Left Closed',
    timestamp: 'Oct 14, 2021 · 04:15 PM',
    location: '14 Blackwood Road · Ground Foyer',
    paragraphs: [
      {
        text: 'In 2021, a young man named Daniel moved into an old house in a small town. He had recently started a new job and needed a cheap place to stay.',
      },
      {
        text: 'After searching for several days, he found a beautiful but strangely cheap house. The landlord handed him the keys but gave him one warning.',
      },
      {
        text: '"Listen carefully. You can use every room in this house, but never open Room 13."',
        isDialogue: true,
        speaker: 'The Landlord',
      },
      {
        text: 'Daniel laughed and asked, "Why? Is there a ghost inside?"',
      },
      {
        text: 'The landlord looked at him seriously and replied, "Some doors are better left closed."',
        isDialogue: true,
        speaker: 'The Landlord',
      },
      {
        text: 'Daniel ignored the warning.',
        isEmphasis: true,
      },
    ],
    pullQuote: {
      quote: 'Listen carefully. You can use every room in this house, but never open Room 13.',
      attribution: 'Landlord Statement · Lease Handover',
    },
    marginNote: {
      accessionId: 'ACC. 2021.10.14-A',
      title: 'Tenancy Addendum & Brass Key Tag',
      summary: 'Monthly rent was listed at 65% below county market value. Clause 9 explicitly excluded second-floor northeast chamber (Room 13).',
      detail: 'Fuse box inspection confirmed the circuit feeding Room 13 had been physically severed at the main junction box since 2016.',
      interactiveType: 'breaker',
    },
  },
  {
    id: 'chapter-2',
    number: '02',
    title: 'The Light Beneath the Door',
    subtitle: 'Night Three at 2:13 AM',
    timestamp: 'Oct 17, 2021 · 02:13 AM',
    location: 'Upper Landing · Outside Room 13',
    paragraphs: [
      {
        text: 'For the first two nights, everything was normal. But on the third night, Daniel woke up at exactly 2:13 AM.',
      },
      {
        text: 'He heard strange footsteps coming from upstairs.',
      },
      {
        text: 'THUD... THUD... THUD...',
        isEmphasis: true,
        soundCue: 'footsteps',
        soundLabel: 'Listen to Upstairs Footsteps (02:13 AM)',
      },
      {
        text: 'Then he heard a woman’s voice whispering, "Please... help me."',
        isDialogue: true,
        speaker: 'Voice from Upper Floor',
      },
      {
        text: 'Daniel grabbed his phone and slowly walked upstairs. When he reached Room 13, the footsteps suddenly stopped.',
      },
      {
        text: 'He noticed a strange light coming from underneath the door, even though the electricity in that room had been disconnected.',
      },
      {
        text: 'He slowly leaned closer.',
      },
      {
        text: 'Suddenly, a voice whispered from inside:',
      },
      {
        text: '"Daniel... why did you come back?"',
        isDialogue: true,
        speaker: 'Inside Room 13',
        soundCue: 'whisper',
        soundLabel: 'Lean Closer to Door Threshold',
      },
      {
        text: 'Daniel froze. He had never told anyone in that house his name.',
        isEmphasis: true,
      },
    ],
    pullQuote: {
      quote: 'Daniel... why did you come back?',
      attribution: 'Unidentified Female Voice · Threshold of Room 13',
    },
    marginNote: {
      accessionId: 'ACC. 2021.10.17-B',
      title: 'Threshold Luminance Anomaly',
      summary: 'Despite zero mains voltage to Room 13, a warm 2400K amber-white glow spilled across the hallway floorboards.',
      detail: 'Acoustic analysis notes the whisper originated 4 inches from the interior keyhole, spoken by someone already familiar with the tenant.',
      interactiveType: 'door13',
    },
  },
  {
    id: 'chapter-3',
    number: '03',
    title: 'Motion Detected',
    subtitle: 'The Woman on the Stairs & The Knock',
    timestamp: 'Oct 18, 2021 · 02:13 AM',
    location: 'Master Bedroom & Stairwell Feed',
    paragraphs: [
      {
        text: 'The next morning, Daniel installed security cameras around the house. He wanted to prove that someone was playing tricks on him.',
      },
      {
        text: 'That night, at exactly 2:13 AM, his phone received a motion detection alert.',
        soundCue: 'alert',
        soundLabel: 'Trigger 2:13 AM Motion Alert',
      },
      {
        text: 'He opened the camera footage.',
      },
      {
        text: 'A woman wearing a white dress was standing at the top of the stairs. Her long black hair covered her face.',
      },
      {
        text: 'She slowly turned toward Daniel’s bedroom and disappeared.',
      },
      {
        text: 'Suddenly...',
      },
      {
        text: 'KNOCK... KNOCK... KNOCK...',
        isEmphasis: true,
        soundCue: 'knock',
        soundLabel: 'Play Bedroom Door Knock',
      },
      {
        text: 'Someone was knocking on his bedroom door.',
      },
      {
        text: '"Daniel, open the door. It’s Mom."',
        isDialogue: true,
        speaker: 'Outside Bedroom Door',
      },
      {
        text: 'Daniel stopped breathing.',
        isEmphasis: true,
      },
      {
        text: 'His mother had died three years ago.',
      },
      {
        text: 'He slowly stepped away from the door. Then the voice spoke again:',
      },
      {
        text: '"Daniel... I know you’re awake."',
        isDialogue: true,
        speaker: 'Outside Bedroom Door',
      },
    ],
    pullQuote: {
      quote: 'Daniel, open the door. It’s Mom.',
      attribution: 'Voice Mimicry Event · 02:13:18 AM',
    },
    marginNote: {
      accessionId: 'ACC. 2021.10.18-C',
      title: 'Wireless Camera Feed CAM-02',
      summary: 'Infrared motion trigger logged at 02:13:00 AM on upper landing. Subject stood motionless for 14 seconds before frame drop.',
      detail: 'Deceased maternal relative (Margaret Mercer, d. 2018) vocal cadence replicated through solid 2-inch oak bedroom door.',
      interactiveType: 'cctv',
    },
  },
  {
    id: 'chapter-4',
    number: '04',
    title: 'Behind the Bed',
    subtitle: 'The Landlord’s Daughter',
    timestamp: 'Oct 18, 2021 · 08:40 AM',
    location: '14 Blackwood Road · Bedroom & Driveway',
    paragraphs: [
      {
        text: 'The following morning, Daniel decided to leave the house. Before packing his belongings, he checked the security camera recordings one last time.',
      },
      {
        text: 'What he saw made his blood run cold.',
      },
      {
        text: 'The woman in white had been standing inside his bedroom all night.',
        isEmphasis: true,
      },
      {
        text: 'Right behind his bed. Watching him sleep.',
        isEmphasis: true,
      },
      {
        text: 'Daniel immediately called the landlord. When the old man arrived, Daniel showed him the footage.',
      },
      {
        text: 'The landlord turned pale. After a few moments, he whispered:',
      },
      {
        text: '"That woman... was my daughter."',
        isDialogue: true,
        speaker: 'The Landlord',
      },
      {
        text: 'Daniel asked, "What happened to her?"',
      },
      {
        text: 'The old man replied, "She died in Room 13 five years ago. Since then, everyone who has stayed in this house has disappeared."',
        isDialogue: true,
        speaker: 'The Landlord',
      },
      {
        text: 'Daniel stepped backward. "But why did you rent this house to me?"',
      },
      {
        text: 'The landlord looked directly into his eyes and said:',
      },
      {
        text: '"Because my daughter asked me to bring you here."',
        isDialogue: true,
        speaker: 'The Landlord',
        isEmphasis: true,
      },
      {
        text: 'Daniel ran out of the house and drove away.',
      },
    ],
    pullQuote: {
      quote: 'Because my daughter asked me to bring you here.',
      attribution: 'Elias Finch (Landlord) · Final Confrontation',
    },
    marginNote: {
      accessionId: 'ACC. 2021.10.18-D',
      title: 'Overnight Bedroom Playback & Prior Tenants',
      summary: 'CAM-01 (Bedroom Interior) recorded subject standing 18 inches behind headboard from 02:14 AM to 05:42 AM without blinking.',
      detail: 'County records confirm 4 prior tenants between 2016 and 2020 left personal vehicles behind and were never located.',
      interactiveType: 'landlord',
    },
  },
  {
    id: 'chapter-5',
    number: '05',
    title: 'Caller ID: Daniel',
    subtitle: 'Three Days Later · The 2:13 AM Cutoff',
    timestamp: 'Oct 21, 2021 · 02:13 AM',
    location: 'Alex’s Apartment · Recovered Phone Log',
    paragraphs: [
      {
        text: 'Three days later, his best friend Alex received a video message from him.',
      },
      {
        text: 'The video showed Daniel sitting in a dark room. His face was pale, and his eyes were full of tears.',
      },
      {
        text: 'He whispered: "Alex... if you ever receive a phone call from me after midnight, don’t answer it."',
        isDialogue: true,
        speaker: 'Daniel (Video Message)',
      },
      {
        text: 'Alex asked, "Where are you?"',
      },
      {
        text: 'Daniel slowly turned his head toward something behind him. Then he screamed:',
      },
      {
        text: '"SHE’S NOT DEAD! SHE’S SITTING RIGHT BESIDE ME!"',
        isDialogue: true,
        speaker: 'Daniel (Video Message)',
        isEmphasis: true,
      },
      {
        text: 'The video suddenly stopped. Alex stared at his phone in complete silence.',
      },
      {
        text: 'Then his phone started ringing. The caller ID showed:',
      },
      {
        text: 'DANIEL CALLING...',
        isEmphasis: true,
        soundCue: 'ring',
        soundLabel: 'Simulate Incoming Call (02:13 AM)',
      },
      {
        text: 'Alex answered. For several seconds, there was nothing but silence.',
      },
      {
        text: 'Then a little girl’s voice whispered:',
      },
      {
        text: '"Alex... why did you leave me alone in Room 13?"',
        isDialogue: true,
        speaker: 'Caller ID: Daniel',
        soundCue: 'whisper',
        soundLabel: 'Play Voice on Line',
      },
      {
        text: 'The call disconnected. Alex looked at the time.',
      },
      {
        text: '2:13 AM.',
        isEmphasis: true,
      },
      {
        text: 'Sud—',
        isEmphasis: true,
      },
    ],
    pullQuote: {
      quote: 'Alex... why did you leave me alone in Room 13?',
      attribution: 'Incoming Call Log · 02:13:00 AM',
    },
    marginNote: {
      accessionId: 'ACC. 2021.10.21-E',
      title: 'Recovered Manuscript Truncation ("Sud—")',
      summary: 'Alex’s typed account ends mid-word at 02:13:44 AM ("Sud"). No further keystrokes were saved to the local draft buffer.',
      detail: 'Inspect the interactive call log or reconstruct the missing final sentence below.',
      interactiveType: 'phonecall',
    },
  },
];

export const CCTV_FRAMES: CctvFrame[] = [
  {
    id: 'frame-1',
    timecode: '02:12:45 AM',
    cameraName: 'CAM-02 · UPPER STAIRWELL',
    title: 'Baseline Hallway Monitoring',
    caption: 'Stairwell landing empty. Room 13 door visible at far end of corridor with sub-threshold light spill.',
    anomalyNote: 'Ambient temperature sensor drops from 64°F to 41°F in 8 seconds.',
    threatLevel: 'Nominal · Pre-Event',
    filterStyle: 'brightness-90 contrast-125 grayscale',
  },
  {
    id: 'frame-2',
    timecode: '02:13:00 AM',
    cameraName: 'CAM-02 · UPPER STAIRWELL',
    title: 'Motion Alert Triggered',
    caption: 'Female figure in white dress detected standing motionless at top of stairs. Long black hair obscures facial features.',
    anomalyNote: 'No prior door opening or footsteps captured on video prior to frame appearance.',
    threatLevel: 'Critical · Visual Contact',
    filterStyle: 'brightness-105 contrast-150 grayscale',
  },
  {
    id: 'frame-3',
    timecode: '02:13:18 AM',
    cameraName: 'CAM-02 · UPPER STAIRWELL',
    title: 'Head Rotation & Signal Loss',
    caption: 'Subject rotates head 45 degrees toward Daniel’s bedroom door. Video feed experiences 1.8s electromagnetic drop; knocking begins immediately.',
    anomalyNote: 'Audio channel records 3 knocks followed by vocal synthesis matching deceased mother.',
    threatLevel: 'Critical · Acoustic Mimicry',
    filterStyle: 'brightness-75 contrast-200 grayscale sepia-[0.15]',
  },
  {
    id: 'frame-4',
    timecode: '03:41:12 AM',
    cameraName: 'CAM-01 · BEDROOM INTERIOR',
    title: 'Overnight Playback Inspection',
    caption: 'While tenant sleeps after locking bedroom door, subject is already inside the room—standing directly behind the headboard for 3 hours 28 minutes.',
    anomalyNote: 'Bedroom door remained deadbolted from the inside the entire night.',
    threatLevel: 'Extreme · Interior Breach',
    filterStyle: 'brightness-95 contrast-150 grayscale invert-[0.06]',
    hasFigureBehindBed: true,
  },
];

export const CASE_EXHIBITS: CaseExhibit[] = [
  {
    id: 'exhibit-1',
    exhibitNumber: 'EXHIBIT A · ACC. 2021-13-01',
    title: 'Upper Corridor & Room 13 Threshold',
    dateRecorded: 'October 17, 2021 · 02:13 AM',
    source: 'Daniel Mercer’s Mobile Device (Recovered Cloud Backup)',
    medium: 'Digital RAW Frame · ISO 6400 · 35mm Equivalent',
    dimensions: '4032 × 2268 px',
    description: 'Photograph captured on the third night immediately after upstairs footsteps ceased. Despite the circuit breaker for Room 13 being physically disconnected at the basement panel, a continuous band of warm light is visible beneath the door.',
    transcriptExcerpt: 'VOICE FROM INSIDE: "Daniel... why did you come back?"',
    imagePath: GENERATED_IMAGES.hallway,
    imageCaption: 'Fig. 1 — Room 13 door at 02:13 AM showing unexplained sub-threshold illumination.',
  },
  {
    id: 'exhibit-2',
    exhibitNumber: 'EXHIBIT B · ACC. 2021-13-02',
    title: 'Stairwell Infrared Frame (CAM-02)',
    dateRecorded: 'October 18, 2021 · 02:13:00 AM',
    source: 'Home Security DVR Cloud Snapshot',
    medium: '1080p Infrared Night-Vision Frame',
    dimensions: '1920 × 1080 px',
    description: 'Motion alert snapshot sent to Daniel’s phone on the fourth night. Identifies the landlord’s daughter, who died in Room 13 five years prior. Moments after this frame was captured, three knocks sounded on Daniel’s bedroom door.',
    transcriptExcerpt: 'VOICE OUTSIDE BEDROOM: "Daniel, open the door. It’s Mom... Daniel, I know you’re awake."',
    imagePath: GENERATED_IMAGES.cctvStaircase,
    imageCaption: 'Fig. 2 — CAM-02 capture of the woman in white at the top of the stairs at 02:13 AM.',
  },
  {
    id: 'exhibit-3',
    exhibitNumber: 'EXHIBIT C · ACC. 2021-13-03',
    title: 'Brass Key & Tenancy Agreement',
    dateRecorded: 'October 14, 2021 · 04:15 PM',
    source: '14 Blackwood Road Kitchen Table',
    medium: 'Archival Evidence Photograph',
    dimensions: '3200 × 2400 px',
    description: 'Physical key and lease agreement left behind when Daniel fled the residence on the morning of October 18. Landlord Elias Finch later admitted that every tenant who stayed in the house over the preceding five years vanished.',
    transcriptExcerpt: 'LANDLORD: "She died in Room 13 five years ago... my daughter asked me to bring you here."',
    imagePath: GENERATED_IMAGES.keysEvidence,
    imageCaption: 'Fig. 3 — Tarnished brass key and lease paperwork recovered from the ground floor table.',
  },
  {
    id: 'exhibit-4',
    exhibitNumber: 'EXHIBIT D · ACC. 2021-13-04',
    title: 'Alex’s Desk & The 2:13 AM Call Log',
    dateRecorded: 'October 21, 2021 · 02:13 AM',
    source: 'Alex Vance’s Apartment (Scene Reconstruction)',
    medium: 'Forensic Scene Photograph & Call Metadata',
    dimensions: '3200 × 2400 px',
    description: 'Three days after fleeing the house, Daniel transmitted a final video warning Alex never to answer a call from him after midnight. Immediately after the video cut off, Alex’s phone rang with Caller ID "DANIEL CALLING..." at 2:13 AM.',
    transcriptExcerpt: 'LITTLE GIRL’S VOICE ON LINE: "Alex... why did you leave me alone in Room 13?"',
    imagePath: GENERATED_IMAGES.alexPhone,
    imageCaption: 'Fig. 4 — Alex’s smartphone and handwritten notes moments before the manuscript ended mid-word ("Sud").',
  },
];

export interface EndingOption {
  id: string;
  label: string;
  title: string;
  completionText: string;
  paragraphs: string[];
  archivalVerdict: string;
}

export const ENDING_RECONSTRUCTIONS: EndingOption[] = [
  {
    id: 'original',
    label: 'Original Cutoff ("Sud—")',
    title: 'Unfinished Manuscript Buffer (As Recovered)',
    completionText: 'Sud',
    paragraphs: [
      'The text file recovered from Alex’s laptop ends abruptly after the three letters "Sud".',
      'Forensic inspection of the keyboard buffer shows the laptop screen was forced shut at 02:13:47 AM. Neither Daniel nor Alex has been seen since October 21, 2021.',
    ],
    archivalVerdict: 'Status: Both Subjects Unlocated · File Remains Open',
  },
  {
    id: 'reflection',
    label: 'Reconstruction I: The Screen Reflection',
    title: 'The Reflection in the Glass',
    completionText: 'Suddenly, the darkened glass of Alex’s phone screen reflected a figure in a white dress standing directly behind his chair.',
    paragraphs: [
      'Alex’s fingers froze over the keyboard before he could finish typing the word. The room temperature plunged until his breath misted against the monitor.',
      'Slowly, wet black hair draped over his right shoulder, and a familiar voice whispered into his ear: "You answered the phone, Alex. Now it’s your turn to come home."',
    ],
    archivalVerdict: 'Hypothesis A · Acoustic & Visual Transference via Answered Call',
  },
  {
    id: 'door13',
    label: 'Reconstruction II: The Hallway Outside',
    title: 'The Brass Numerals on Alex’s Door',
    completionText: 'Suddenly, a strip of warm amber light spilled from underneath Alex’s own bedroom door—even though the apartment hallway outside was pitch black.',
    paragraphs: [
      'THUD... THUD... THUD...',
      'Heavy footsteps stopped right outside his bedroom. When Alex walked to the door and looked through the peephole, his apartment corridor was gone. He was looking out into the dark wooden landing of 14 Blackwood Road—from the inside of Room 13.',
    ],
    archivalVerdict: 'Hypothesis B · Spatial Relocation to Room 13',
  },
];
