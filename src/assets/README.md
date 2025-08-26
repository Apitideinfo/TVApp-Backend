# Assets Folder

This folder contains all the static assets used in the TV App.

## Folder Structure

```
src/assets/
├── images/          # General images, photos, backgrounds
├── icons/           # Icon files (PNG, SVG)
├── fonts/           # Custom font files
└── index.ts         # Central export file for all assets
```

## Usage

### Adding Images

1. Place your image files in the appropriate folder:
   - `images/` for general images, photos, backgrounds
   - `icons/` for icon files

2. Update the `src/assets/index.ts` file to include your new assets:

```typescript
// In src/assets/index.ts
export const images = {
  logo: require('./images/logo.png'),
  background: require('./images/background.jpg'),
};

export const icons = {
  home: require('./icons/home.png'),
  settings: require('./icons/settings.png'),
};
```

3. Import and use in your components:

```typescript
import { images, icons } from '../assets';

// In your component
<Image source={images.logo} />
<Image source={icons.home} />
```

### Adding Custom Fonts

1. Place your font files in the `fonts/` folder
2. Update the `src/assets/index.ts` file
3. Link the fonts in your React Native project

### Supported Formats

- **Images**: PNG, JPG, JPEG, GIF, WebP
- **Icons**: PNG, SVG (if using react-native-svg)
- **Fonts**: TTF, OTF

### Best Practices

- Use descriptive file names
- Optimize images for mobile (compress when possible)
- Use appropriate image sizes for different screen densities
- Keep the assets folder organized and clean
- Update the index.ts file whenever you add new assets

### Example Asset Usage

```typescript
// Import assets
import assets from '../assets';

// Use in components
<Image 
  source={assets.images.logo} 
  style={{ width: 100, height: 100 }} 
/>

<Image 
  source={assets.icons.notification} 
  style={{ width: 24, height: 24 }} 
/>
``` 