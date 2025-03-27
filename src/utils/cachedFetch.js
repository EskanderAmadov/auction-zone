export async function getCachedAuctions(fetchFn, cacheKey, ttl = 300000) {
  const cached = sessionStorage.getItem(cacheKey);

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const isFresh = Date.now() - timestamp < ttl;

    if (isFresh) {
      console.log(`Loaded ${cacheKey} from cache`);
      return data;
    }
  }

  const data = await fetchFn();
  sessionStorage.setItem(
    cacheKey,
    JSON.stringify({ data, timestamp: Date.now() })
  );
  console.log(`🔄 Cached ${cacheKey}`);
  return data;
}
