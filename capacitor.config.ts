import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7b640417c5e14d8ca86c31d004391e57',
  appName: 'FitLock - Screen Time Control',
  webDir: 'dist',
  server: {
    url: 'https://7b640417-c5e1-4d8c-a86c-31d004391e57.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3b82f6',
      showSpinner: false
    }
  }
};

export default config;