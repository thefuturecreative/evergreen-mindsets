/**
 * Central data source for the five Evergreen creativity mindsets.
 * Every color, label, descriptor, tagline, and teacher-facing guidance
 * string used throughout the app and the exported publication pages is
 * read from this object — nothing about a mindset should be hard-coded
 * or duplicated anywhere else.
 */
const MINDSETS = {
  imaginative: {
    id: "imaginative",
    name: "Imaginative",
    color: "#FFC166",
    textColor: "#172C2E",
    descriptor: "Wonder • Connect • Invent",
    tagline: "Creative learners play with possibilities and explore “what if?”",
    guidance:
      "Consider: How did students play with possibilities, make connections, use intuition, or explore “what if?”",
  },
  inquisitive: {
    id: "inquisitive",
    name: "Inquisitive",
    color: "#00555C",
    textColor: "#FFFFFF",
    descriptor: "Question • Investigate • Challenge",
    tagline: "Creative learners wonder, investigate, and ask why.",
    guidance:
      "Consider: How did students wonder, question, investigate, explore, or challenge assumptions?",
  },
  persistent: {
    id: "persistent",
    name: "Persistent",
    color: "#AAB132",
    textColor: "#172C2E",
    descriptor: "Try • Adapt • Keep Going",
    tagline:
      "Creative learners stick with challenges, take risks, and learn from mistakes.",
    guidance:
      "Consider: How did students tolerate uncertainty, stick with difficulty, take risks, revise, or learn from mistakes?",
  },
  collaborative: {
    id: "collaborative",
    name: "Collaborative",
    color: "#0E7178",
    textColor: "#FFFFFF",
    descriptor: "Listen • Build • Share",
    tagline: "Creative learners know that great ideas grow stronger together.",
    guidance:
      "Consider: How did students cooperate, build on ideas, share responsibility, or give and receive feedback?",
  },
  disciplined: {
    id: "disciplined",
    name: "Disciplined",
    color: "#FA9F4D",
    textColor: "#172C2E",
    descriptor: "Craft • Reflect • Improve",
    tagline: "Creative learners refine, revise, and reflect.",
    guidance:
      "Consider: How did students develop techniques, reflect critically, refine ideas, or improve their work?",
  },
};

// Display order used everywhere the five mindsets are listed as choices.
const MINDSET_ORDER = [
  "imaginative",
  "inquisitive",
  "persistent",
  "collaborative",
  "disciplined",
];
