import type { PhraseGroup } from "@/lib/types";

export const phraseGroups: PhraseGroup[] = [
  {
    id: "fn-agree",
    fn: "Agreeing",
    phrases: [
      "Absolutely.",
      "That makes sense to me.",
      "I'm on the same page.",
      "Couldn't agree more.",
      "That's exactly right.",
    ],
  },
  {
    id: "fn-disagree",
    fn: "Disagreeing",
    phrases: [
      "I see it differently.",
      "I'm not sure I agree.",
      "Can I offer another view?",
      "I'd push back a little on that.",
      "That's not quite how I'd frame it.",
    ],
  },
  {
    id: "fn-clarify",
    fn: "Clarifying",
    phrases: [
      "Just to make sure I understand — you mean [x]?",
      "Can you say more about that?",
      "When you say [x], what do you mean exactly?",
      "Let me repeat that back to make sure I've got it right.",
    ],
  },
  {
    id: "fn-buy-time",
    fn: "Buying time",
    phrases: [
      "Let me think about that for a second.",
      "Good question — give me a moment.",
      "Let me make sure I understand before I answer.",
      "That's worth pausing on. Let me think it through.",
    ],
  },
  {
    id: "fn-transition",
    fn: "Transitioning",
    phrases: [
      "Moving on to the next point —",
      "That brings me to —",
      "On a related note —",
      "Let's switch gears for a moment.",
    ],
  },
  {
    id: "fn-opinion",
    fn: "Giving an opinion",
    phrases: [
      "In my view, [x] is the right call.",
      "Personally, I'd lean toward [x].",
      "If you ask me, [x] makes the most sense.",
      "My take is [x].",
    ],
  },
  {
    id: "fn-soften",
    fn: "Politely softening",
    phrases: [
      "It might be worth considering [x].",
      "One thought — what if we tried [x]?",
      "I could be missing something, but [x]?",
      "Just a suggestion — [x].",
    ],
  },
  {
    id: "fn-summarize",
    fn: "Summarizing",
    phrases: [
      "So, to sum up —",
      "The main takeaway here is [x].",
      "In short, here's where we landed:",
      "Let me recap what we agreed on.",
    ],
  },
  {
    id: "fn-end-conversation",
    fn: "Ending a conversation",
    phrases: [
      "Great talking with you — let's follow up on [x].",
      "I'll let you go, but let's stay in touch.",
      "Thanks for your time today — I'll send a follow-up.",
      "This was really helpful, thank you.",
    ],
  },
];
