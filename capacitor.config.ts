import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mathefficiency.app',
  appName: 'Math-Efficiency',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    // 平板适配
    allowMixedContent: true,
    backgroundColor: '#F5E6D0',
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#F5E6D0'
    }
  }
};

export default config;
