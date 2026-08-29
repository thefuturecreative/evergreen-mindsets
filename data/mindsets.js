/**
 * Evergreen Creativity Mindsets — content data
 *
 * This file is the single source of truth for all mindset content.
 * Edit the text here to update what appears on the site — the interface
 * in js/app.js builds itself from this data, so no HTML edits are needed
 * to change copy, add examples, or reorder practices.
 *
 * Each practice example is an object ({ text: "..." }) rather than a
 * plain string so that future metadata (gradeLevel, subject, duration,
 * grouping, materials, teacherSubmitted, etc.) can be attached to
 * individual examples later without changing the data shape.
 */

const MINDSETS = [
  {
    id: "imaginative",
    name: "Imaginative",
    tagline: "Creative learners play with possibilities and explore “what if?”",
    keywords: ["Wonder", "Connect", "Invent"],
    icon: "spark",
    quote: "Imagination is intelligence at play.",
    introduction:
      "Imaginative thinking asks students to wonder, invent, and connect. When students make space for the unexpected — whether through sketching unusual ideas, finishing half-drawn stories, or asking playful questions — they learn that creativity grows through curiosity and exploration.",
    whatItLooksLike: [
      "Students generate multiple ideas and explore “what if” scenarios.",
      "Learning experiences invite curiosity, play, and speculation.",
      "Teachers use open-ended prompts, visuals, and materials that provoke wonder.",
      "Mistakes and tangents are treated as fuel for creativity."
    ],
    practices: [
      {
        title: "Playing with Possibilities",
        description: "",
        examples: [
          "Think Outside the Box Thursdays",
          "Finish the Drawing / Finish the Story",
          "“What if…” Questions",
          "Yes, and…",
          "Worst Idea Generation",
          "Evolving Constraints",
          "Improv-style Thinking"
        ],
        purpose: "Normalize exploration and humor as tools for innovation."
      },
      {
        title: "Visual Thinking and Mapping Ideas",
        description: "",
        examples: [
          "Mind Maps",
          "Spider Webs",
          "Concentric Circles",
          "Rotating Group Mind Maps",
          "Sketchnotes",
          "I’m a Tree Activity",
          "Wonder Wall",
          "Character Motivation Mapping",
          "Mind Maps for Vocabulary"
        ],
        purpose: "Support imagination through visualization, organization, and connection-making."
      },
      {
        title: "Open-Ended Materials and Provocations",
        description: "",
        examples: [
          "Loose Parts Play",
          "Provocation Displays",
          "Design Thinking Projects",
          "Mathematical Manipulatives",
          "Evolving Constraints",
          "Creating Maps of New Places"
        ],
        purpose: "Let imagination emerge from tactile exploration and authentic curiosity."
      },
      {
        title: "Brainstorming, Tangents, and “Rabbit Holes”",
        description: "",
        examples: [
          "Group Brainstorms",
          "Stream-of-Consciousness Brain Dumps",
          "Going Down Rabbit Holes",
          "Service Learning Brainstorms",
          "Padlet, Canva, or Visual Tools"
        ],
        purpose: "Encourage fluency of ideas — quantity before quality."
      },
      {
        title: "Storytelling and Creative Connection",
        description: "",
        examples: [
          "Storytelling in Math",
          "Reading “Big, Wild, Improbable Ideas”",
          "Character Motivation Exploration",
          "Connecting Books and Stories",
          "Imaginative Writing Prompts"
        ],
        purpose: "Use storytelling to humanize abstract ideas and exercise creative empathy."
      },
      {
        title: "Making Connections and Using Intuition",
        description: "",
        examples: [
          "Brainstorm Multiple Solutions",
          "Connecting Tangents to Core Ideas",
          "Mathematical Exploration Challenges",
          "Vocabulary Connection Activities",
          "Respect and Encourage Intuitive Leaps"
        ],
        purpose: "Value intuition and connection-making as signs of creative insight."
      }
    ],
    teacherMoves: [
      "Model curiosity by asking playful “What if…?” questions.",
      "Allow time for idea fluency before refinement or judgment.",
      "Use visuals, metaphors, and sensory cues to spark imagination.",
      "Honor tangents; they can become gateways to deeper understanding.",
      "Frame constraints as opportunities for invention.",
      "Encourage joy, wonder, and a touch of silliness in creative work."
    ]
  },
  {
    id: "inquisitive",
    name: "Inquisitive",
    tagline: "Creative learners wonder, investigate, and ask why.",
    keywords: ["Question", "Investigate", "Challenge"],
    icon: "compass",
    quote: "Curiosity is the compass of creativity.",
    introduction:
      "Inquisitive thinking begins with curiosity — a desire to understand how things work and why they are the way they are. Students explore, question, investigate, and challenge assumptions to uncover new perspectives.",
    whatItLooksLike: [
      "Students ask deep, open-ended questions.",
      "Teachers model curiosity and encourage “why” and “what if” questions.",
      "Classrooms embrace uncertainty and exploration.",
      "Investigations begin with noticing, wondering, and pattern-seeking."
    ],
    practices: [
      {
        title: "Wonder as a Starting Point",
        description: "",
        examples: [
          "What Do You Notice? What Do You Wonder?",
          "Wonder Charts / Wonder Walls",
          "KWL Charts",
          "Introducing a Unit with a Mystery",
          "Phenomenon First",
          "Prediction Prompts"
        ],
        purpose: "Make wonder visible and central to learning."
      },
      {
        title: "Question-Based Routines",
        description: "",
        examples: [
          "Here’s the Answer, What’s the Question?",
          "Visual Thinking Strategies",
          "See–Think–Wonder",
          "Picture Analysis: See / Assume / Wonder",
          "A Question Is the Answer",
          "Post-it Matching",
          "“Is This Always True?”"
        ],
        purpose: "Develop curiosity with depth and precision."
      },
      {
        title: "Investigating and Proving Thinking",
        description: "",
        examples: [
          "Math Inquiries",
          "Checking the Teacher Edition",
          "Disagree and Prove It",
          "Backwards Problem Solving",
          "Engineering Design Inquiry",
          "“How Did I Get There?”"
        ],
        purpose: "Position students as investigators who construct, test, and refine understanding."
      },
      {
        title: "Challenging Assumptions and Exploring Perspectives",
        description: "",
        examples: [
          "Perspective-Taking",
          "Comparing Cultures Through Images",
          "Gender and Identity Inquiry",
          "Philosophical Questions",
          "Inquiry-Based Discussion in Literature",
          "Cognitive Dissonance"
        ],
        purpose: "Encourage intellectual humility and curiosity about complexity."
      },
      {
        title: "Playful and Digital Inquiry",
        description: "",
        examples: [
          "Wikipedia Surfing",
          "Materials Exploration",
          "Math and Logic Challenges",
          "Post-it Question Swaps",
          "Inquiry Scavenger Hunts"
        ],
        purpose: "Connect curiosity with play and discovery."
      },
      {
        title: "Modeling and Sustaining Curiosity",
        description: "",
        examples: [
          "Model Your Own Inquisitive Process",
          "Ask Students to Predict Questions",
          "Always Ask “Why?” or “What Makes You Say That?”",
          "Encourage “I See” Statements",
          "End with Unanswered Questions",
          "Science Symposiums and Open Forums"
        ],
        purpose: "Model lifelong learning — curiosity as a practice rather than a phase."
      }
    ],
    teacherMoves: [
      "Model your own curiosity.",
      "Ask open questions.",
      "Encourage observation before interpretation.",
      "Allow unanswered questions to remain open.",
      "Invite students to investigate rather than immediately providing answers.",
      "Encourage students to challenge assumptions respectfully."
    ]
  },
  {
    id: "persistent",
    name: "Persistent",
    tagline: "Creative learners stick with challenges, take risks, and learn from mistakes.",
    keywords: ["Try", "Adapt", "Keep Going"],
    icon: "mountain",
    quote: "We can do hard things.",
    introduction:
      "Persistence means daring to stay in the struggle — revising, adapting, and continuing when things become difficult or uncertain. Students discover that persistence is not about perfection; it is about patience, resilience, reflection, and believing in their capacity to grow.",
    whatItLooksLike: [
      "Students view mistakes as learning opportunities.",
      "Teachers model their own persistence and thinking aloud.",
      "Activities include productive struggle and revision cycles.",
      "Classrooms emphasize growth, reflection, and courage in uncertainty."
    ],
    practices: [
      {
        title: "Growth Mindset and “The Power of Yet”",
        description: "",
        examples: [
          "Growth Mindset Language",
          "The Magical Yet",
          "Fantastic Elastic Brain",
          "Class Mottos",
          "Visual Reminders",
          "Praise for Effort, Not Perfection"
        ],
        purpose: "Build emotional resilience and normalize challenge as part of the creative process."
      },
      {
        title: "Learning Through Mistakes",
        description: "",
        examples: [
          "“My Favorite Oops” Routine",
          "Modeling Mistakes",
          "Show Work-in-Progress",
          "Celebrate Failure",
          "Art & Pottery Challenges",
          "Bridge Building Projects"
        ],
        purpose: "De-stigmatize mistakes and build comfort with iterative thinking."
      },
      {
        title: "Revision, Reflection, and Iteration",
        description: "",
        examples: [
          "Revision Cycles",
          "Iteration Checkpoints",
          "Revising for a Specific Goal",
          "Documenting Growth",
          "Pumpkin Stopper Redesigns",
          "Persistent Praise for Trying Again"
        ],
        purpose: "Make persistence visible through cycles of effort and reflection."
      },
      {
        title: "Embracing Uncertainty and Challenge",
        description: "",
        examples: [
          "Open-Ended Problems",
          "Debates on the Opposite Side",
          "Waiting Before Asking for Help",
          "Coding Projects",
          "End on a Cliffhanger",
          "Complex BIG Lab Projects",
          "Pomodoro Method"
        ],
        purpose: "Teach endurance and calm during uncertainty or frustration."
      },
      {
        title: "Encouraging Self-Regulation and Flexible Thinking",
        description: "",
        examples: [
          "Calming and Encouragement Techniques",
          "Teaching “Size of the Problem”",
          "Flexible Thinking Exercises",
          "Solutions Tool Belt",
          "Executive Functioning Heroes",
          "Iteration in Pottery or Art"
        ],
        purpose: "Equip students with self-awareness and adaptability for sustained effort."
      },
      {
        title: "Modeling and Meta-Learning",
        description: "",
        examples: [
          "Think-Aloud Modeling",
          "Use Natural Moments to Demonstrate Perseverance",
          "Encourage Disagreement and Diverse Perspectives",
          "Growth Stories",
          "“Lifelong Learner” Modeling"
        ],
        purpose: "Normalize persistence as a shared, ongoing habit of mind."
      }
    ],
    teacherMoves: [
      "Model curiosity, patience, and self-compassion during challenges.",
      "Provide time and structure for iteration.",
      "Frame feedback around effort, revision, and next steps.",
      "Celebrate perseverance through classroom rituals and reflections.",
      "Teach that persistence is adaptive and reflective, not simply endurance."
    ]
  },
  {
    id: "collaborative",
    name: "Collaborative",
    tagline: "Creative learners know that great ideas grow stronger together.",
    keywords: ["Listen", "Build", "Share"],
    icon: "people",
    quote: "Collaboration is where creativity becomes community.",
    introduction:
      "When students collaborate, they listen closely, build on others’ ideas, and make space for every voice. Collaboration in creative learning isn’t simply about dividing tasks — it is about co-creating understanding. Through structured dialogue, shared responsibility, and thoughtful feedback, students discover that collective thinking can lead to deeper insight and more imaginative outcomes.",
    whatItLooksLike: [
      "Students exchange and build on one another’s ideas during structured conversations.",
      "Groups take on distinct roles that promote equity, voice, and shared responsibility.",
      "Feedback routines emphasize listening, reflection, and kindness.",
      "Peers serve as coaches, questioners, and creative partners."
    ],
    practices: [
      {
        title: "Structured Peer Interaction",
        description: "Predictable formats give all students a way to engage and be heard.",
        examples: [
          "Think–Pair–Share",
          "Turn & Talk",
          "Pair and Share",
          "Dialogue Circles",
          "Round Robin Repeating",
          "Talking Object",
          "Written Conversations",
          "Late Night Book Talk"
        ],
        purpose: ""
      },
      {
        title: "Assigned Roles and Shared Responsibility",
        description: "Clarity of roles builds equity and accountability.",
        examples: [
          "Team Roles",
          "One Marker, Two Minds / Two Brains, One Marker",
          "Collaborative Drawing",
          "Job Roles in Projects",
          "Wipebooks for Small-Group Thinking"
        ],
        purpose: ""
      },
      {
        title: "Peer Feedback and Reflection",
        description: "",
        examples: [
          "Warm, Cool, Question",
          "Peer Editing with Rubrics",
          "Art Critiques with Guided Prompts",
          "Gallery Walks",
          "Google Presentation Feedback Forms"
        ],
        purpose: ""
      },
      {
        title: "Shared Inquiry and Problem Solving",
        description: "",
        examples: [
          "Brainstorming Around Materials or Solutions",
          "Collaborative Math Talk",
          "Team Challenges",
          "Improv Games such as “Yes, and…” and One-Word Story",
          "Gallery Walk of Mathematical Work"
        ],
        purpose: ""
      },
      {
        title: "Helping Each Other Learn",
        description: "",
        examples: [
          "Get It, Got It, Give It",
          "Ask a Friend, Help a Friend",
          "Tech Tip Helpers",
          "“When Stuck, Ask a Question” Routine",
          "Walk for Inspiration"
        ],
        purpose: ""
      },
      {
        title: "Communication Skills and Kindness",
        description: "",
        examples: [
          "“Before You Speak, Think” Protocol",
          "Sentence Discussion Stems",
          "Repeating and Adding On",
          "Share and Shift Perspectives",
          "Patience as Practice"
        ],
        purpose: ""
      }
    ],
    teacherMoves: [
      "Establish norms of respect, listening, and inclusion early and reinforce them often.",
      "Use visible tools such as sentence stems, feedback prompts, and role charts.",
      "Model thinking aloud and productive disagreement.",
      "Reflect with students on how they collaborated, not just what they produced.",
      "Celebrate creative interdependence: “We got there together.”"
    ]
  },
  {
    id: "disciplined",
    name: "Disciplined",
    tagline: "Creative learners refine, revise, and reflect.",
    keywords: ["Craft", "Reflect", "Improve"],
    icon: "pencil",
    quote: "When you think you’re done, you’ve just begun.",
    introduction:
      "Discipline in creative thinking means developing skill and craftsmanship over time — knowing when to take risks and when to slow down for reflection and refinement. It is the steady practice of transforming ideas through iteration, feedback, precision, and care.",
    whatItLooksLike: [
      "Students approach creativity as a process of continual refinement.",
      "Feedback, revision, and reflection are embedded in learning.",
      "Teachers make craftsmanship, precision, and clarity visible.",
      "Students see their work as prototypes capable of improvement."
    ],
    practices: [
      {
        title: "Drafting, Revising, and Refining",
        description: "",
        examples: [
          "Re-draft and Edit",
          "“Roll the Dice” Revision Process",
          "Prototype Modeling",
          "Printmaking for Social Justice",
          "Engineering & BIG Lab Design Process",
          "Treat Work as a Prototype",
          "Revisiting Work Beyond Writing"
        ],
        purpose: "Help students understand that craftsmanship grows through continual revision."
      },
      {
        title: "Reflection and Self-Assessment",
        description: "",
        examples: [
          "Self-Assessment Rubrics",
          "Analyze Exemplars",
          "“Are You Really Done?” Poster",
          "End-of-Semester Reading Log Review",
          "Reflection Journals",
          "Success Criteria Checklists",
          "Revisit Feedback"
        ],
        purpose: "Develop independent learners who can evaluate and improve their own work."
      },
      {
        title: "Precision, Craft, and Technical Mastery",
        description: "",
        examples: [
          "Modeling Craftsmanship",
          "Choosing the Right Tool for the Job",
          "Mathematical Explanation and Defense",
          "Evaluate the Mistake",
          "Fair Test Science Challenges",
          "Group Science Projects",
          "Public Presentations"
        ],
        purpose: "Teach that mastery is thoughtful, practiced, and purposeful."
      },
      {
        title: "Scaffolding and Step-by-Step Learning",
        description: "",
        examples: [
          "Bite-Sized Steps",
          "Iteration as Routine",
          "Encouragement and Materials Adjustments",
          "Broad-to-Narrow Brainstorming",
          "Multiple Task Attempts",
          "Co-create Rubrics and Success Criteria",
          "Time-Bound Work Blocks"
        ],
        purpose: "Balance creativity with structure while developing independence."
      },
      {
        title: "Reflection Through Feedback and Collaboration",
        description: "",
        examples: [
          "Peer Review & Editing",
          "Group Strategy Sharing",
          "Collaborative Rubric Design",
          "Math Reflection Prompts",
          "Partner Check-Ins",
          "Feedback Stories"
        ],
        purpose: "Create a culture where critique is kind, specific, and essential to mastery."
      },
      {
        title: "Iteration and Reflection Beyond the Classroom",
        description: "",
        examples: [
          "Public Showcases or Panels",
          "Documentation of Learning",
          "Reflections on Predictions vs. Outcomes",
          "STEM Challenges and Prototyping",
          "Revisiting Ideas Over Time"
        ],
        purpose: "Build professionalism, precision, and reflective pride in craftsmanship."
      }
    ],
    teacherMoves: [
      "Model revision openly.",
      "Embed reflection and self-assessment into project cycles.",
      "Use rubrics, checklists, and visible tools to scaffold independence.",
      "Celebrate craftsmanship and improvement more than speed.",
      "Encourage curiosity about how improvement happens."
    ]
  }
];

// Support both browser <script> usage (global MINDSETS) and potential
// future module usage (e.g. a build step or Node-based tooling).
if (typeof module !== "undefined" && module.exports) {
  module.exports = MINDSETS;
}
