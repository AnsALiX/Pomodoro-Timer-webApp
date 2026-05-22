# Assessment Answers

### 1. How to run
[cite_start]Since I built this with plain HTML, CSS, and JS, there's no build step or `npm install` needed[cite: 8, 9]. 

**To run locally:**
1. Clone the repo: `git clone https://github.com/AnsALiX/Pomodoro-Timer-webApp.git`
2. Open the folder and just double-click the `index.html` file to run it in your browser. 

**Deployed URL:** pomodoro-timer-web-app-eta.vercel.app

### 2. Stack & design choices
[cite_start]**Stack:** I went with vanilla HTML, CSS, and JavaScript[cite: 3]. For a single-screen timer, setting up a framework like React or Vue felt like overkill and I wanted to keep it lightweight.

**Design/Interaction Decisions:**
[cite_start]I intentionally kept the UI pretty basic and barebones so I could focus on getting the timer functionality and state changes feeling right[cite: 28, 30]. 
1. **The theme switch:** Instead of writing complicated JavaScript to target and change specific colors, I just toggle a `data-mode` attribute on the `<body>` tag. CSS variables handle the rest, making the whole screen smoothly transition from the red "focus" theme to the green "break" theme.
2. **The timer font:** I used a monospace font specifically for the countdown numbers. Standard fonts have different widths for different numbers (a "1" is thinner than a "0"), which makes the timer jitter horizontally as it ticks down. [cite_start]Monospace keeps it perfectly still and easy to read at a glance[cite: 11, 30].

### 3. Responsive & accessibility
[cite_start]**Responsive Behavior:** On a large 1440px laptop screen, the app stays centered and is capped at a max-width of 400px so the basic UI doesn't look ridiculously stretched out[cite: 12]. [cite_start]On a narrow phone screen (like 360px), I added a media query to shrink the massive timer text down a bit so it doesn't cause horizontal scrolling or break the layout[cite: 12].

[cite_start]**Accessibility Handled:** I made sure the configuration inputs have proper `<label>` tags linked with the `for` attribute so screen readers actually know what the inputs are for[cite: 13]. I also stuck to semantic HTML (`<main>`, `<header>`, `<section>`) instead of just throwing everything into `<div>` tags.

[cite_start]**Accessibility Skipped:** I didn't set up an `aria-live` region for the countdown or the state transitions[cite: 14]. Hearing users get the audio "ding" when the session ends, but a Deaf user relying on a screen reader might miss the transition if they aren't actively looking at the screen. 

### 4. AI usage
* **Tool:** Gemini
* [cite_start]**Usage:** I used it as a pair-programmer to speed up my build process[cite: 15].
    1. I asked it to help me scaffold the initial vanilla structure because I wanted to make sure my `setInterval` logic was set up cleanly.
    2. I uploaded a screenshot when I had a weird visual bug (a random piece of text reading `tag -->` was rendering on my screen) and it helped me track down where I accidentally copy-pasted it in my HTML. 
* **What I changed:** The AI originally generated a standard 25-minute focus / 5-minute break Pomodoro setup. [cite_start]I dug into the code to change the default HTML values and completely rebuild the container layout so it specifically matched a reference design I was trying to replicate (defaulting to 2 mins / 1 min for easier testing and tweaking the button layout)[cite: 16, 17, 18].

### 5. Honest gap
**Unpolished aspect:** To be honest, the UI is very basic right now. [cite_start]It gets the job done and tracks the daily history [cite: 24, 25][cite_start], but it lacks that extra visual polish (like a circular progress bar or smooth micro-interactions) that would make it feel premium[cite: 19]. 

**The Fix:** Also, the timer currently relies on JavaScript's `setInterval`. If you switch tabs and leave it in the background for a while, modern browsers will throttle the script to save battery, making the timer lose accuracy. [cite_start]If I had another day, I'd fix this by saving a `Date.now()` timestamp when the timer starts and calculating the exact time remaining based on the real clock, rather than just counting down by 1 every second[cite: 19].