/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TWILIO_API_KEY?: string;
  readonly VITE_TWILIO_ACCOUNT_SID?: string;
  readonly VITE_TWILIO_PHONE_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
