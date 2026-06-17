"""
Data Pipeline for Football Match Prediction
============================================

Fetches historical Premier League data from football-data.co.uk,
processes it into a SQLite database, and engineers pre-match features
for ML training.

Usage:
    python scripts/fetch_data.py

Output:
    - data/raw/E0_*.csv       : Raw CSVs from football-data.co.uk
    - data/processed/matches.db : SQLite database with engineered features
"""

import os
import sqlite3
import requests
import pandas as pd
import numpy as np
from pathlib import Path

# Seasons to download (format: start_year_end_year, e.g., "2324" = 2023-24)
SEASONS = [
    "1516", "1617", "1718", "1819", "1920",
    "2021", "2122", "2223", "2324", "2425"
]

BASE_URL = "https://www.football-data.co.uk/mmz4281/{season}/E0.csv"
RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")


def download_season(season: str) -> Path:
    """Download a single season's CSV from football-data.co.uk."""
    url = BASE_URL.format(season=season)
    filepath = RAW_DIR / f"E0_{season}.csv"

    if filepath.exists():
        print(f"  {season}: already cached")
        return filepath

    print(f"  {season}: downloading...")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        with open(filepath, "wb") as f:
            f.write(response.content)
        print(f"  {season}: saved ({len(response.content)} bytes)")
        return filepath
    except Exception as e:
        print(f"  {season}: FAILED - {e}")
        return None


def load_and_clean_data(filepath: Path) -> pd.DataFrame:
    """Load a raw CSV and clean it."""
    if filepath is None or not filepath.exists():
        return pd.DataFrame()

    try:
        df = pd.read_csv(filepath, encoding="utf-8")
    except UnicodeDecodeError:
        df = pd.read_csv(filepath, encoding="latin1")

    # Keep only relevant columns
    keep_cols = [
        "Date", "HomeTeam", "AwayTeam",
        "FTHG", "FTAG", "FTR",          # Full-time goals, result (H/D/A)
        "HTHG", "HTAG", "HTR",          # Half-time goals, result
        "HS", "AS", "HST", "AST",       # Shots, shots on target
        "HF", "AF", "HC", "AC",         # Fouls, corners
        "HY", "AY", "HR", "AR",         # Yellow cards, red cards
    ]

    available = [c for c in keep_cols if c in df.columns]
    df = df[available].copy()

    # Parse date
    if "Date" in df.columns:
        df["Date"] = pd.to_datetime(df["Date"], dayfirst=True, errors="coerce")

    # Drop rows with missing essential data
    df = df.dropna(subset=["HomeTeam", "AwayTeam", "FTHG", "FTAG", "FTR"])

    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineer pre-match features from historical data.
    Uses ONLY information available BEFORE the match kicks off.
    """
    df = df.sort_values(["HomeTeam", "Date"]).reset_index(drop=True)

    # Encode result as numeric
    result_map = {"H": 0, "D": 1, "A": 2}
    df["target"] = df["FTR"].map(result_map)

    # Rolling form features (last 5 matches for each team)
    def rolling_features(team_col, opp_col, goals_col, opp_goals_col, prefix):
        """Compute rolling features for a team perspective."""
        records = []
        for team in df[team_col].unique():
            team_matches = df[df[team_col] == team].sort_values("Date").copy()
            team_matches[f"{prefix}_goals_scored_5"] = team_matches[goals_col].shift(1).rolling(5, min_periods=1).mean()
            team_matches[f"{prefix}_goals_conceded_5"] = team_matches[opp_goals_col].shift(1).rolling(5, min_periods=1).mean()
            team_matches[f"{prefix}_shots_5"] = team_matches.get(f"{prefix.upper()}S", pd.Series(0)).shift(1).rolling(5, min_periods=1).mean()
            team_matches[f"{prefix}_shots_target_5"] = team_matches.get(f"{prefix.upper()}ST", pd.Series(0)).shift(1).rolling(5, min_periods=1).mean()

            # Points from last 5
            pts = team_matches["FTR"].shift(1).map({"H": 3 if prefix == "home" else 0, "D": 1, "A": 0 if prefix == "home" else 3})
            team_matches[f"{prefix}_pts_5"] = pts.rolling(5, min_periods=1).sum().fillna(0)

            # Win rate last 5
            wins = team_matches["FTR"].shift(1).map({"H": 1 if prefix == "home" else 0, "D": 0, "A": 0 if prefix == "home" else 1})
            team_matches[f"{prefix}_win_rate_5"] = wins.rolling(5, min_periods=1).mean().fillna(0)

            records.append(team_matches)
        return pd.concat(records).sort_index()

    # We need to compute rolling features for each team independently,
    # then merge back. Let's do this more carefully.

    all_matches = df.copy()

    # For each team, compute their rolling stats regardless of home/away
    team_stats = {}
    for team in pd.concat([all_matches["HomeTeam"], all_matches["AwayTeam"]]).unique():
        home_games = all_matches[all_matches["HomeTeam"] == team][["Date", "FTHG", "FTAG", "FTR", "HS", "HST"]].copy()
        home_games.columns = ["Date", "GF", "GA", "Res", "S", "ST"]
        home_games["venue"] = "H"

        away_games = all_matches[all_matches["AwayTeam"] == team][["Date", "FTAG", "FTHG", "FTR", "AS", "AST"]].copy()
        away_games.columns = ["Date", "GF", "GA", "Res", "S", "ST"]
        away_games["venue"] = "A"

        team_df = pd.concat([home_games, away_games]).sort_values("Date")

        # Rolling features (shift 1 so we don't leak current match)
        team_df["goals_scored_5"] = team_df["GF"].shift(1).rolling(5, min_periods=1).mean().fillna(0)
        team_df["goals_conceded_5"] = team_df["GA"].shift(1).rolling(5, min_periods=1).mean().fillna(0)
        team_df["shots_5"] = team_df["S"].shift(1).rolling(5, min_periods=1).mean().fillna(0)
        team_df["shots_target_5"] = team_df["ST"].shift(1).rolling(5, min_periods=1).mean().fillna(0)

        pts = team_df["Res"].map({"H": 3, "D": 1, "A": 0})
        team_df["pts_5"] = pts.shift(1).rolling(5, min_periods=1).sum().fillna(0)

        wins = team_df["Res"].map({"H": 1, "D": 0, "A": 0})
        team_df["win_rate_5"] = wins.shift(1).rolling(5, min_periods=1).mean().fillna(0)

        team_stats[team] = team_df

    # Merge rolling stats back into match dataframe
    def get_team_feature(team, date, feature, venue_filter=None):
        if team not in team_stats:
            return 0
        ts = team_stats[team]
        if venue_filter:
            ts = ts[ts["venue"] == venue_filter]
        prior = ts[ts["Date"] < date]
        if len(prior) == 0:
            return 0
        return prior[feature].iloc[-1]

    features = []
    for _, row in all_matches.iterrows():
        home = row["HomeTeam"]
        away = row["AwayTeam"]
        date = row["Date"]

        feat = {
            "Date": date,
            "HomeTeam": home,
            "AwayTeam": away,
            "FTHG": row["FTHG"],
            "FTAG": row["FTAG"],
            "FTR": row["FTR"],
            "target": row["target"],
            # Home team rolling stats (all venues)
            "home_goals_scored_5": get_team_feature(home, date, "goals_scored_5"),
            "home_goals_conceded_5": get_team_feature(home, date, "goals_conceded_5"),
            "home_shots_5": get_team_feature(home, date, "shots_5"),
            "home_shots_target_5": get_team_feature(home, date, "shots_target_5"),
            "home_pts_5": get_team_feature(home, date, "pts_5"),
            "home_win_rate_5": get_team_feature(home, date, "win_rate_5"),
            # Home team home-only stats
            "home_goals_scored_home_5": get_team_feature(home, date, "goals_scored_5", "H"),
            "home_goals_conceded_home_5": get_team_feature(home, date, "goals_conceded_5", "H"),
            "home_pts_home_5": get_team_feature(home, date, "pts_5", "H"),
            # Away team rolling stats (all venues)
            "away_goals_scored_5": get_team_feature(away, date, "goals_scored_5"),
            "away_goals_conceded_5": get_team_feature(away, date, "goals_conceded_5"),
            "away_shots_5": get_team_feature(away, date, "shots_5"),
            "away_shots_target_5": get_team_feature(away, date, "shots_target_5"),
            "away_pts_5": get_team_feature(away, date, "pts_5"),
            "away_win_rate_5": get_team_feature(away, date, "win_rate_5"),
            # Away team away-only stats
            "away_goals_scored_away_5": get_team_feature(away, date, "goals_scored_5", "A"),
            "away_goals_conceded_away_5": get_team_feature(away, date, "goals_conceded_5", "A"),
            "away_pts_away_5": get_team_feature(away, date, "pts_5", "A"),
        }
        features.append(feat)

    return pd.DataFrame(features)


def compute_head_to_head(df: pd.DataFrame) -> pd.DataFrame:
    """Add head-to-head features."""
    h2h = {}
    for _, row in df.iterrows():
        home = row["HomeTeam"]
        away = row["AwayTeam"]
        date = row["Date"]
        key = tuple(sorted([home, away]))

        prior = df[
            (df["Date"] < date) &
            (((df["HomeTeam"] == home) & (df["AwayTeam"] == away)) |
             ((df["HomeTeam"] == away) & (df["AwayTeam"] == home)))
        ].sort_values("Date")

        last_5 = prior.tail(5)
        if len(last_5) > 0:
            home_wins = sum((last_5["HomeTeam"] == home) & (last_5["FTR"] == "H")) + \
                        sum((last_5["AwayTeam"] == home) & (last_5["FTR"] == "A"))
            draws = sum(last_5["FTR"] == "D")
            away_wins = len(last_5) - home_wins - draws
            row["h2h_home_wins"] = home_wins / len(last_5)
            row["h2h_draws"] = draws / len(last_5)
            row["h2h_away_wins"] = away_wins / len(last_5)
            row["h2h_matches"] = len(last_5)
        else:
            row["h2h_home_wins"] = 0
            row["h2h_draws"] = 0
            row["h2h_away_wins"] = 0
            row["h2h_matches"] = 0

    return df


def save_to_sqlite(df: pd.DataFrame, db_path: Path):
    """Save processed data to SQLite."""
    conn = sqlite3.connect(db_path)
    df.to_sql("matches", conn, if_exists="replace", index=False)

    # Create a teams table for the frontend
    teams = pd.concat([df["HomeTeam"], df["AwayTeam"]]).unique()
    teams_df = pd.DataFrame({"name": sorted(teams)})
    teams_df.to_sql("teams", conn, if_exists="replace", index=False)

    conn.close()
    print(f"  Saved {len(df)} matches to {db_path}")


def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    print("Downloading raw data...")
    files = []
    for season in SEASONS:
        fp = download_season(season)
        if fp:
            files.append(fp)

    if not files:
        print("ERROR: No data downloaded. Exiting.")
        return

    print("\nLoading and cleaning...")
    dfs = []
    for fp in files:
        df = load_and_clean_data(fp)
        if not df.empty:
            dfs.append(df)
            print(f"  {fp.name}: {len(df)} matches")

    if not dfs:
        print("ERROR: No valid data loaded. Exiting.")
        return

    combined = pd.concat(dfs, ignore_index=True)
    combined = combined.sort_values("Date").reset_index(drop=True)
    print(f"\nTotal raw matches: {len(combined)}")

    print("\nEngineering pre-match features...")
    featured = engineer_features(combined)

    print("\nComputing head-to-head history...")
    featured = compute_head_to_head(featured)

    # Drop rows with missing features (first 5 matches per team have no history)
    featured = featured.dropna()
    print(f"Final matches with features: {len(featured)}")

    print("\nSaving to SQLite...")
    db_path = PROCESSED_DIR / "matches.db"
    save_to_sqlite(featured, db_path)

    print("\nDone!")


if __name__ == "__main__":
    main()
