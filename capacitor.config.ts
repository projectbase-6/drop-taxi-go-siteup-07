import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5cb1d1e16d704f3fbb1270ee357bb4eb',
  appName: 'drop-taxi-go-siteup',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    url: 'https://5cb1d1e1-6d70-4f3f-bb12-70ee357bb4eb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      requestTimeout: 10000,
      enableHighAccuracy: true,
      permissions: {
        location: "when-in-use"
      }
    }
  }
};

export default config;