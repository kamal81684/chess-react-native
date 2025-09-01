# Chess App

A beautiful, working chess app built with React Native and Expo.

## Features
- Play chess with a modern, responsive UI
- All standard chess rules implemented
- Sound effects for moves, captures, checks, game start/end, and more
- Themed design with light/dark mode support
- Parallax scroll views and animated UI elements
- Haptic feedback on tab navigation
- Collapsible sections and external links

## Folder Structure
```
app.json                # Expo app configuration
eslint.config.js        # ESLint configuration
expo-env.d.ts           # Expo environment types
package.json            # Project dependencies and scripts
README.md               # Project documentation
tsconfig.json           # TypeScript configuration

app/                    # Main app screens and layouts
   _layout.tsx           # Root layout
   +not-found.tsx        # 404 screen
   (tabs)/               # Tab navigation screens
      _layout.tsx         # Tab layout
      index.tsx           # Main tab screen

assets/                 # Static assets
   fonts/                # Custom fonts
      SpaceMono-Regular.ttf
   images/               # App icons and images
      adaptive-icon.png
      favicon.png
      icon.png
      partial-react-logo.png
      react-logo.png
      react-logo@2x.png
      react-logo@3x.png
      splash-icon.png
   sounds/               # Sound effects
      capture.mp3
      castle.mp3
      createSounds.ts
      game-end.mp3
      game-start.mp3
      illegal.mp3
      move-check.mp3
      move-opponent.mp3
      move-self.mp3
      notify.mp3
      premove.mp3
      promote.mp3
      tenseconds.mp3

components/             # Reusable UI components
   Collapsible.tsx
   ExternalLink.tsx
   HapticTab.tsx
   HelloWave.tsx
   ParallaxScrollView.tsx
   ThemedText.tsx
   ThemedView.tsx
   ui/                   # Platform-specific UI
      IconSymbol.ios.tsx
      IconSymbol.tsx
      TabBarBackground.ios.tsx
      TabBarBackground.tsx

constants/              # App-wide constants
   Colors.ts

hooks/                  # Custom React hooks
   useColorScheme.ts
   useColorScheme.web.ts
   useThemeColor.ts

scripts/                # Utility scripts
   reset-project.js

utils/                  # Utility functions
   SoundManager.ts
```

## Getting Started
1. **Install dependencies:**
    ```bash
    npm install
    ```
2. **Start the app:**
    ```bash
    npx expo start
    ```
3. **Open in Expo Go or emulator.**

## Notes
- Only frontend is implemented (no backend or multiplayer yet)
- All chess logic and sounds work locally
- Designed for quick setup and easy extension

## Credits
- Built by [kamal81684](https://github.com/kamal81684)
- Powered by React Native, Expo, and TypeScript

---
Feel free to contribute or fork!
