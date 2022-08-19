import config from '@/config';
import { datadogRum } from "@datadog/browser-rum";

datadogRum.init({
  applicationId: "8389e11f-c265-4e26-b593-714a0715ee23",
  clientToken: "pub8e917141fb2fbe2762f2fc70e3e2f0bb",
  site: "datadoghq.com",
  service: "penguin-statistics",

  // Specify a version number to identify the deployed version of your application in Datadog
  version: config.version,
  sampleRate: 10,
  premiumSampleRate: 1,
  trackInteractions: true,
  defaultPrivacyLevel: "allow",
});

datadogRum.startSessionReplayRecording();
