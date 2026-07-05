import type { Swap, PowerWord } from "@/lib/types";

export const swaps: Swap[] = [
  {
    id: "sw-think-maybe",
    weak: "I think maybe we could...",
    strong: "I'm confident we can...",
    note: "Drop hedging; sound decisive.",
  },
  {
    id: "sw-just-wanted",
    weak: "I just wanted to ask...",
    strong: "I'd like to ask...",
    note: "'Just' shrinks your ask.",
  },
  {
    id: "sw-sorry-to-bother",
    weak: "Sorry to bother you...",
    strong: "Thanks for your time — quick one:",
    note: "Lead with respect, not apology.",
  },
  {
    id: "sw-kind-of",
    weak: "It's kind of important",
    strong: "It's important",
    note: "Cut softeners that weaken you.",
  },
  {
    id: "sw-i-guess",
    weak: "I guess we're doing well",
    strong: "We're doing well",
    note: "'I guess' undercuts your own statement.",
  },
  {
    id: "sw-does-that-make-sense",
    weak: "Does that make sense? Sorry if it's confusing.",
    strong: "Let me know if you'd like me to go deeper on any part.",
    note: "Invite questions without apologizing for explaining.",
  },
  {
    id: "sw-not-sure-but",
    weak: "I'm not sure, but maybe we should try...",
    strong: "I'd suggest we try...",
    note: "State the suggestion directly.",
  },
  {
    id: "sw-cant-promise",
    weak: "I can't promise, but I'll try to...",
    strong: "I'll get this to you by [date].",
    note: "Commit to something concrete instead of hedging.",
  },
  {
    id: "sw-basically",
    weak: "So, basically, what we do is...",
    strong: "Here's what we do:",
    note: "Filler words dilute your point.",
  },
  {
    id: "sw-little-bit",
    weak: "We're a little bit behind schedule",
    strong: "We're behind schedule by [timeframe]",
    note: "Replace vague minimizers with a real number.",
  },
  {
    id: "sw-hopefully",
    weak: "Hopefully this will work",
    strong: "This is designed to work because [reason]",
    note: "Back the claim with reasoning, not hope.",
  },
  {
    id: "sw-i-feel-like",
    weak: "I feel like we should change this",
    strong: "I think we should change this",
    note: "'Think' reads as reasoned; 'feel like' reads as unsure.",
  },
  {
    id: "sw-does-that-work-for-you-question",
    weak: "Is it okay if maybe we push the deadline?",
    strong: "I'd like to push the deadline to [date]. Does that work for you?",
    note: "Ask directly, then check agreement — don't bury the ask in doubt.",
  },
  {
    id: "sw-cant-really",
    weak: "We can't really do that right now",
    strong: "We can do [alternative] instead — here's why",
    note: "Replace a flat no with an alternative.",
  },
  {
    id: "sw-i-might-be-wrong",
    weak: "I might be wrong, but I think the pricing is off",
    strong: "I want to flag that the pricing may be off — here's why",
    note: "Raise the concern with confidence, not a pre-apology.",
  },
];

export const powerWords: PowerWord[] = [
  { id: "pw-clear", word: "clear", meaning: "easy to understand", example: "Let me make this clear." },
  { id: "pw-confident", word: "confident", meaning: "sure about something", example: "I'm confident this will work." },
  { id: "pw-value", word: "value", meaning: "worth or usefulness", example: "Here's the value for you." },
  { id: "pw-simple", word: "simple", meaning: "not complicated", example: "We kept the process simple." },
  { id: "pw-direct", word: "direct", meaning: "straightforward, no detours", example: "Let me be direct about the timeline." },
  { id: "pw-focused", word: "focused", meaning: "concentrated on one thing", example: "We're staying focused on our top three customers." },
  { id: "pw-reliable", word: "reliable", meaning: "consistently good, can be trusted", example: "Our platform is reliable, even at scale." },
  { id: "pw-practical", word: "practical", meaning: "useful in real life, not just theory", example: "This is a practical solution to a real problem." },
  { id: "pw-committed", word: "committed", meaning: "fully dedicated to something", example: "I'm fully committed to making this work." },
  { id: "pw-results", word: "results", meaning: "the actual outcome achieved", example: "We measure ourselves by results, not effort." },
  { id: "pw-honest", word: "honest", meaning: "truthful, without spin", example: "I want to be honest about where we are." },
  { id: "pw-momentum", word: "momentum", meaning: "forward progress that's building", example: "We've got real momentum this quarter." },
  { id: "pw-proven", word: "proven", meaning: "shown to work through evidence", example: "This is a proven approach in our space." },
  { id: "pw-efficient", word: "efficient", meaning: "achieves more with less waste", example: "This makes the whole process more efficient." },
];
