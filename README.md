# Birthday Website for Your Special Someone

This is a beautiful, interactive birthday website created with React, Framer Motion, and love! 💖 It features smooth animations, interactive elements, and a personal touch to make your loved one's birthday extra special.

## Features

- **Welcome Page**: A beautiful birthday greeting with a confetti animation
- **Memory Lane**: A gallery of special moments you've shared
- **Interactive Slideshow**: Photos with personal captions about your memories
- **Cake Cutting**: An interactive cake cutting animation
- **Personal Message**: A heartfelt birthday message with beautiful effects
- **Music Player**: Background music with play/pause and volume controls

## How to Run the Project

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Build for production:
```
npm run build
```

## Customization

### Adding Your Own Photos

1. Add your images to the `src/assets` folder
2. Import them in the component files:
   ```js
   import image1 from '../assets/your-image.jpg';
   ```
3. Update the `memories` array in both `MemoryLane.jsx` and `Slideshow.jsx`

### Adding Music

1. Place your MP3 files in the `public/music` folder
2. Rename your main birthday song to `birthday-song.mp3`
3. To add more songs, edit the `songs` array in `src/components/MusicPlayer.jsx`

### Personalizing Messages

- Edit the birthday greeting in `Welcome.jsx`
- Update the personal message in `Greeting.jsx`
- Customize the captions in `Slideshow.jsx`

### Styling

- Main styles are in `src/index.css`
- Each component has inline styles that you can modify

Enjoy making someone's birthday special! 🎂✨
