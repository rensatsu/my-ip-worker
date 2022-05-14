declare const TEXT_API_ENABLED: string;

function canUseApi(): boolean {
  return typeof TEXT_API_ENABLED === undefined && TEXT_API_ENABLED !== "1";
}

export { canUseApi };
