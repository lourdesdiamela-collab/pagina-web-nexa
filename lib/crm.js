export async function saveLead(data) {
  return { ...data, createdAt: new Date().toISOString() };
}
