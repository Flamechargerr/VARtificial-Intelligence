// Match update service to simulate real-time match events
export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'half_time' | 'full_time';
  team: string;
  player?: string;
  minute: number;
  description: string;
  timestamp: Date;
}

export interface MatchState {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: string;
  currentMinute: number;
  isLive: boolean;
  events: MatchEvent[];
}

class MatchUpdateService {
  private listeners: ((state: MatchState) => void)[] = [];
  private matchState: MatchState | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  // Subscribe to match updates
  subscribe(listener: (state: MatchState) => void): () => void {
    this.listeners.push(listener);
    
    // If we already have a match state, send it to the new listener
    if (this.matchState) {
      listener(this.matchState);
    }
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Start a simulated match
  startMatch(homeTeam: string, awayTeam: string): void {
    this.matchState = {
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: "0",
      currentMinute: 0,
      isLive: true,
      events: []
    };

    // Notify all listeners of the initial state
    this.notifyListeners();

    // Start simulating match updates
    this.updateInterval = setInterval(() => {
      this.simulateMatchUpdate();
    }, 5000); // Update every 5 seconds
  }

  // Stop the match simulation
  stopMatch(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    if (this.matchState) {
      this.matchState.isLive = false;
      this.notifyListeners();
    }
  }

  // Simulate match updates
  private simulateMatchUpdate(): void {
    if (!this.matchState) return;

    // Increment minute (up to 90)
    if (this.matchState.currentMinute < 90) {
      this.matchState.currentMinute += Math.floor(Math.random() * 3) + 1;
      
      // Ensure we don't go over 90
      if (this.matchState.currentMinute > 90) {
        this.matchState.currentMinute = 90;
      }
    } else {
      // End the match
      this.stopMatch();
      return;
    }

    // Randomly generate events
    if (Math.random() > 0.7) {
      this.generateEvent();
    }

    this.notifyListeners();
  }

  // Generate a random match event
  private generateEvent(): void {
    if (!this.matchState) return;

    const eventTypes: MatchEvent['type'][] = ['goal', 'yellow_card', 'red_card', 'substitution'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const isHomeTeam = Math.random() > 0.5;
    const team = isHomeTeam ? this.matchState.homeTeam : this.matchState.awayTeam;
    
    let description = '';
    let player = '';
    
    switch (eventType) {
      case 'goal':
        player = this.generatePlayerName();
        description = `${player} scores for ${team}!`;
        if (isHomeTeam) {
          this.matchState.homeScore += 1;
        } else {
          const currentAwayScore = parseInt(this.matchState.awayScore) || 0;
          this.matchState.awayScore = (currentAwayScore + 1).toString();
        }
        break;
      case 'yellow_card':
        player = this.generatePlayerName();
        description = `${player} receives a yellow card`;
        break;
      case 'red_card':
        player = this.generatePlayerName();
        description = `${player} receives a red card!`;
        break;
      case 'substitution':
        const playerOut = this.generatePlayerName();
        const playerIn = this.generatePlayerName();
        description = `Substitution for ${team}: ${playerOut} off, ${playerIn} on`;
        player = `${playerOut} → ${playerIn}`;
        break;
    }

    const event: MatchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: eventType,
      team,
      player,
      minute: this.matchState.currentMinute,
      description,
      timestamp: new Date()
    };

    this.matchState.events.unshift(event);
    
    // Keep only the last 10 events
    if (this.matchState.events.length > 10) {
      this.matchState.events.pop();
    }
  }

  // Generate a random player name
  private generatePlayerName(): string {
    const firstNames = ['James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }

  // Notify all listeners of state changes
  private notifyListeners(): void {
    if (this.matchState) {
      this.listeners.forEach(listener => listener({...this.matchState!}));
    }
  }

  // Get current match state
  getCurrentState(): MatchState | null {
    return this.matchState ? {...this.matchState} : null;
  }
}

export const matchUpdateService = new MatchUpdateService();