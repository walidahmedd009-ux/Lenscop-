import { Course } from '../types/course';

export const SEED_COURSES: Course[] = [
  {
    id: 'course-ai-basics',
    title: 'How AI Thinks: A Simple Guide for Everyone',
    slug: 'how-ai-thinks-simple-guide',
    tagline: 'Learn how smart computers learn patterns, create text, and make decisions without any hard math.',
    description: 'A friendly, step-by-step course that explains Artificial Intelligence in plain English. Discover how smart machines learn from examples, how chatbots talk, and how you can use AI to save time every day.',
    category: 'Technology & Everyday Life',
    difficulty: 'Beginner',
    estimatedHours: 4,
    totalLessons: 4,
    heroImage: '/src/assets/images/course_neuroscience_ai_1793630992816.jpg',
    skillsAcquired: [
      'How AI spots patterns like a human brain',
      'The secret behind chatbots and prompts',
      'How image and voice recognition work',
      'Easy ways to use AI for daily tasks'
    ],
    prerequisites: ['No technical background needed! Just your curiosity.'],
    targetAudience: 'Anyone who wants to understand modern AI in simple, everyday words.',
    createdAt: '2026-10-15T00:00:00Z',
    isAiGenerated: false,
    modules: [
      {
        id: 'mod-ai-1',
        order: 1,
        title: 'Module 1: The Basics of Machine Learning',
        description: 'See how computers learn from examples just like children learn words and animals.',
        estimatedHours: 2,
        chapters: [
          {
            id: 'chap-ai-1-1',
            order: 1,
            title: 'Part 1: How Computers Learn',
            overview: 'The difference between regular rules and learning from examples.',
            lessons: [
              {
                id: 'les-ai-1-1-1',
                order: 1,
                title: 'Rules vs. Examples: How AI Actually Works',
                durationMinutes: 12,
                summary: 'Traditional software follows a strict recipe. AI looks at thousands of photos to find the recipe itself.',
                detailedExplanation: `### The Big Idea

Imagine teaching a friend how to spot a cat. 

In traditional programming, you would have to write down hundreds of strict rules: *"Cats have two pointy ears, whiskers, fur, and four legs."* But what if the cat is sleeping in a ball, or has floppy ears? The old computer gets confused!

AI works in a completely different, much simpler way: **it learns from examples**, just like you did when you were growing up.

### The Real Mechanism: Target Practice & Feedback
Think of training an AI model like learning archery or throwing darts at a target:
1. **Try 1:** You throw a dart. It lands 6 inches to the right of the bullseye.
2. **Measurement (The Loss):** Your eyes measure the error: "Too far right."
3. **Adjustment (The Weights):** Your brain adjusts your arm muscle tension slightly to the left.
4. **Result:** After 500 throws, your throws cluster tightly in the center.

An AI model looks at millions of pictures. Each time it makes a guess, a mathematical calculation called "backpropagation" nudges billions of numerical weights closer to the correct answer until it classifies images with superhuman accuracy.

### Why This Matters to You
You do not need to know any programming to use AI well. When you talk to tools like ChatGPT or Gemini, remember that the computer is simply guessing the most helpful next word based on patterns it has seen.`,
                keyTakeaways: [
                  'Regular software follows strict recipes; AI learns by looking at examples.',
                  'AI gets smarter by trying, checking mistakes, and making small adjustments.',
                  'When you ask AI a question, it predicts the best helpful answer based on patterns.'
                ],
                curatedVideos: [
                  {
                    id: 'vid-ai-1',
                    title: 'How Artificial Intelligence Works in Simple Words',
                    channel: 'CrashCourse',
                    duration: '9:15',
                    difficulty: 'Beginner',
                    whyRecommended: 'Friendly animations with zero technical jargon.',
                    keyTopic: 'Machine Learning Basics',
                    searchUrl: 'https://www.youtube.com/results?search_query=CrashCourse+How+AI+Works+For+Beginners'
                  },
                  {
                    id: 'vid-ai-2',
                    title: 'What is Machine Learning? An Easy Visual Guide',
                    channel: 'Google Cloud Tech',
                    duration: '6:40',
                    difficulty: 'Beginner',
                    whyRecommended: 'Fun visual examples of training a model on apples vs oranges.',
                    keyTopic: 'Learning from Examples',
                    searchUrl: 'https://www.youtube.com/results?search_query=Google+What+is+Machine+Learning+in+5+minutes'
                  }
                ],
                practicalExercise: {
                  title: 'Spot the Pattern (Quick 2-Minute Game)',
                  description: 'Notice how your own brain spots patterns before computers do.',
                  steps: [
                    'Look around the room and find 3 things made of wood.',
                    'Ask yourself: How did your eyes know they were wood? Was it color, texture, or grain?',
                    'Notice that you never ran a mathematical calculation—your brain recognized the pattern instantly!'
                  ],
                  deliverable: 'You now understand how AI pattern-matching feels in real life.'
                },
                realWorldProject: {
                  title: 'Create Your Personal AI Assistant Prompt',
                  summary: 'Write a simple 3-line note that turns any AI into a friendly tutor for your favorite hobby.',
                  instructions: [
                    'Line 1: Tell the AI who to be (e.g., "Act as a friendly cooking teacher").',
                    'Line 2: Tell it your level (e.g., "Explain everything in simple words as if to a beginner").',
                    'Line 3: Ask your first question!'
                  ],
                  toolsRecommended: ['Any free chatbot (Gemini, Claude, ChatGPT)'],
                  expectedOutcome: 'A customized, helpful answer written in comfortable words.'
                }
              },
              {
                id: 'les-ai-1-1-2',
                order: 2,
                title: 'How Chatbots Talk: The Next-Word Game',
                durationMinutes: 10,
                summary: 'Chatbots do not memorize answers; they play a very smart game of guessing the best next word.',
                detailedExplanation: `### The Smartphone Autocomplete Secret

Have you ever typed a text message on your phone, and the keyboard suggested the next word?

If you type: *"I am going to the..."*
Your phone might suggest: *"store"*, *"beach"*, or *"gym"*.

A modern AI chatbot is like a supercharged version of your phone's autocomplete. It has read almost the entire internet, so it knows which words naturally fit together to answer your question!

### The Simple Analogy: A Friendly Storyteller
Imagine a group of friends sitting around a campfire making up a story, one word at a time:
- Person 1 says: *"Once"*
- Person 2 says: *"upon"*
- Person 3 says: *"a"*
- Person 4 says: *"time..."*

Each person knows the next word because they know how fairy tales sound. An AI does the exact same thing—super fast, thousands of words per second!

### How to Get Better Answers
Because AI completes patterns, **clear questions bring clear answers**:
- Instead of: *"Tell me about dogs."*
- Try: *"What are 3 friendly dog breeds for small apartments?"*`,
                keyTakeaways: [
                  'AI predicts the most helpful next word in a sentence.',
                  'Clear and specific questions get much clearer answers.',
                  'AI works like a very smart phone keyboard that understands full contexts.'
                ],
                curatedVideos: [
                  {
                    id: 'vid-ai-3',
                    title: 'How Large Language Models Work in 5 Minutes',
                    channel: 'Fireship',
                    duration: '5:30',
                    difficulty: 'Beginner',
                    whyRecommended: 'Short, snappy, visual explanation of word tokens and predictions.',
                    keyTopic: 'Next-Word Prediction',
                    searchUrl: 'https://www.youtube.com/results?search_query=Fireship+How+LLMs+work+simple'
                  }
                ],
                practicalExercise: {
                  title: 'The Clear Question Test',
                  description: 'Turn a vague question into a crystal-clear question.',
                  steps: [
                    'Vague: "Help with dinner."',
                    'Clear: "Give me an easy 15-minute pasta dinner with only 4 ingredients."',
                    'Notice how adding your situation makes the answer 10x better!'
                  ],
                  deliverable: 'Write down 1 clear question you want to ask AI today.'
                }
              }
            ]
          }
        ],
        quiz: {
          title: 'Quick Check: How AI Works',
          passingScorePercent: 50,
          questions: [
            {
              id: 'q-ai-1',
              question: 'How does modern AI learn to recognize cats in photos?',
              options: [
                'By looking at thousands of example pictures and learning the patterns.',
                'A person types in every single hair and whisker coordinate by hand.',
                'The computer reads a dictionary definition of a cat.',
                'It has secret micro cameras inside every animal.'
              ],
              correctIndex: 0,
              explanation: 'Exactly right! AI learns by looking at many examples, just like children learn.',
              misconceptionAlert: 'Computers do not need humans to code every single hair; they discover the visual patterns on their own.'
            },
            {
              id: 'q-ai-2',
              question: 'What is the best way to get a great answer from an AI chatbot?',
              options: [
                'Use short, vague words so the computer guesses.',
                'Be clear, specific, and mention what you need.',
                'Write in all capital letters.',
                'Ask questions only in computer code.'
              ],
              correctIndex: 1,
              explanation: 'Spot on! The clearer your request, the better the AI can help you.',
              misconceptionAlert: 'You do not need code or fancy technical words. Plain, specific English works best!'
            }
          ]
        }
      }
    ],
    capstoneProject: {
      title: 'Your First AI Daily Helper',
      summary: 'Pick one real chore you do each week (meal planning, email drafting, or trip planning) and create a simple 2-minute AI template for it.',
      instructions: [
        'Choose a routine task: for example, weekly grocery list.',
        'Write a simple 2-sentence prompt: "You are my nutrition helper. Suggest 3 cheap, healthy dinners for this week with a shopping list."',
        'Save the prompt in your phone notes so you can use it whenever you want!'
      ],
      toolsRecommended: ['Notes app on phone', 'Any free AI tool'],
      expectedOutcome: 'A reusable prompt that saves you 20 minutes every week!'
    }
  },
  {
    id: 'course-photo-basics',
    title: 'Great Photos with Any Phone: Light, Angle, and Story',
    slug: 'phone-photography-basics',
    tagline: 'Take clean, beautiful photos of people, food, and places using simple techniques anyone can learn.',
    description: 'You do not need an expensive camera to take eye-catching pictures. Learn the three simple secrets of great photography: finding soft window light, using clean angles, and telling a quick visual story.',
    category: 'Creative Arts & Everyday Skills',
    difficulty: 'Beginner',
    estimatedHours: 3,
    totalLessons: 4,
    heroImage: '/src/assets/images/hero_ai_university_1793630989695.jpg',
    skillsAcquired: [
      'Finding good natural light anywhere',
      'The simple rule of thirds for framing',
      'How to clean up background clutter',
      'Easy 1-tap phone editing tricks'
    ],
    prerequisites: ['Any smartphone with a camera'],
    targetAudience: 'Anyone who wants their family, travel, and everyday photos to look brighter and more professional.',
    createdAt: '2026-10-18T00:00:00Z',
    isAiGenerated: false,
    modules: [
      {
        id: 'mod-photo-1',
        order: 1,
        title: 'Module 1: The Magic of Light and Angle',
        description: 'See light the way photographers do: soft morning light, side windows, and clean backgrounds.',
        estimatedHours: 1.5,
        chapters: [
          {
            id: 'chap-photo-1-1',
            order: 1,
            title: 'Part 1: Light is Everything',
            overview: 'Why where you stand matters more than your phone model.',
            lessons: [
              {
                id: 'les-photo-1-1-1',
                order: 1,
                title: 'The Window Secret: Natural Soft Light',
                durationMinutes: 10,
                summary: 'The easiest way to make people and food look great is to turn them towards a window, not a lightbulb.',
                detailedExplanation: `### The Big Secret: Big Light vs. Tiny Light

Have you ever wondered why ceiling lights make people look tired with shadows under their eyes?

Ceiling lights are **tiny points of harsh light**. They create sharp, dark shadows.
A window, on the other hand, is a **giant, soft light source**. It spreads light gently across faces, smoothing skin and making colors look rich and natural.

### The 1-Minute Rule
Whenever you take a photo of a person, coffee cup, or pet:
1. Find the nearest window.
2. Put the subject next to the window so the light hits them from the front or side.
3. Turn off harsh overhead ceiling lights.

Suddenly, your photo looks like it came from a magazine!`,
                keyTakeaways: [
                  'Windows give soft, gentle light that flatters people and objects.',
                  'Harsh ceiling lights create dark eye shadows—turn them off when taking portraits.',
                  'Stand with the window behind you or to your side, never behind the person.'
                ],
                curatedVideos: [
                  {
                    id: 'vid-photo-1',
                    title: '5 Smartphone Photography Tips Everyone Should Know',
                    channel: 'Sorelle Amore / Peter McKinnon',
                    duration: '7:20',
                    difficulty: 'Beginner',
                    whyRecommended: 'Fun, quick visual examples showing before and after with simple window light.',
                    keyTopic: 'Natural Lighting',
                    searchUrl: 'https://www.youtube.com/results?search_query=smartphone+photography+lighting+tips+beginner'
                  }
                ],
                practicalExercise: {
                  title: 'The 30-Second Window Test',
                  description: 'Take two quick photos of an apple or mug to see the difference with your own eyes.',
                  steps: [
                    'Snap a photo under a harsh overhead light.',
                    'Move the mug next to a daytime window and snap again.',
                    'Compare them side-by-side. Notice how much softer and cleaner the window shot looks!'
                  ],
                  deliverable: 'You now see light the way photographers see it.'
                }
              }
            ]
          }
        ],
        quiz: {
          title: 'Quick Check: Light Secrets',
          passingScorePercent: 50,
          questions: [
            {
              id: 'q-photo-1',
              question: 'Why does window light look so much better on faces than a single ceiling bulb?',
              options: [
                'Windows provide a large, soft source of light that prevents harsh shadows.',
                'Window light has special camera electricity in it.',
                'Ceiling bulbs only work for black-and-white photos.',
                'Cameras cannot see glass.'
              ],
              correctIndex: 0,
              explanation: 'Yes! A large window spreads light gently and evenly, making portraits look natural.',
              misconceptionAlert: 'You do not need expensive studio lights; daylight through a normal window is the best light available.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-clean-habits',
    title: 'How to Build Habits That Actually Stick',
    slug: 'simple-daily-habits',
    tagline: 'Simple psychology secrets to read more, stay active, and stress less using tiny 2-minute steps.',
    description: 'Forget painful motivation and huge goals that fail after a week. Learn the simple science of tiny habits: starting so small it feels effortless, pairing habits with daily routines, and keeping an easy streak.',
    category: 'Personal Growth & Health',
    difficulty: 'Beginner',
    estimatedHours: 3,
    totalLessons: 4,
    heroImage: '/src/assets/images/course_sustainable_architecture_1793630992490.jpg',
    skillsAcquired: [
      'The 2-Minute Rule to defeat procrastination',
      'Habit stacking (linking new habits to coffee or brushing teeth)',
      'How to bounce back after missing a day',
      'Designing your room so good choices are automatic'
    ],
    prerequisites: ['None! Just pick one small thing you want to do more often.'],
    targetAudience: 'Anyone tired of complicated productivity systems who wants a simple, comfortable routine.',
    createdAt: '2026-10-22T00:00:00Z',
    isAiGenerated: false,
    modules: [
      {
        id: 'mod-habit-1',
        order: 1,
        title: 'Module 1: The Secret of Tiny Starts',
        description: 'Why starting with 2 minutes beats forcing yourself to do 1 hour every single time.',
        estimatedHours: 1.5,
        chapters: [
          {
            id: 'chap-habit-1-1',
            order: 1,
            title: 'Part 1: The 2-Minute Rule',
            overview: 'Make the start so easy you cannot say no.',
            lessons: [
              {
                id: 'les-habit-1-1-1',
                order: 1,
                title: 'The 2-Minute Rule: Shrink the Habit',
                durationMinutes: 10,
                summary: 'When you want to start a new habit, it should take less than two minutes to do.',
                detailedExplanation: `### Why Big Goals Fail

We often say: *"Starting tomorrow, I will read for one hour every evening!"*
On day one, you do it. On day two, you are tired after work. The thought of reading for 60 minutes feels like a mountain. So you do nothing.

The human brain resists friction. When a task looks heavy, you procrastinate.

### The Simple Solution: The 2-Minute Rule
Make the starting step ridiculously small:
- Instead of *"Read 30 pages"* $\\to$ **"Read 1 single page."**
- Instead of *"Do a 45-minute workout"* $\\to$ **"Put on your running shoes."**
- Instead of *"Write a whole essay"* $\\to$ **"Write 1 sentence."**

### Why This Works
Starting is the hardest part. Once you sit down and read 1 page, you often read 5 more because the momentum has begun. And on days when you are truly exhausted, you still read 1 page and **keep your streak alive**!`,
                keyTakeaways: [
                  'Shrink any habit until it takes under 2 minutes to start.',
                  'Showing up consistently matters much more than doing a huge workout once.',
                  'Never break a streak two days in a row—1 minute is always better than 0.'
                ],
                curatedVideos: [
                  {
                    id: 'vid-habit-1',
                    title: 'Atomic Habits in Simple Visuals (James Clear)',
                    channel: 'Productivity Game',
                    duration: '8:45',
                    difficulty: 'Beginner',
                    whyRecommended: 'Friendly whiteboard drawings explaining the 2-minute rule.',
                    keyTopic: 'Tiny Habits',
                    searchUrl: 'https://www.youtube.com/results?search_query=Atomic+Habits+summary+simple+animation'
                  }
                ],
                practicalExercise: {
                  title: 'Shrink Your Goal Right Now',
                  description: 'Take one thing you have been putting off and make it tiny.',
                  steps: [
                    'Write down 1 thing you want to do (e.g., drink more water, stretch, read).',
                    'Ask: What is the 30-second version of this?',
                    'Example: "Fill 1 glass of water and take 2 sips."'
                  ],
                  deliverable: 'You now have a friction-free habit ready for tomorrow morning.'
                }
              }
            ]
          }
        ],
        quiz: {
          title: 'Quick Check: Tiny Habits',
          passingScorePercent: 50,
          questions: [
            {
              id: 'q-habit-1',
              question: 'According to the 2-Minute Rule, how should you start a reading habit?',
              options: [
                'Promise to read 1 single page each evening.',
                'Lock your phone in a safe for 3 hours.',
                'Force yourself to read a whole textbook in one night.',
                'Buy 20 new books at once.'
              ],
              correctIndex: 0,
              explanation: 'Spot on! Starting with just 1 page makes it so easy you never skip it.',
              misconceptionAlert: 'You do not need painful discipline; you just need to make the first step easy.'
            }
          ]
        }
      }
    ]
  }
];
