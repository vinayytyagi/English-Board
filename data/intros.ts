import type { Intro } from "@/lib/types";

export const intros: Intro[] = [
  {
    id: "intro-investor",
    context: "Investor",
    short:
      "I'm Vinay, founder of [Startup] — we help [target user] do [outcome] faster.",
    medium:
      "Hi, I'm Vinay, founder of [Startup]. We help [target user] [solve problem] without [old painful way]. We're early, but already [traction], and I'd love to walk you through where we're headed.",
    long:
      "Hi, I'm Vinay. I'm the founder of [Startup]. Before this, I [background]. We started [Startup] because [problem story] — and it was a problem I couldn't stop thinking about. Today we help [target user] [solve problem], and what makes us different is [wedge]. We're at [stage/traction] right now, and we're raising to [goal]. I'd love to share more and hear your thoughts.",
    tags: ["pitch", "fundraising"],
  },
  {
    id: "intro-customer",
    context: "Customer / Client",
    short: "Hi, I'm Vinay from [Startup] — we make [outcome] simple for [target user].",
    medium:
      "Hi, I'm Vinay, I lead [Startup]. We work with [type of customer] to help them [outcome]. I'd love to understand what you're working on today and see if we can help.",
    long:
      "Hi, I'm Vinay, founder at [Startup]. We help teams like yours [outcome] without [pain]. A quick example — [mini case] — that's the kind of result we aim for. I'd love to learn more about your setup, where the friction is today, and whether we're a good fit to help.",
    tags: ["sales"],
  },
  {
    id: "intro-networking",
    context: "Networking",
    short: "Hey, I'm Vinay — I'm building [Startup], we help [target user] with [problem].",
    medium:
      "Hey, I'm Vinay. I'm building [Startup] — we help [target user] [solve problem]. It's still early days, but it's going well. What about you, what are you working on?",
    long:
      "Hey, I'm Vinay, nice to meet you. I'm the founder of [Startup]. The short version is we help [target user] [solve problem], and I got into it because [personal reason]. Right now we're focused on [current priority]. I'd love to hear what brought you here and what you're working on.",
    tags: ["networking", "small-talk"],
  },
  {
    id: "intro-hiring",
    context: "Hiring a candidate",
    short: "I'm Vinay, founder of [Startup]. We're a small team building [product].",
    medium:
      "Hi, I'm Vinay, founder of [Startup]. We're a small team, and we're building [product] to help [target user] [outcome]. I'll walk you through the role, and I'd love to hear about your background too.",
    long:
      "Hi, I'm Vinay, I'm the founder here at [Startup]. We're a small, early team building [product] for [target user]. I started this because [problem story], and today we're at [stage/traction]. This role matters to us because [why role matters]. I want this to be a real conversation, so feel free to ask me anything about the company, the role, or where we're headed.",
    tags: ["hiring", "recruiting"],
  },
  {
    id: "intro-podcast",
    context: "Podcast / Panel",
    short: "I'm Vinay, founder of [Startup], where we help [target user] with [problem].",
    medium:
      "Thanks for having me. I'm Vinay, founder of [Startup]. We help [target user] [solve problem], and I've spent the last [time period] deep in this space.",
    long:
      "Thanks for having me, glad to be here. I'm Vinay, founder of [Startup]. In short, we help [target user] [solve problem] — and the reason I care about this so much is [personal reason]. Before starting [Startup], I [background], and that's really where this idea came from. I'm excited to talk through [topic] today.",
    tags: ["podcast", "public-speaking"],
  },
  {
    id: "intro-casual",
    context: "Casual \"what do you do?\"",
    short: "I run a small startup called [Startup] — we help [target user] with [problem].",
    medium:
      "I run a small startup called [Startup]. We help [target user] [solve problem] — kind of like [simple comparison], but for [use case].",
    long:
      "I run a small startup called [Startup]. The simple version is, we help [target user] [solve problem]. I started it after [personal reason], and it's been [how it's going] so far. Some days it's hard, but I really believe in it.",
    tags: ["casual", "small-talk"],
  },
];
