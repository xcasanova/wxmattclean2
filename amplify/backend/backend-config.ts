import { defineBackend } from '@aws-amplify/backend';

const backend = defineBackend({
  // Add your backend resources here
});

export type Backend = typeof backend; 