import { useState } from 'react';

const T = {
  bg: '#0f1020', bgCard: '#1a1d35', bgDeep: '#12142a',
  border: '#3D3F55', borderSoft: '#2a2d4a',
  text: '#E0E8FF', textMid: '#8B8FA8', textDim: '#4A4D66',
  accent1: '#06B6D4', accent2: '#3B82F6', accentPurple: '#7F77DD',
  pink: '#D4537E', amber: '#BA7517', green: '#639922',
  white: '#FFFFFF',
};

const ALL_INDUSTRIES = [
  { id: 'tech', name: 'Tech & Engineering', color: '#7F77DD' },
  { id: 'design', name: 'Design & Creative', color: '#D4537E' },
  { id: 'biz', name: 'Business & Finance', color: '#BA7517' },
  { id: 'health', name: 'Healthcare & Medicine', color: '#1D9E75' },
  { id: 'arts', name: 'Arts & Performance', color: '#D4537E' },
  { id: 'edu', name: 'Education & Coaching', color: '#639922' },
  { id: 'media', name: 'Media & Journalism', color: '#378ADD' },
  { id: 'law', name: 'Law & Government', color: '#378ADD' },
  { id: 'science', name: 'Science & Research', color: '#1D9E75' },
  { id: 'hospitality', name: 'Hospitality & Events', color: '#534AB7' },
  { id: 'sports', name: 'Sports & Fitness', color: '#D85A30' },
  { id: 'fashion', name: 'Fashion & Beauty', color: '#D4537E' },
  { id: 'entrepreneur', name: 'Entrepreneurship', color: '#BA7517' },
  { id: 'environment', name: 'Environment & Sustainability', color: '#639922' },
  { id: 'nonprofit', name: 'Social Impact & Nonprofit', color: '#1D9E75' },
  { id: 'marketing', name: 'Marketing & Communications', color: '#D85A30' },
  { id: 'cyber', name: 'Cybersecurity', color: '#7F77DD' },
  { id: 'architecture', name: 'Architecture & Urban Planning', color: '#534AB7' },
  { id: 'gaming', name: 'Gaming & Esports', color: '#7F77DD' },
  { id: 'supplychain', name: 'Supply Chain & Operations', color: '#BA7517' },
  { id: 'food', name: 'Food & Culinary', color: '#D85A30' },
  { id: 'aviation', name: 'Aviation & Transportation', color: '#378ADD' },
];

// Each answer is a weight map across all 22 industries
// Higher = stronger match, 0 = no signal, negative = unlikely match
const TIERS = {
  1: {
    label: '15 & under',
    questions: [
      {
        q: "Which YouTube channel would you actually watch for hours?",
        flavor: "Be honest.",
        opts: [
          { text: "A guy building crazy inventions in his garage", sub: "Engineering meets creativity", weights: { tech: 5, cyber: 3, science: 4, supplychain: 2, aviation: 3, gaming: 2, architect: 1, biz: 1, design: 1, arts: 1, edu: 1, health: 0, media: 1, law: 0, hospitality: 0, sports: 0, fashion: 0, entrepreneur: 2, environment: 1, nonprofit: 0, marketing: 0, food: 0 } },
          { text: "A chef traveling the world trying street food", sub: "Food, culture, adventure", weights: { food: 5, hospitality: 5, travel: 3, media: 3, marketing: 2, arts: 2, entrepreneur: 3, biz: 2, design: 1, fashion: 2, nonprofit: 1, environment: 2, edu: 1, health: 2, science: 1, tech: 1, cyber: 0, law: 0, sports: 0, gaming: 0, supplychain: 2, aviation: 1, architecture: 1 } },
          { text: "Someone exposing scams and investigating mysteries", sub: "Truth seeking, justice", weights: { media: 5, law: 5, cyber: 4, nonprofit: 3, science: 2, tech: 2, edu: 2, biz: 2, marketing: 1, arts: 1, design: 0, fashion: 0, hospitality: 0, sports: 0, gaming: 1, food: 0, aviation: 0, supplychain: 1, architecture: 0, environment: 2, entrepreneur: 1, health: 1 } },
          { text: "A designer showing how they make things look amazing", sub: "Aesthetics and craft", weights: { design: 5, fashion: 5, arts: 4, marketing: 3, architecture: 3, media: 2, entrepreneur: 2, biz: 1, tech: 2, gaming: 2, edu: 1, hospitality: 2, food: 1, sports: 0, law: 0, cyber: 0, science: 1, environment: 1, nonprofit: 1, health: 0, supplychain: 0, aviation: 0 } },
        ]
      },
      {
        q: "Your school is doing a fun day. Which booth are you running?",
        flavor: "Pick the one you'd actually show up early for.",
        opts: [
          { text: "A coding challenge or tech demo", sub: "Build something cool", weights: { tech: 5, cyber: 4, gaming: 4, science: 3, math: 2, edu: 2, entrepreneur: 3, biz: 2, design: 2, media: 1, supplychain: 1, aviation: 2, architecture: 1, arts: 0, fashion: 0, hospitality: 0, food: 0, sports: 0, law: 0, environment: 1, nonprofit: 1, health: 1, marketing: 2 } },
          { text: "A food stall or bake sale", sub: "Feed everyone", weights: { food: 5, hospitality: 5, entrepreneur: 4, marketing: 3, biz: 3, health: 2, edu: 1, nonprofit: 2, environment: 2, arts: 1, design: 2, fashion: 1, sports: 0, law: 0, cyber: 0, tech: 0, science: 1, gaming: 0, supplychain: 2, aviation: 0, architecture: 1, media: 1 } },
          { text: "An art installation or photo exhibit", sub: "Make people feel something", weights: { arts: 5, design: 5, media: 4, fashion: 3, architecture: 3, marketing: 3, edu: 2, nonprofit: 2, environment: 2, hospitality: 2, tech: 1, gaming: 2, food: 1, biz: 1, entrepreneur: 2, science: 0, cyber: 0, law: 0, health: 0, sports: 0, supplychain: 0, aviation: 0 } },
          { text: "A sports tournament or fitness challenge", sub: "Get everyone moving", weights: { sports: 5, health: 4, edu: 3, nonprofit: 3, marketing: 2, entrepreneur: 2, biz: 2, hospitality: 2, media: 2, environment: 1, gaming: 2, food: 1, design: 1, fashion: 1, arts: 1, tech: 1, science: 1, law: 1, cyber: 0, supplychain: 1, aviation: 0, architecture: 0 } },
        ]
      },
      {
        q: "Which superpower would you actually use every day?",
        flavor: "The real answer, not the cool one.",
        opts: [
          { text: "Understanding how any machine or system works instantly", sub: "Engineer brain", weights: { tech: 5, science: 5, cyber: 4, supplychain: 3, aviation: 4, architecture: 3, biz: 2, edu: 2, health: 2, environment: 2, gaming: 3, law: 1, media: 0, arts: 0, design: 1, fashion: 0, food: 0, sports: 1, hospitality: 0, nonprofit: 1, entrepreneur: 2, marketing: 1 } },
          { text: "Knowing exactly what people need before they ask", sub: "Human first brain", weights: { edu: 5, health: 5, nonprofit: 5, hospitality: 4, marketing: 4, law: 3, sports: 2, media: 3, biz: 3, entrepreneur: 3, design: 2, arts: 2, fashion: 2, food: 3, architecture: 2, environment: 2, tech: 1, cyber: 0, science: 1, gaming: 1, supplychain: 1, aviation: 0 } },
          { text: "Making anything look beautiful just by touching it", sub: "Creative brain", weights: { design: 5, fashion: 5, arts: 5, architecture: 4, marketing: 3, media: 3, hospitality: 3, food: 3, gaming: 2, tech: 2, edu: 1, entrepreneur: 2, biz: 1, environment: 2, nonprofit: 1, sports: 0, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "Seeing patterns in numbers that nobody else can see", sub: "Analytical brain", weights: { biz: 5, science: 5, tech: 4, cyber: 3, health: 3, law: 3, environment: 3, supplychain: 3, aviation: 2, sports: 3, marketing: 2, edu: 2, media: 2, architect: 1, nonprofit: 2, entrepreneur: 3, gaming: 2, food: 1, fashion: 0, arts: 0, design: 1, hospitality: 1 } },
        ]
      },
      {
        q: "Which movie are you watching tonight?",
        flavor: "The one you'd actually pick.",
        opts: [
          { text: "A heist movie where a team pulls off something impossible", sub: "Strategy and execution", weights: { biz: 5, law: 4, tech: 4, cyber: 4, entrepreneur: 4, marketing: 3, media: 2, gaming: 3, supplychain: 2, aviation: 2, design: 1, arts: 2, sports: 2, education: 1, health: 0, fashion: 0, food: 0, hospitality: 1, environment: 0, nonprofit: 1, science: 2, architecture: 1 } },
          { text: "A documentary about animals or the environment", sub: "Nature and science", weights: { environment: 5, science: 5, health: 3, nonprofit: 4, edu: 3, media: 3, law: 2, architecture: 2, food: 2, aviation: 2, supplychain: 1, arts: 2, design: 1, tech: 2, sports: 1, biz: 1, fashion: 0, gaming: 0, cyber: 0, marketing: 1, hospitality: 1, entrepreneur: 1 } },
          { text: "A sports movie where the underdog wins everything", sub: "Drive and resilience", weights: { sports: 5, edu: 4, nonprofit: 3, health: 3, marketing: 3, media: 3, biz: 2, entrepreneur: 3, arts: 2, design: 1, fashion: 1, gaming: 2, law: 1, food: 1, hospitality: 1, tech: 1, science: 1, environment: 1, cyber: 0, supplychain: 0, aviation: 1, architecture: 0 } },
          { text: "A film about a designer or artist building something iconic", sub: "Craft and vision", weights: { arts: 5, design: 5, fashion: 4, architecture: 4, media: 3, marketing: 3, entrepreneur: 3, tech: 2, gaming: 2, edu: 2, food: 2, hospitality: 2, biz: 2, environment: 1, nonprofit: 1, sports: 0, health: 0, law: 0, cyber: 0, science: 1, supplychain: 0, aviation: 0 } },
        ]
      },
      {
        q: "What do your friends come to you for?",
        flavor: "The real thing, not the thing you wish they came to you for.",
        opts: [
          { text: "Tech help or fixing something broken", sub: "You just know how things work", weights: { tech: 5, cyber: 5, science: 3, gaming: 3, supplychain: 2, aviation: 2, edu: 2, biz: 1, design: 2, media: 1, health: 1, law: 0, arts: 0, fashion: 0, food: 0, sports: 0, hospitality: 0, environment: 1, nonprofit: 0, entrepreneur: 2, architecture: 1, marketing: 1 } },
          { text: "Planning events or knowing what's fun", sub: "You make things happen", weights: { hospitality: 5, marketing: 5, entrepreneur: 4, biz: 3, media: 3, arts: 3, design: 3, food: 3, sports: 2, fashion: 2, edu: 2, nonprofit: 2, gaming: 2, law: 1, health: 1, tech: 1, cyber: 0, science: 0, environment: 1, supplychain: 1, aviation: 0, architecture: 1 } },
          { text: "Creative ideas or making things look good", sub: "You have the eye", weights: { design: 5, arts: 5, fashion: 5, marketing: 4, architecture: 3, media: 3, gaming: 2, tech: 2, edu: 1, food: 2, hospitality: 2, entrepreneur: 3, biz: 1, environment: 1, nonprofit: 1, sports: 0, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "Advice or figuring out what to do", sub: "People trust your judgment", weights: { edu: 5, health: 4, law: 4, nonprofit: 4, biz: 3, media: 2, sports: 2, science: 2, environment: 3, marketing: 2, entrepreneur: 3, arts: 1, design: 1, fashion: 0, food: 1, hospitality: 1, tech: 1, cyber: 1, gaming: 0, supplychain: 1, aviation: 0, architecture: 1 } },
        ]
      },
      {
        q: "Which class do you actually not hate?",
        flavor: "Or the least bad one.",
        opts: [
          { text: "Science or math", sub: "Numbers and experiments", weights: { science: 5, tech: 5, cyber: 4, health: 3, aviation: 3, supplychain: 3, environment: 3, biz: 3, architecture: 2, gaming: 2, edu: 2, law: 1, media: 0, arts: 0, design: 1, fashion: 0, food: 1, sports: 1, hospitality: 0, nonprofit: 1, entrepreneur: 2, marketing: 1 } },
          { text: "Art or music", sub: "Making and expressing", weights: { arts: 5, design: 5, fashion: 4, media: 3, marketing: 3, architecture: 3, gaming: 3, tech: 2, edu: 2, food: 2, hospitality: 2, entrepreneur: 2, environment: 1, nonprofit: 1, biz: 1, sports: 0, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "History or English", sub: "Stories and context", weights: { media: 5, law: 5, edu: 4, nonprofit: 4, arts: 3, marketing: 3, architecture: 2, environment: 3, science: 2, biz: 2, design: 1, fashion: 2, food: 1, hospitality: 1, tech: 1, cyber: 1, gaming: 1, sports: 1, health: 2, supplychain: 1, aviation: 1, entrepreneur: 2 } },
          { text: "PE or health", sub: "Movement and wellbeing", weights: { sports: 5, health: 5, edu: 3, nonprofit: 2, science: 2, food: 2, environment: 2, marketing: 1, biz: 1, design: 1, fashion: 1, arts: 1, media: 1, law: 0, tech: 0, cyber: 0, gaming: 1, supplychain: 0, aviation: 0, architecture: 0, entrepreneur: 1, hospitality: 1 } },
        ]
      },
      {
        q: "If you could have any job for a day, you'd pick:",
        flavor: "Dream big.",
        opts: [
          { text: "Working at a cool tech company", sub: "Build the future", weights: { tech: 5, cyber: 4, gaming: 4, entrepreneur: 4, biz: 3, design: 3, media: 2, science: 2, marketing: 2, aviation: 2, supplychain: 1, edu: 1, health: 1, law: 1, arts: 1, fashion: 1, food: 0, sports: 1, hospitality: 0, environment: 1, nonprofit: 1, architecture: 1 } },
          { text: "Being a chef at a famous restaurant", sub: "Create and feed people", weights: { food: 5, hospitality: 5, entrepreneur: 4, marketing: 3, arts: 3, design: 2, biz: 3, media: 2, health: 2, environment: 2, fashion: 1, edu: 1, science: 2, nonprofit: 1, tech: 0, cyber: 0, gaming: 0, sports: 0, law: 0, supplychain: 2, aviation: 0, architecture: 1 } },
          { text: "Designing clothes or interiors", sub: "Shape how things look and feel", weights: { fashion: 5, design: 5, architecture: 5, arts: 4, marketing: 3, entrepreneur: 3, media: 2, hospitality: 3, biz: 2, tech: 1, gaming: 1, edu: 1, environment: 2, food: 1, nonprofit: 1, sports: 0, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "Playing or coaching a sport professionally", sub: "Live in the game", weights: { sports: 5, health: 4, edu: 3, marketing: 3, media: 3, biz: 2, nonprofit: 2, entrepreneur: 2, science: 2, law: 1, gaming: 2, food: 1, design: 1, fashion: 1, arts: 1, tech: 1, cyber: 0, supplychain: 0, aviation: 0, environment: 1, hospitality: 2, architecture: 0 } },
        ]
      },
    ]
  },
  2: {
    label: '16 – 18',
    questions: [
      {
        q: "It's Saturday, you have nothing planned. You end up...",
        flavor: "The honest answer.",
        opts: [
          { text: "Reorganizing your space or making something look better", sub: "You need things to feel right", weights: { design: 5, architecture: 5, fashion: 4, arts: 3, marketing: 3, hospitality: 3, tech: 2, gaming: 2, entrepreneur: 2, food: 2, edu: 1, media: 2, biz: 1, environment: 2, nonprofit: 1, sports: 0, health: 1, law: 0, cyber: 0, science: 1, supplychain: 1, aviation: 0 } },
          { text: "Watching videos about how businesses or markets work", sub: "You want to understand the game", weights: { biz: 5, entrepreneur: 5, marketing: 4, tech: 3, media: 3, law: 3, supplychain: 3, aviation: 2, science: 2, cyber: 2, edu: 2, health: 1, environment: 2, nonprofit: 2, design: 1, arts: 0, fashion: 1, food: 2, sports: 2, gaming: 2, hospitality: 2, architecture: 1 } },
          { text: "Hosting or planning something for your friends", sub: "You make things happen", weights: { hospitality: 5, marketing: 5, entrepreneur: 4, biz: 3, arts: 3, food: 3, media: 3, design: 2, sports: 2, fashion: 2, edu: 2, nonprofit: 2, gaming: 2, law: 1, health: 1, tech: 1, cyber: 0, science: 0, environment: 1, supplychain: 1, aviation: 0, architecture: 2 } },
          { text: "Going deep on a random topic you got curious about", sub: "You can't stop once you start", weights: { science: 5, media: 5, edu: 4, law: 4, health: 3, environment: 4, tech: 3, cyber: 3, nonprofit: 3, biz: 2, architecture: 2, aviation: 3, supplychain: 2, arts: 2, design: 1, fashion: 0, food: 2, sports: 1, gaming: 2, hospitality: 0, entrepreneur: 2, marketing: 1 } },
        ]
      },
      {
        q: "Which project would you actually enjoy doing in school?",
        flavor: "The one where time flies.",
        opts: [
          { text: "Building an app or coding something from scratch", sub: "Seeing it come to life", weights: { tech: 5, cyber: 4, gaming: 4, entrepreneur: 4, design: 3, biz: 2, media: 2, science: 2, marketing: 2, aviation: 2, supplychain: 1, edu: 2, health: 1, law: 1, arts: 1, fashion: 0, food: 0, sports: 0, hospitality: 0, environment: 1, nonprofit: 1, architecture: 2 } },
          { text: "Writing an investigative piece or making a mini documentary", sub: "Getting to the truth", weights: { media: 5, law: 5, nonprofit: 4, edu: 4, science: 3, environment: 4, health: 3, arts: 3, marketing: 2, biz: 2, design: 1, fashion: 1, food: 1, sports: 1, tech: 1, cyber: 2, gaming: 0, supplychain: 0, aviation: 0, hospitality: 0, entrepreneur: 1, architecture: 0 } },
          { text: "Designing a brand identity or creating a campaign", sub: "Making something people feel", weights: { marketing: 5, design: 5, entrepreneur: 4, media: 4, fashion: 4, arts: 3, biz: 3, tech: 2, gaming: 2, hospitality: 2, food: 2, edu: 1, nonprofit: 2, environment: 1, sports: 1, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0, architecture: 2 } },
          { text: "Figuring out why something keeps happening using numbers", sub: "Finding the pattern nobody sees", weights: { science: 5, biz: 5, tech: 4, health: 4, environment: 4, law: 3, cyber: 3, sports: 3, supplychain: 3, aviation: 3, edu: 2, marketing: 2, nonprofit: 2, architecture: 2, media: 1, arts: 0, design: 0, fashion: 0, food: 1, gaming: 2, hospitality: 0, entrepreneur: 2 } },
        ]
      },
      {
        q: "Which of these problems actually bothers you?",
        flavor: "The one that genuinely keeps you up.",
        opts: [
          { text: "The healthcare system is broken and people can't get care", sub: "This feels personal", weights: { health: 5, nonprofit: 5, law: 4, science: 4, edu: 3, tech: 3, biz: 2, media: 3, environment: 2, marketing: 1, design: 1, arts: 1, food: 2, sports: 1, cyber: 1, supplychain: 2, aviation: 0, gaming: 0, fashion: 0, architecture: 1, hospitality: 1, entrepreneur: 2 } },
          { text: "Cities are badly designed and nobody thinks about who lives there", sub: "Space matters to people", weights: { architecture: 5, environment: 5, nonprofit: 4, law: 4, design: 4, tech: 3, science: 3, edu: 3, biz: 2, supplychain: 3, aviation: 2, health: 2, media: 2, arts: 2, marketing: 1, fashion: 0, food: 2, sports: 1, cyber: 1, gaming: 0, hospitality: 2, entrepreneur: 2 } },
          { text: "Athletes and artists don't get paid what they're worth", sub: "The system is rigged", weights: { sports: 5, arts: 5, law: 4, biz: 4, marketing: 4, media: 4, entrepreneur: 3, fashion: 3, edu: 2, nonprofit: 3, gaming: 3, tech: 1, cyber: 0, design: 2, health: 0, science: 0, environment: 0, food: 0, supplychain: 1, aviation: 0, hospitality: 1, architecture: 0 } },
          { text: "The planet is being destroyed and nobody is moving fast enough", sub: "This is urgent", weights: { environment: 5, nonprofit: 5, science: 5, law: 4, tech: 3, edu: 3, media: 3, architecture: 3, supplychain: 3, health: 2, aviation: 2, biz: 2, food: 3, design: 1, arts: 1, marketing: 2, cyber: 0, gaming: 0, fashion: 1, sports: 0, hospitality: 0, entrepreneur: 2 } },
        ]
      },
      {
        q: "Pick the job you'd shadow for a day:",
        flavor: "The one that actually sounds cool.",
        opts: [
          { text: "A founder pitching investors at a startup", sub: "High stakes, big vision", weights: { entrepreneur: 5, biz: 5, tech: 4, marketing: 4, media: 3, law: 3, design: 2, cyber: 2, gaming: 2, supplychain: 2, aviation: 1, edu: 1, health: 1, arts: 1, fashion: 1, food: 1, sports: 1, hospitality: 1, environment: 1, nonprofit: 1, science: 1, architecture: 1 } },
          { text: "A stylist dressing a celebrity for a red carpet", sub: "Creativity and culture", weights: { fashion: 5, arts: 5, design: 5, marketing: 4, media: 4, hospitality: 3, entrepreneur: 3, biz: 2, gaming: 1, tech: 1, edu: 0, health: 0, law: 0, cyber: 0, science: 0, environment: 0, nonprofit: 0, sports: 1, food: 1, supplychain: 1, aviation: 0, architecture: 2 } },
          { text: "A data scientist working for a sports team", sub: "Numbers meet competition", weights: { sports: 5, tech: 5, science: 5, biz: 4, gaming: 3, health: 3, marketing: 3, media: 2, edu: 2, cyber: 2, supplychain: 2, entrepreneur: 2, law: 1, design: 0, arts: 0, fashion: 0, food: 0, hospitality: 0, environment: 1, nonprofit: 0, aviation: 1, architecture: 0 } },
          { text: "A journalist investigating a corrupt company", sub: "Truth and accountability", weights: { media: 5, law: 5, nonprofit: 4, tech: 3, cyber: 3, biz: 3, edu: 3, environment: 3, health: 2, science: 2, marketing: 1, arts: 2, design: 0, fashion: 0, food: 0, sports: 0, gaming: 0, hospitality: 0, supplychain: 1, aviation: 0, entrepreneur: 1, architecture: 0 } },
        ]
      },
      {
        q: "What kind of impact do you want to have?",
        flavor: "Be honest with yourself.",
        opts: [
          { text: "Build something people use every day", sub: "Scale matters to you", weights: { tech: 5, entrepreneur: 5, design: 4, biz: 4, marketing: 4, gaming: 3, media: 3, supplychain: 3, food: 2, hospitality: 2, edu: 2, health: 2, architecture: 2, aviation: 2, arts: 1, fashion: 2, cyber: 2, science: 2, environment: 1, nonprofit: 1, law: 1, sports: 1 } },
          { text: "Fight for something that's genuinely unfair", sub: "Justice drives you", weights: { law: 5, nonprofit: 5, media: 4, edu: 4, health: 3, environment: 4, science: 2, arts: 3, sports: 2, tech: 1, cyber: 2, biz: 1, marketing: 1, design: 0, fashion: 0, food: 1, gaming: 0, hospitality: 0, supplychain: 0, aviation: 0, entrepreneur: 1, architecture: 2 } },
          { text: "Make something that moves people emotionally", sub: "Art and feeling matter to you", weights: { arts: 5, design: 5, media: 5, fashion: 4, marketing: 4, gaming: 3, food: 3, architecture: 3, hospitality: 3, edu: 2, nonprofit: 2, environment: 2, entrepreneur: 2, tech: 1, sports: 1, biz: 1, health: 1, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "Help someone directly, one person at a time", sub: "The individual matters most", weights: { health: 5, edu: 5, nonprofit: 5, sports: 3, law: 3, food: 3, hospitality: 3, science: 2, arts: 2, design: 1, fashion: 1, marketing: 1, tech: 1, biz: 1, media: 1, environment: 2, cyber: 0, gaming: 0, supplychain: 0, aviation: 0, entrepreneur: 2, architecture: 0 } },
        ]
      },
      {
        q: "Which elective would you actually show up for?",
        flavor: "No judgment.",
        opts: [
          { text: "Cybersecurity and ethical hacking", sub: "Break things to protect them", weights: { cyber: 5, tech: 5, law: 3, science: 3, biz: 2, gaming: 3, media: 2, edu: 1, entrepreneur: 2, supplychain: 1, aviation: 1, health: 1, environment: 0, nonprofit: 0, arts: 0, design: 0, fashion: 0, food: 0, sports: 0, hospitality: 0, architecture: 0, marketing: 1 } },
          { text: "Culinary arts and the business behind food", sub: "Feed people and build something", weights: { food: 5, hospitality: 5, entrepreneur: 4, biz: 4, marketing: 3, health: 3, science: 2, design: 2, arts: 2, environment: 2, media: 1, edu: 1, nonprofit: 1, supplychain: 2, tech: 0, cyber: 0, gaming: 0, law: 0, sports: 0, fashion: 1, aviation: 0, architecture: 1 } },
          { text: "Game design and esports management", sub: "Build worlds and compete", weights: { gaming: 5, tech: 5, design: 4, marketing: 4, biz: 3, media: 3, entrepreneur: 3, arts: 3, sports: 2, cyber: 2, edu: 1, fashion: 0, food: 0, law: 0, health: 0, environment: 0, nonprofit: 0, supplychain: 1, aviation: 0, architecture: 1, science: 1, hospitality: 1 } },
          { text: "Fashion and how the industry actually works", sub: "More than clothes", weights: { fashion: 5, design: 5, marketing: 4, entrepreneur: 4, biz: 4, arts: 3, media: 3, hospitality: 2, environment: 2, tech: 1, gaming: 0, cyber: 0, law: 1, health: 0, science: 0, edu: 1, nonprofit: 1, food: 1, sports: 0, supplychain: 2, aviation: 0, architecture: 2 } },
        ]
      },
      {
        q: "Honestly, what do you care about most?",
        flavor: "The real answer.",
        opts: [
          { text: "Making a lot of money doing something interesting", sub: "Ambition is not a dirty word", weights: { biz: 5, entrepreneur: 5, tech: 4, law: 4, biz: 5, marketing: 3, cyber: 3, gaming: 3, supplychain: 2, aviation: 3, fashion: 3, sports: 2, media: 2, design: 2, health: 2, science: 2, food: 2, hospitality: 2, architecture: 2, edu: 1, nonprofit: 0, environment: 1, arts: 1 } },
          { text: "Being known for creating something iconic", sub: "Legacy matters to you", weights: { arts: 5, design: 5, fashion: 5, media: 4, marketing: 4, architecture: 4, gaming: 3, entrepreneur: 3, tech: 2, food: 3, sports: 2, hospitality: 2, biz: 2, edu: 1, nonprofit: 1, environment: 1, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 1 } },
          { text: "Feeling like my work actually matters to someone", sub: "Purpose over prestige", weights: { nonprofit: 5, edu: 5, health: 5, environment: 4, law: 4, science: 3, media: 3, arts: 3, sports: 2, food: 2, hospitality: 2, architecture: 2, tech: 2, design: 1, marketing: 1, biz: 1, entrepreneur: 2, fashion: 0, gaming: 0, cyber: 0, supplychain: 1, aviation: 0 } },
          { text: "Never being bored — always learning something new", sub: "Curiosity never stops", weights: { science: 5, tech: 4, media: 4, edu: 4, cyber: 4, environment: 3, law: 3, aviation: 4, gaming: 3, design: 3, health: 3, architecture: 3, biz: 2, arts: 2, food: 2, supplychain: 2, marketing: 2, nonprofit: 2, sports: 1, fashion: 1, entrepreneur: 2, hospitality: 1 } },
        ]
      },
    ]
  },
  3: {
    label: '19+',
    questions: [
      {
        q: "Which internship would you actually apply for?",
        flavor: "The one you'd wake up early for.",
        opts: [
          { text: "A fintech startup building something nobody has seen before", sub: "High risk, high reward", weights: { entrepreneur: 5, biz: 5, tech: 5, cyber: 3, marketing: 3, design: 2, media: 2, supplychain: 2, law: 2, gaming: 2, aviation: 1, science: 1, edu: 1, health: 1, arts: 0, fashion: 1, food: 0, sports: 1, hospitality: 0, environment: 1, nonprofit: 0, architecture: 1 } },
          { text: "A nonprofit working on climate or social justice", sub: "Mission over money", weights: { nonprofit: 5, environment: 5, law: 4, edu: 4, science: 4, media: 3, health: 3, architecture: 3, tech: 2, biz: 1, design: 1, arts: 2, food: 2, supplychain: 2, aviation: 1, marketing: 1, cyber: 0, gaming: 0, fashion: 0, sports: 0, hospitality: 0, entrepreneur: 2 } },
          { text: "A creative agency doing branding for major companies", sub: "Where strategy meets art", weights: { marketing: 5, design: 5, media: 4, entrepreneur: 4, biz: 4, arts: 3, fashion: 3, tech: 2, gaming: 2, hospitality: 2, food: 2, architecture: 2, edu: 1, nonprofit: 1, environment: 1, sports: 1, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "A hospital or research lab on the cutting edge of medicine", sub: "Science that saves lives", weights: { health: 5, science: 5, tech: 4, edu: 3, law: 3, nonprofit: 3, biz: 2, cyber: 2, environment: 2, media: 1, design: 0, arts: 0, fashion: 0, food: 1, sports: 2, gaming: 0, supplychain: 1, aviation: 0, hospitality: 0, marketing: 1, entrepreneur: 1, architecture: 0 } },
        ]
      },
      {
        q: "When you picture your work life at 30, what does it look like?",
        flavor: "The honest version, not the LinkedIn version.",
        opts: [
          { text: "Running my own thing or being a key person at a startup", sub: "You want to build it", weights: { entrepreneur: 5, biz: 5, tech: 4, marketing: 4, design: 3, media: 3, food: 3, hospitality: 3, fashion: 3, gaming: 3, sports: 2, edu: 2, law: 2, health: 1, science: 1, cyber: 2, supplychain: 2, aviation: 2, environment: 1, nonprofit: 1, arts: 2, architecture: 2 } },
          { text: "Working somewhere with a clear mission I believe in", sub: "Values over vanity", weights: { nonprofit: 5, edu: 5, environment: 5, health: 4, law: 4, science: 3, media: 3, arts: 3, sports: 2, tech: 2, biz: 1, design: 1, marketing: 1, food: 2, hospitality: 1, architecture: 2, cyber: 1, gaming: 0, fashion: 0, supplychain: 1, aviation: 1, entrepreneur: 2 } },
          { text: "Doing something creative that people can see and feel", sub: "Your work lives in the world", weights: { arts: 5, design: 5, fashion: 5, media: 4, marketing: 4, architecture: 4, gaming: 3, food: 3, hospitality: 3, tech: 2, entrepreneur: 2, biz: 1, edu: 1, nonprofit: 1, environment: 2, sports: 1, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "Being the expert in a room full of people who need my knowledge", sub: "Depth over breadth", weights: { science: 5, law: 5, health: 5, edu: 5, tech: 4, cyber: 4, biz: 3, environment: 3, aviation: 3, architecture: 3, supplychain: 2, media: 2, sports: 2, marketing: 1, design: 1, arts: 0, fashion: 0, food: 1, gaming: 1, hospitality: 0, nonprofit: 2, entrepreneur: 1 } },
          { text: "Doing solid work, clocking out, and having a life outside of it", sub: "Balance over hustle", weights: { entrepreneur: 0, biz: 5, tech: 4, marketing: 3, design: 2, media: 1, food: 1, hospitality: 1, fashion: 1, gaming: 1, sports: 1, edu: 3, law: 2, health: 3, science: 3, cyber: 4, supplychain: 5, aviation: 4, environment: 3, nonprofit: 2, arts: 1, architecture: 3 } },
        ]
      },
      {
        q: "Which problem do you find yourself researching for fun?",
        flavor: "The rabbit hole you actually go down.",
        opts: [
          { text: "How AI is changing industries and what that means", sub: "The future is now", weights: { tech: 5, cyber: 5, biz: 4, media: 4, science: 4, edu: 3, health: 3, law: 3, marketing: 3, gaming: 3, supplychain: 2, aviation: 2, design: 2, environment: 2, entrepreneur: 3, fashion: 1, food: 1, sports: 2, hospitality: 1, nonprofit: 1, arts: 1, architecture: 1 } },
          { text: "Why certain cities thrive and others collapse", sub: "Systems and people", weights: { architecture: 5, environment: 5, law: 4, science: 4, biz: 4, supplychain: 4, edu: 3, nonprofit: 3, media: 3, tech: 2, health: 2, aviation: 3, food: 2, hospitality: 2, design: 1, arts: 1, marketing: 1, sports: 0, fashion: 0, cyber: 1, gaming: 0, entrepreneur: 2 } },
          { text: "How culture, music, and media actually shape society", sub: "Soft power is real", weights: { media: 5, arts: 5, marketing: 5, fashion: 4, edu: 4, nonprofit: 3, law: 3, biz: 3, design: 3, gaming: 3, sports: 3, hospitality: 2, food: 2, tech: 1, environment: 1, health: 1, architect: 0, cyber: 0, science: 1, supplychain: 0, aviation: 0, entrepreneur: 2 } },
          { text: "Why the healthcare or education system is so broken", sub: "Fixing what matters most", weights: { health: 5, edu: 5, law: 5, nonprofit: 5, science: 4, media: 3, tech: 3, biz: 2, environment: 2, architecture: 2, arts: 1, design: 0, fashion: 0, food: 1, sports: 1, marketing: 1, cyber: 1, gaming: 0, supplychain: 1, aviation: 0, hospitality: 0, entrepreneur: 2 } },
        ]
      },
      {
        q: "What would make you leave a job?",
        flavor: "The dealbreaker.",
        opts: [
          { text: "No room to build or create anything new", sub: "You need to make things", weights: { entrepreneur: 5, tech: 5, design: 5, arts: 4, gaming: 4, marketing: 4, architecture: 4, media: 3, food: 3, fashion: 3, biz: 3, science: 2, edu: 2, hospitality: 2, cyber: 2, environment: 1, health: 1, law: 1, nonprofit: 1, sports: 1, supplychain: 1, aviation: 1 } },
          { text: "The company doesn't actually care about people", sub: "Values are non-negotiable", weights: { nonprofit: 5, edu: 5, health: 5, law: 4, environment: 4, media: 3, arts: 3, sports: 3, food: 3, hospitality: 3, science: 2, tech: 2, biz: 1, marketing: 1, design: 1, fashion: 0, cyber: 1, gaming: 0, supplychain: 1, aviation: 0, entrepreneur: 1, architecture: 2 } },
          { text: "The work is repetitive and I stop learning", sub: "Growth is everything", weights: { science: 5, tech: 5, edu: 5, cyber: 4, media: 4, law: 4, health: 3, environment: 3, aviation: 3, gaming: 3, architecture: 3, biz: 2, design: 2, arts: 2, marketing: 2, entrepreneur: 3, food: 1, fashion: 1, sports: 1, hospitality: 0, nonprofit: 2, supplychain: 2 } },
          { text: "There's no path to real influence or leadership", sub: "You want to matter", weights: { biz: 5, law: 5, entrepreneur: 5, marketing: 4, media: 4, tech: 4, sports: 3, health: 3, edu: 3, fashion: 3, arts: 2, design: 2, gaming: 2, nonprofit: 2, environment: 2, science: 2, cyber: 2, food: 2, hospitality: 2, architecture: 2, supplychain: 1, aviation: 2 } },
        ]
      },
      {
        q: "Pick the person you'd most want to have coffee with:",
        flavor: "The one you'd actually prepare questions for.",
        opts: [
          { text: "A VC who funds early stage startups", sub: "Money, risk, and vision", weights: { biz: 5, entrepreneur: 5, tech: 4, marketing: 3, media: 3, law: 3, design: 2, gaming: 2, cyber: 2, supplychain: 1, aviation: 1, science: 1, edu: 1, health: 1, arts: 0, fashion: 1, food: 0, sports: 1, hospitality: 0, environment: 1, nonprofit: 0, architecture: 1 } },
          { text: "A documentary filmmaker who exposes hard truths", sub: "Truth and craft", weights: { media: 5, arts: 5, law: 4, nonprofit: 4, edu: 3, environment: 4, science: 3, health: 2, marketing: 2, biz: 1, design: 2, tech: 1, cyber: 2, gaming: 0, fashion: 0, food: 1, sports: 0, hospitality: 0, supplychain: 0, aviation: 0, entrepreneur: 1, architecture: 0 } },
          { text: "A surgeon who also does health policy work", sub: "Depth and impact", weights: { health: 5, law: 5, science: 5, edu: 4, nonprofit: 4, biz: 3, tech: 3, media: 2, environment: 2, architecture: 1, cyber: 0, gaming: 0, arts: 0, design: 0, fashion: 0, food: 1, sports: 1, hospitality: 0, supplychain: 0, aviation: 0, entrepreneur: 1, marketing: 1 } },
          { text: "A creative director at a global brand", sub: "Art meets commerce", weights: { design: 5, marketing: 5, fashion: 5, arts: 4, media: 4, entrepreneur: 3, biz: 3, tech: 2, gaming: 2, hospitality: 2, food: 2, architecture: 2, edu: 1, nonprofit: 0, environment: 0, sports: 0, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
        ]
      },
      {
        q: "What are you most likely googling at midnight?",
        flavor: "The real search history.",
        opts: [
          { text: "How a specific company or industry makes money", sub: "Business models fascinate you", weights: { biz: 5, entrepreneur: 5, marketing: 4, tech: 4, media: 3, law: 3, supplychain: 3, aviation: 2, gaming: 2, fashion: 2, food: 2, hospitality: 2, science: 1, cyber: 2, edu: 1, health: 1, arts: 0, design: 1, environment: 1, nonprofit: 0, sports: 1, architecture: 1 } },
          { text: "The science behind something that just blew my mind", sub: "Curiosity without limits", weights: { science: 5, tech: 5, health: 4, environment: 4, aviation: 4, cyber: 3, edu: 3, architecture: 3, supplychain: 2, biz: 2, media: 2, law: 2, gaming: 2, food: 1, arts: 1, design: 1, fashion: 0, sports: 1, hospitality: 0, nonprofit: 2, entrepreneur: 1, marketing: 0 } },
          { text: "What it actually takes to make it in a creative field", sub: "The real path, not the highlight reel", weights: { arts: 5, design: 5, fashion: 5, media: 4, gaming: 4, marketing: 4, entrepreneur: 3, food: 3, hospitality: 3, architecture: 3, biz: 2, tech: 2, edu: 2, sports: 2, nonprofit: 1, environment: 0, health: 0, law: 0, cyber: 0, science: 0, supplychain: 0, aviation: 0 } },
          { text: "How to make real change in a broken system", sub: "You believe things can be different", weights: { nonprofit: 5, law: 5, edu: 5, environment: 5, health: 4, media: 3, science: 3, tech: 3, arts: 2, architecture: 2, biz: 1, marketing: 1, design: 0, fashion: 0, food: 2, sports: 1, cyber: 1, gaming: 0, supplychain: 1, aviation: 0, entrepreneur: 2, hospitality: 0 } },
        ]
      },
      {
        q: "What's your honest relationship with money?",
        flavor: "No judgment, seriously.",
        opts: [
          { text: "I want a lot of it and I'm not ashamed of that", sub: "Ambition is fuel", weights: { biz: 5, entrepreneur: 5, law: 4, tech: 4, marketing: 3, fashion: 3, sports: 3, cyber: 3, gaming: 3, aviation: 3, supplychain: 2, health: 2, media: 2, design: 2, architecture: 2, science: 1, edu: 1, food: 2, hospitality: 2, arts: 1, environment: 0, nonprofit: 0 } },
          { text: "I want enough to be comfortable doing meaningful work", sub: "Balance over everything", weights: { edu: 5, health: 5, nonprofit: 4, environment: 4, science: 4, arts: 3, law: 3, media: 3, food: 3, architecture: 3, design: 2, sports: 2, tech: 2, biz: 2, marketing: 1, fashion: 1, hospitality: 2, cyber: 1, gaming: 1, supplychain: 1, aviation: 1, entrepreneur: 2 } },
          { text: "I'd take less money to do something I'm genuinely proud of", sub: "Pride over paycheck", weights: { arts: 5, nonprofit: 5, environment: 5, edu: 4, media: 4, design: 4, food: 3, sports: 3, architecture: 3, health: 2, science: 2, fashion: 2, gaming: 2, tech: 1, biz: 0, marketing: 1, law: 2, cyber: 0, supplychain: 0, aviation: 0, entrepreneur: 2, hospitality: 2 } },
          { text: "I haven't figured that out yet and that's okay", sub: "Honest about the uncertainty", weights: { edu: 4, arts: 4, science: 3, media: 3, environment: 3, nonprofit: 3, health: 3, design: 3, gaming: 3, tech: 2, biz: 2, food: 2, sports: 2, hospitality: 2, fashion: 2, law: 2, marketing: 2, architecture: 2, cyber: 1, supplychain: 1, aviation: 1, entrepreneur: 2 } },
        ]
      },
    ]
  }
};

const MAX_SELECTIONS = 5;

function scoreAnswers(answers, tier) {
  const scores = {};
  ALL_INDUSTRIES.forEach(i => { scores[i.id] = 0; });

  answers.forEach(({ questionIdx, optionIdx }) => {
    const q = TIERS[tier].questions[questionIdx];
    const opt = q.opts[optionIdx];
    Object.entries(opt.weights).forEach(([industryId, weight]) => {
      if (scores[industryId] !== undefined) {
        scores[industryId] += weight;
      }
    });
  });

  return ALL_INDUSTRIES
    .map(i => ({ ...i, score: scores[i.id] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SELECTIONS)
    .map(i => i.id);
}

export default function OnboardingQuiz({ onComplete, isRetake = false }) {
  const [phase, setPhase] = useState('age'); // age | quiz | result
  const [tier, setTier] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [topIndustries, setTopIndustries] = useState([]);
  const [animKey, setAnimKey] = useState(0);

  function selectAge(t) {
    setTier(t);
    setPhase('quiz');
    // Start the quiz cleanly — matters when the user returns to the age screen
    // via "Back" and re-picks (tier changes the question set entirely).
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setAnimKey(k => k + 1);
  }

  function handleAnswer(optionIdx) {
    setSelected(optionIdx);
  }

  function handleBack() {
    // First question goes back to the age picker (the flow's first screen);
    // nothing has been committed yet, so just switch phases. The age button
    // for the current tier stays highlighted so the user can review it.
    if (currentQ === 0) {
      setSelected(null);
      setPhase('age');
      setAnimKey(k => k + 1);
      return;
    }
    // Otherwise step back to the previous question, drop its recorded answer,
    // and re-select it so the previous choice shows highlighted.
    const prevIdx = currentQ - 1;
    const prevAnswer = answers[prevIdx];
    setAnswers(answers.slice(0, prevIdx));
    setSelected(prevAnswer ? prevAnswer.optionIdx : null);
    setCurrentQ(prevIdx);
    setAnimKey(k => k + 1);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, { questionIdx: currentQ, optionIdx: selected }];
    setAnswers(newAnswers);
    setSelected(null);

    const questions = TIERS[tier].questions;
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setAnimKey(k => k + 1);
    } else {
      const top = scoreAnswers(newAnswers, tier);
      setTopIndustries(top);
      setPhase('result');
      setAnimKey(k => k + 1);
    }
  }

  const progress = tier ? ((currentQ) / TIERS[tier].questions.length) * 100 : 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: '#7F77DD', opacity: 0.1, filter: 'blur(80px)', top: -100, left: -80, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: '#D4537E', opacity: 0.08, filter: 'blur(80px)', bottom: -80, right: -60, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 2 }}>

        {/* AGE PICKER */}
        {phase === 'age' && (
          <div key="age" style={{ animation: 'fadeUp 0.5s ease forwards', textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.accentPurple, marginBottom: 14 }}>
              {isRetake ? 'Retake Quiz' : 'Quick question first'}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.text, lineHeight: 1.2, marginBottom: 10 }}>
              How old are you?
            </div>
            <div style={{ fontSize: 14, color: T.textMid, marginBottom: 32 }}>
              We'll tailor the questions to actually make sense for you.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { tier: 1, label: '15 & under' },
                { tier: 2, label: '16 – 18' },
                { tier: 3, label: '19+' },
              ].map(({ tier: t, label }) => (
                <button
                  key={t}
                  onClick={() => selectAge(t)}
                  style={{
                    width: '100%', padding: '16px',
                    background: tier === t ? `${T.accentPurple}18` : T.bgCard,
                    border: `1px solid ${tier === t ? T.accentPurple : T.border}`, borderRadius: 14,
                    color: T.text, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentPurple; e.currentTarget.style.background = T.bgDeep; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = tier === t ? T.accentPurple : T.border; e.currentTarget.style.background = tier === t ? `${T.accentPurple}18` : T.bgCard; }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === 'quiz' && tier && (
          <div key={`quiz-${animKey}`} style={{ animation: 'fadeUp 0.4s ease forwards' }}>
            {/* Progress */}
            <div style={{ height: 3, background: T.bgCard, borderRadius: 2, marginBottom: 24 }}>
              <div style={{ height: 3, width: `${progress}%`, background: `linear-gradient(90deg, ${T.accentPurple}, ${T.accent1})`, borderRadius: 2, transition: 'width 0.4s ease' }} />
            </div>

            <div style={{ fontSize: 10, color: T.textDim, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
              Question {currentQ + 1} of {TIERS[tier].questions.length}
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, lineHeight: 1.3, marginBottom: 6 }}>
              {TIERS[tier].questions[currentQ].q}
            </div>
            <div style={{ fontSize: 13, color: T.textDim, fontStyle: 'italic', marginBottom: 20 }}>
              {TIERS[tier].questions[currentQ].flavor}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {TIERS[tier].questions[currentQ].opts.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => handleAnswer(i)}
                  style={{
                    padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                    border: selected === i ? `2px solid ${T.accentPurple}` : `1px solid ${T.border}`,
                    background: selected === i ? `${T.accentPurple}18` : T.bgCard,
                    transition: 'all 0.15s',
                    boxShadow: selected === i ? `0 0 16px ${T.accentPurple}22` : 'none',
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: selected === i ? T.accentPurple : T.text, marginBottom: 3 }}>
                    {opt.text}
                  </div>
                  <div style={{ fontSize: 12, color: T.textDim }}>
                    {opt.sub}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selected === null}
              style={{
                width: '100%', padding: '14px',
                background: selected !== null ? `linear-gradient(135deg, ${T.accentPurple}, ${T.accent2})` : T.bgCard,
                border: 'none', borderRadius: 12, color: T.white,
                fontSize: 15, fontWeight: 700,
                cursor: selected !== null ? 'pointer' : 'not-allowed',
                opacity: selected !== null ? 1 : 0.4,
                transition: 'all 0.2s',
              }}
            >
              {currentQ + 1 === TIERS[tier].questions.length ? 'See my results ✦' : 'Next →'}
            </button>

            {/* Back — returns to the previous question (or the age screen from
                the first question) with the earlier answer still highlighted. */}
            <button
              onClick={handleBack}
              style={{
                width: '100%', padding: '10px', marginTop: 10,
                background: 'transparent', border: 'none',
                color: T.textMid, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && (
          <div key="result" style={{ animation: 'fadeUp 0.5s ease forwards', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>✦</div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.accentPurple, marginBottom: 12 }}>
              Here's what we found
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: T.text, lineHeight: 1.2, marginBottom: 8 }}>
              Your top worlds
            </div>
            <div style={{ fontSize: 14, color: T.textMid, marginBottom: 28, lineHeight: 1.6 }}>
              Based on your answers we pre-selected these for you. You can always change them on your profile.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32, textAlign: 'left' }}>
              {topIndustries.map((id, i) => {
                const ind = ALL_INDUSTRIES.find(x => x.id === id);
                if (!ind) return null;
                return (
                  <div
                    key={id}
                    style={{
                      padding: '12px 16px', borderRadius: 12,
                      border: `1px solid ${ind.color}44`,
                      background: `${ind.color}12`,
                      display: 'flex', alignItems: 'center', gap: 12,
                      animation: `popIn 0.4s ease ${i * 0.08}s both`,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: ind.color, flexShrink: 0 }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: ind.color }}>{ind.name}</div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onComplete(topIndustries)}
              style={{
                width: '100%', padding: '14px',
                background: `linear-gradient(135deg, ${T.accentPurple}, ${T.accent2})`,
                border: 'none', borderRadius: 12, color: T.white,
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
                marginBottom: 10,
              }}
            >
              Set up my profile →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
