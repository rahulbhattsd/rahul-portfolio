export const profile = {
  name: 'Rahul Bhatt',
  brand: 'RahulVerse',
  role: 'Full Stack Developer | AI Automation Engineer | Creative Frontend Developer',
  tagline: 'Building scalable full-stack systems, AI-powered applications, and immersive web experiences.',
  altTaglines: [
    'Crafting intelligent digital experiences with code and creativity.',
    'Building futuristic web applications powered by AI and real-time systems.',
    'Developer focused on scalable backend systems, cinematic UI, and AI automation.',
  ],
  about:
    'Computer Science Engineering student focused on full-stack development, AI automation, backend systems, and immersive web experiences. Passionate about building scalable products with modern UI/UX and intelligent workflows.',
  availability: 'Open to full-stack roles, AI automation work, and creative frontend projects',
  phone: '+91 7898372675',
  email: 'rahulbhatt.tech@gmail.com',
  github: 'https://github.com/rahulbhattsd',
  linkedin: 'https://linkedin.com/in/rahulbhatt-developer',
  websiteNames: [
    'RahulVerse',
    'Rahul.dev',
    'Rahul Bhatt Portfolio',
    'RB Labs',
    'RahulX',
    'Cosmic Rahul',
    'Rahul Interactive',
  ],
  floatingText: [
    'Full Stack Engineer',
    'AI Systems Builder',
    'Real-Time Applications',
    'Creative Developer',
    'Backend Architect',
    'Automation Workflows',
    'Immersive Web Experiences',
  ],
}

export const projects = [
  {
    name: 'Mock.ai',
    type: 'AI Automation Platform',
    description:
      'Real-time AI interview platform with intelligent automation workflows, WebSocket communication, and Anthropic API integration.',
    tech: ['Node.js', 'WebSockets', 'Anthropic API', 'Express.js'],
    metric: 'AI Automation',
    liveUrl: 'https://mock-ai-jw8k.onrender.com/',
    repoUrl: 'https://github.com/rahulbhattsd/Mock.ai',
  },
  {
    name: 'VibeCart',
    type: 'E-commerce Platform',
    description:
      'Scalable e-commerce backend with authentication, REST APIs, Docker deployment, and GitHub Actions automation.',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Docker', 'GitHub Actions'],
    metric: 'Commerce',
    liveUrl: 'https://vibecart-eo6e.onrender.com/',
    repoUrl: 'https://github.com/rahulbhattsd/VibeCart',
  },
  {
    name: 'Healthify',
    type: 'AI Assistant',
    description:
      'AI-powered assistant using OpenAI APIs with prompt engineering and real-time conversational features.',
    tech: ['OpenAI API', 'Node.js', 'Express.js'],
    metric: 'Health AI',
    liveUrl: 'https://healthify-31ok.onrender.com/landing',
    repoUrl: 'https://github.com/rahulbhattsd/healthify',
  },
  {
    name: 'StudEdu',
    type: 'Learning Platform',
    description:
      'Full-stack learning management platform with enrollment automation and course progress tracking.',
    tech: ['React.js', 'Node.js', 'MongoDB'],
    metric: 'EdTech',
    liveUrl: 'https://studedu.onrender.com/',
    repoUrl: 'https://github.com/rahulbhattsd/StudEdu',
  },
]

export const skillGroups = [
  {
    label: 'Frontend',
    items: ['JavaScript', 'React.js'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'WebSockets'],
  },
  {
    label: 'Data',
    items: ['MongoDB', 'PostgreSQL', 'MySQL'],
  },
  {
    label: 'AI Automation',
    items: ['OpenAI API', 'Anthropic API'],
  },
  {
    label: 'DevOps',
    items: ['Docker', 'AWS', 'GitHub Actions'],
  },
  {
    label: 'Languages',
    items: ['C++', 'Python'],
  },
]

export const sections = [
  {
    id: 'about',
    number: '01',
    label: 'About Me',
    eyebrow: 'Identity Core',
    face: 'front',
    accent: '#5efcff',
    faceCopy: 'Rahul Bhatt builds full-stack systems, AI automations, and immersive web experiences.',
    title: 'Rahul Bhatt',
    subtitle: profile.role,
    summary: profile.about,
    stats: ['CSE Student', 'AI Automation', 'Immersive UI'],
    details: [
      'Focused on full-stack development, backend architecture, and practical automation workflows.',
      'Comfortable building real-time systems with WebSockets, REST APIs, databases, and AI integrations.',
      'Designs modern UI/UX surfaces that feel polished, cinematic, and production-minded.',
    ],
    camera: {
      position: [0, 0.34, 4.35],
      target: [0, 0, 0.72],
    },
    panel: {
      position: [0, 0, 1.74],
      rotation: [0, 0, 0],
    },
  },
  {
    id: 'skills',
    number: '02',
    label: 'Skills',
    eyebrow: 'Capability Matrix',
    face: 'right',
    accent: '#8b7cff',
    faceCopy: 'JavaScript, React, Node, databases, AI APIs, Docker, AWS, and automation pipelines.',
    title: 'Skills Matrix',
    subtitle: 'Full stack, AI automation, databases, and deployment',
    summary:
      'A practical stack for building end-to-end products: responsive React surfaces, reliable Node backends, real-time communication, durable data stores, and cloud-ready automation.',
    stats: ['16 skills', 'AI + Backend', 'Cloud Ready'],
    details: [],
    camera: {
      position: [4.1, 0.26, 0],
      target: [0.72, 0, 0],
    },
    panel: {
      position: [1.74, 0, 0],
      rotation: [0, Math.PI / 2, 0],
    },
  },
  {
    id: 'projects',
    number: '03',
    label: 'Projects',
    eyebrow: 'Build Archive',
    face: 'left',
    accent: '#ff6fb5',
    faceCopy: 'Mock.ai, VibeCart, Healthify, and StudEdu orbit this portfolio.',
    title: 'Project Worlds',
    subtitle: 'AI automation, commerce, health AI, and learning systems',
    summary:
      'Each project is shaped as a usable product surface with backend logic, automation, real-time systems, AI workflows, deployment habits, and clean architecture.',
    stats: ['4 projects', 'Live builds', 'AI + MERN'],
    details: [],
    camera: {
      position: [-4.1, 0.26, 0],
      target: [-0.72, 0, 0],
    },
    panel: {
      position: [-1.74, 0, 0],
      rotation: [0, -Math.PI / 2, 0],
    },
  },
  {
    id: 'contact',
    number: '04',
    label: 'Contact',
    eyebrow: 'Signal Channel',
    face: 'back',
    accent: '#7dffae',
    faceCopy: 'Available for full-stack collaboration, AI automation, and creative frontend work.',
    title: 'Contact Rahul',
    subtitle: 'Open to roles, internships, and collaborations',
    summary:
      'For full-stack opportunities, AI-powered web applications, automation workflows, and cinematic frontend builds, this channel is open.',
    stats: ['Email', 'Phone', 'LinkedIn'],
    details: [],
    camera: {
      position: [0, 0.3, -4.35],
      target: [0, 0, -0.72],
    },
    panel: {
      position: [0, 0, -1.74],
      rotation: [0, Math.PI, 0],
    },
  },
  {
    id: 'goals',
    number: '05',
    label: 'Goals',
    eyebrow: 'Forward Vector',
    face: 'top',
    accent: '#ffd166',
    faceCopy: 'Ship stronger systems, deepen backend design, and scale AI automation products.',
    title: 'Goals',
    subtitle: 'Where the orbit is headed',
    summary:
      'The near-term mission is to grow into a strong full-stack and AI automation engineering role while building products that feel useful, scalable, and memorable.',
    stats: ['Role Growth', 'System Design', 'AI Products'],
    details: [
      'Land a strong full-stack role and grow inside a serious engineering team.',
      'Build AI-driven web products that solve practical problems.',
      'Improve system design, cloud architecture, backend reliability, and scalable automation.',
    ],
    camera: {
      position: [0, 3.9, 1.05],
      target: [0, 0.72, 0],
    },
    panel: {
      position: [0, 1.74, 0],
      rotation: [-Math.PI / 2, 0, 0],
    },
  },
  {
    id: 'status',
    number: '06',
    label: 'Status',
    eyebrow: 'Live Telemetry',
    face: 'bottom',
    accent: '#5df2b6',
    faceCopy: 'Currently sharpening full-stack depth, AI integrations, and deployment craft.',
    title: 'Current Status',
    subtitle: 'Building, learning, and preparing for real-world impact',
    summary:
      'The current orbit is full-stack execution: shipping projects, refining APIs, exploring OpenAI and Anthropic workflows, and keeping deployment pipelines production-minded.',
    stats: ['Active Build', 'Placement Ready', 'Learning Loop'],
    details: [
      'Building MERN products with clean state, secure auth, REST APIs, and production deployment habits.',
      'Exploring OpenAI and Anthropic-powered workflows for interviews, health, learning, and automation.',
      'Practicing backend fundamentals, database modeling, real-time systems, and cloud-ready delivery.',
    ],
    camera: {
      position: [0, -3.7, 1.05],
      target: [0, -0.72, 0],
    },
    panel: {
      position: [0, -1.74, 0],
      rotation: [Math.PI / 2, 0, 0],
    },
  },
]

export const sectionMap = sections.reduce((map, section) => {
  map[section.id] = section
  return map
}, {})
