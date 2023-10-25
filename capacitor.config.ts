import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '2048',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
