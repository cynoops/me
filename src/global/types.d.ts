declare global {
  interface Window {
    _t: (key: string, defaultValue?: string) => string;
  }
}
export {};
