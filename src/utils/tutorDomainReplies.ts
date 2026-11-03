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
    if (q.includes('error') || q.includes('bug') || q.includes('debug')) {
      return `When you run into a bug or error in **${courseTitle || 'Coding'}**, remember this:\n\n1. **Errors are GPS recalculations, not failures:** The computer is simply telling you the exact line number where its expectations broke down (like looking for a variable named \`user\` when you typed \`usr\`).\n2. **Read the stack trace from the bottom up:** Look at the last line first—it specifies the exact error type and file location.\n3. **Print or inspect values right before the line:** 90% of bugs happen because a variable holds \`undefined\` or a different type than you expected.`;
    }
    if (q.includes('analogy') || q.includes('example') || q.includes('explain')) {
      return `Here is a clear mental model for **${lessonTitle || courseTitle}**:\n\nThink of code execution like an **automated factory assembly line**:\n- **Variables** are labeled bins holding specific parts.\n- **Functions** are specialized robotic arms that take parts from one bin, weld or assemble them, and place the finished component in the next bin.\n- **Conditionals (if/else)** are sensor gates that route defective items to a rework bin and approved items to shipping.\n\nWhen writing code, always trace: What enters the machine? How is it transformed? Where is it output?`;
    }
    return `That is a fundamental question about **${lessonTitle || courseTitle}**!\n\nIn programming, the golden habit is writing **pseudocode** before touching syntax. Write your logic in plain English sentences first:\n- "1. Check if user input is valid."\n- "2. If valid, update the count in memory."\n- "3. Display the updated count."\n\nOnce your logical steps are clear in your own words, translating each line into syntax takes only seconds.`;
  }

  // Music & Instruments
  if (
    context.includes('guitar') ||
    context.includes('piano') ||
    context.includes('music') ||
    context.includes('violin') ||
    context.includes('drums') ||
    context.includes('chord')
  ) {
    if (q.includes('switch') || q.includes('transition') || q.includes('chord') || q.includes('finger')) {
      return `To eliminate the pause between chords or notes in **${courseTitle || 'Music'}**:\n\n1. **Use the 60-Second Transition Drill:** Pick the two chords you find trickiest. Set a 1-minute timer and switch back and forth continuously without stopping.\n2. **Move fingers as a single claw:** Don't place finger 1, then finger 2, then finger 3. Visualize the entire shape in the air and land all fingers simultaneously.\n3. **Keep your rhythm hand moving:** Even if your fretting hand misses slightly, keep the beat! Your ear and brain will force your fingers to catch up with the groove.`;
    }
    return `In **${lessonTitle || courseTitle}**, remember that clean tone comes from **geometry and leverage**, not muscle strain:\n\n- On guitar/strings: Place your fingertips directly behind the metal fret wire (not far back in the fret). This eliminates buzzing with 70% less finger pressure.\n- On piano: Keep wrists relaxed and level with the keys, playing with naturally curved fingers using arm weight rather than finger tension.\n\nRelax your shoulders and breathe out when playing difficult passages!`;
  }

  // Public Speaking & Communication
  if (
    context.includes('public speaking') ||
    context.includes('speech') ||
    context.includes('presentation') ||
    context.includes('speaking') ||
    context.includes('pitch')
  ) {
    if (q.includes('nervous') || q.includes('anxiety') || q.includes('fear') || q.includes('um')) {
      return `Speaking anxiety is completely normal—it is just adrenaline. Here is how top speakers channel it:\n\n1. **The Power Pause:** Replace filler words ("um", "like", "you know") with silence. Close your mouth, inhale gently through your nose for 2 seconds, and look at one person. The audience interprets silence as poise and mastery.\n2. **The 3-Second Rule:** Focus on giving one complete sentence to one person in the audience before shifting your eyes to another section.\n3. **Reframe nervousness as excitement:** Tell yourself: *"My heart is beating fast because I have an important idea to share with these people."*`;
    }
    return `In **${lessonTitle || courseTitle}**, remember the **One Throughline Rule**:\n\nAudiences cannot remember 15 different slides or points. Before you speak, pass the Billboard Test: write down the single 10-word sentence you want your listeners to repeat tomorrow. Every story, chart, and example in your talk must serve that one sentence!`;
  }

  // Chess & Strategy
  if (context.includes('chess') || context.includes('strategy') || context.includes('tactics')) {
    return `In **${lessonTitle || courseTitle}**, the key to tactical vision is **Loose Pieces (LPDO - Loose Pieces Drop Off)**:\n\nWhenever you or your opponent have an undefended piece on the board, a tactical alarm should trigger. 90% of tactics (forks, pins, skewers) succeed because a piece lacked defenders.\n\nBefore every move, execute the **CCT Scan**: Checks, Captures, Threats. Ask yourself: *"What does my opponent threaten with their last move, and what undefended square did they leave behind?"*`;
  }

  // Finance & Investing
  if (context.includes('finance') || context.includes('invest') || context.includes('money') || context.includes('budget')) {
    return `In **${lessonTitle || courseTitle}**, the mathematical reality is that **consistency and low fees beat speculative guessing**:\n\n- The Rule of 72 tells you when your wealth doubles ($72 / \\text{Annual Return}$). At an 8% index return, your capital doubles approximately every 9 years.\n- Automate your investments on payday: pay yourself first before discretionary spending.\n- Avoid high-fee funds that charge 1-2% annually—those fees eat up to a third of your lifetime compounding gains!`;
  }

  // Photography & Art
  if (context.includes('photo') || context.includes('camera') || context.includes('draw') || context.includes('art')) {
    return `In **${lessonTitle || courseTitle}**, the core secret is **learning to see light and primary shapes**:\n\n- Great photos don't come from expensive gear; they come from large, soft light sources (like a daytime window) rather than harsh overhead ceiling bulbs.\n- In drawing and art: Break down any complex subject into four basic building blocks: cubes, spheres, cylinders, and cones. Once the 3D construction is accurate, shading and detail become effortless.`;
  }

  // Generic domain response (Authentic and practical, zero bread/bicycles)
  return `That is a sharp question about **${lessonTitle || courseTitle}**!\n\nHere is the most practical principle practitioners rely on:\n\n1. **Isolate the primary variable:** When a technique or exercise feels difficult, do not change multiple factors at once. Identify the single input or movement causing friction.\n2. **The 50% Speed Rule:** Slow down the procedure by half. Executing form cleanly at slow speed builds the neurological pathways required for effortless speed later.\n3. **Immediate feedback:** Check your result against a clear standard immediately after each repetition so you calibrate accurately.`;
}
