const API_URL = "https://vartificial-api.onrender.com";

export async function getTeams(): Promise<string[]> {
  const resp = await fetch(`${API_URL}/api/teams`);
  if (!resp.ok) throw new Error("Failed to fetch teams");
  const data = await resp.json();
  return data.teams;
}

export async function predictMatch(homeTeam: string, awayTeam: string) {
  const resp = await fetch(`${API_URL}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ home_team: homeTeam, away_team: awayTeam }),
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "Prediction failed");
  }
  return await resp.json();
}

export async function getEvaluation() {
  const resp = await fetch(`${API_URL}/api/evaluate`);
  if (!resp.ok) throw new Error("Failed to fetch evaluation");
  return await resp.json();
}
