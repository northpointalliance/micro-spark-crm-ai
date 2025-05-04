
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.11f62c5b1c0746b18d61824f1aeaa798',
  appName: 'micro-spark-crm-ai',
  webDir: 'dist',
  server: {
    url: 'https://11f62c5b-1c07-46b1-8d61-824f1aeaa798.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // If we want to add more configuration options, add them below
  plugins: {
    // Plugin configurations would go here
  }
};

export default config;
