import { defineBackend } from '@aws-amplify/backend';
import { AmplifyHosting } from '@aws-amplify/backend-hosting';

const backend = defineBackend({
  hosting: new AmplifyHosting({
    name: 'wxmattclean2-hosting',
    sourceUrl: 'https://github.com/xcasanova/wxmattclean2.git',
    branch: 'main',
    buildSettings: {
      buildCommand: 'npm run build',
      outputDirectory: 'build',
      baseDirectory: '/'
    }
  })
});

export type Backend = typeof backend; 