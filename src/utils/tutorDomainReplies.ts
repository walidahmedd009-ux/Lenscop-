export function getDomainAwareTutorReply(
  courseTitle: string = '',
  lessonTitle: string = '',
  question: string = ''
): string {
  const q = question.toLowerCase();
  const context = (courseTitle + ' ' + lessonTitle).toLowerCase();

  // Coding & Software Engineering
  if (
    context.includes('python') ||
    context.includes('code') ||
    context.includes('javascript') ||
    context.includes('programm') ||
    context.includes('web dev') ||
    context.includes('react') ||
    context.includes('software')
  ) {
    return `### What It Is & The Meaning
Coding is writing exact, logical instructions that computers execute to process data and solve problems. Its meaning is translating human logic into structured syntax that automates tasks and builds interactive digital systems.

### The Guidelines
- Guideline 1: Write pseudocode in plain English before writing any syntax. If you can explain the step-by-step logic in human words, translating it to code takes only seconds.
- Guideline 2: Read error messages from the bottom line up. Errors are GPS recalculations showing the exact line where execution broke, usually because of an unexpected variable type or typo.
- Guideline 3: Test small pieces immediately. Never write 50 lines without running and verifying each 5-line chunk.`;
  }

  // Music & Guitar
  if (
    context.includes('guitar') ||
    context.includes('piano') ||
    context.includes('music') ||
    context.includes('violin') ||
    context.includes('drums') ||
    context.includes('chord')
  ) {
    return `### What It Is & The Meaning
Music and instrument playing is the physical craft of turning mechanical vibrations into structured melody, harmony, and rhythm. Its meaning is developing neuromuscular coordination so your fingers instantly land on specific geometry without conscious hesitation.

### The Guidelines
- Guideline 1: Land all fingers simultaneously as a single claw, rather than placing one finger at a time.
- Guideline 2: Place fingertips directly behind the metal fret wire to produce clear tone with 70% less finger pressure.
- Guideline 3: Keep your rhythm hand moving constantly. Even if your fretting hand misses a transition, keeping the groove trains your brain to catch up.`;
  }

  // Personal Finance & Investing
  if (
    context.includes('finance') ||
    context.includes('invest') ||
    context.includes('money') ||
    context.includes('budget')
  ) {
    return `### What It Is & The Meaning
Personal finance is the management of your capital, savings, and investments. Its meaning is putting surplus money into compounding productive assets so that your money generates returns over time, rather than solely trading your personal hours for an income.

### The Guidelines
- Guideline 1: Pay yourself first. Automatically route 15-20% into an investment account on payday before discretionary spending.
- Guideline 2: Respect the Rule of 72. Divide 72 by your annual return to know when your money doubles. At an 8% return, capital doubles every 9 years.
- Guideline 3: Minimize fees. High 1-2% management fees erode up to a third of your lifetime compounding wealth. Choose low-cost broad index funds.`;
  }

  // Photography & Visuals
  if (
    context.includes('photo') ||
    context.includes('camera') ||
    context.includes('draw') ||
    context.includes('art')
  ) {
    return `### What It Is & The Meaning
Photography literally means drawing with light. It is the craft of capturing three-dimensional visual reality onto a two-dimensional frame through deliberate exposure, light direction, and composition.

### The Guidelines
- Guideline 1: Prioritize light source over gear. Large soft light (like a daytime window) always produces better images than harsh ceiling bulbs.
- Guideline 2: Simplify the background. Before taking a picture, scan the edges of your frame and remove visual clutter.
- Guideline 3: Tap to lock focus and exposure on your primary subject before composing your shot.`;
  }

  // Public Speaking & Communication
  if (
    context.includes('public speaking') ||
    context.includes('speech') ||
    context.includes('presentation') ||
    context.includes('speaking') ||
    context.includes('pitch')
  ) {
    return `### What It Is & The Meaning
Public speaking is the art of delivering a focused message to an audience to inform, inspire, or persuade. Its meaning is serving the listener by transferring a single valuable perspective from your mind into theirs.

### The Guidelines
- Guideline 1: Pass the Billboard Test. Identify the single 10-word sentence you want your audience to remember tomorrow. Everything in your presentation must support that sentence.
- Guideline 2: Replace filler words with silent pauses. Inhale gently through your nose for 2 seconds. The audience hears silence as confidence and poise.
- Guideline 3: Talk to one person at a time. Deliver a full thought to one pair of eyes before shifting your gaze.`;
  }

  // Chess & Strategy
  if (context.includes('chess') || context.includes('strategy') || context.includes('tactics')) {
    return `### What It Is & The Meaning
Chess is a deterministic game of calculation, positional strategy, and tactical foresight. Its meaning is anticipating your opponent's intentions and controlling key central territory with coordinated pieces.

### The Guidelines
- Guideline 1: Look for Loose Pieces. 90% of tactical combinations succeed because a piece had no defender.
- Guideline 2: Run the CCT Scan before every move: Checks, Captures, and Threats.
- Guideline 3: Ask what your opponent's last move threatens and what square they left unprotected.`;
  }

  // Generic domain response (Authentic definition + clear guidelines)
  const skillName = (lessonTitle || courseTitle || 'this discipline').replace(/:.*/, '').trim();
  return `### What It Is & The Meaning
${skillName} is a focused discipline of practical knowledge and execution. Its meaning is understanding the core variables and mechanics that govern outcomes, allowing you to achieve consistent, high-quality results without guesswork.

### The Guidelines
- Guideline 1: Identify the primary variable. When starting or troubleshooting, isolate the single input that controls the majority of results.
- Guideline 2: The 50% Speed Rule. Slow down your practice by half to build clean form and accurate neural pathways before attempting speed.
- Guideline 3: Establish an immediate feedback loop. Compare each repetition against a clear standard right away so you calibrate accurately.`;
}
