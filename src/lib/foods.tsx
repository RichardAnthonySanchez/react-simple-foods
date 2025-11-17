export default async function getFoods() {
  const res = await fetch("/api/v1/foods");
  if (!res.ok) throw new Error("Failed to fetch foods");
  return res.json();
}
