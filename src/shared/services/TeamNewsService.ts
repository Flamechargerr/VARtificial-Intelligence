// Team news service to simulate team news fetching
export interface TeamNewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedAt: Date;
  url: string;
  imageUrl?: string;
}

class TeamNewsService {
  // Simulate fetching news for a team
  async fetchTeamNews(teamName: string): Promise<TeamNewsItem[]> {
    // In a real application, this would fetch from an API
    // For now, we'll simulate with sample data
    
    // Generate sample news based on team name
    const sampleNews: TeamNewsItem[] = [
      {
        id: `news-1-${teamName}`,
        title: `${teamName} Prepares for Upcoming Match`,
        summary: `The ${teamName} squad is intensively training for their next fixture.`,
        content: `The ${teamName} team has been undergoing rigorous training sessions in preparation for their upcoming match. Coach ${this.generateCoachName()} has expressed confidence in the team's current form and believes they have a strong chance of winning.`,
        source: "Sports Daily",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        url: "#",
        imageUrl: this.generateImageUrl(teamName)
      },
      {
        id: `news-2-${teamName}`,
        title: `Key Player Returns to ${teamName} Squad`,
        summary: `Star player ${this.generatePlayerName()} has recovered from injury and rejoins the team.`,
        content: `${this.generatePlayerName()}, the star player for ${teamName}, has made a full recovery from their recent injury and is set to rejoin the squad for the upcoming matches. This is a significant boost for the team as they prepare for their challenging fixtures.`,
        source: "Football Insider",
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        url: "#",
        imageUrl: this.generateImageUrl(teamName)
      },
      {
        id: `news-3-${teamName}`,
        title: `${teamName} Signs New Sponsorship Deal`,
        summary: `The club has announced a major new sponsorship agreement.`,
        content: `${teamName} has announced a landmark sponsorship deal with ${this.generateSponsorName()}, worth millions over the next five years. This partnership will provide significant financial support for the club's development and player acquisitions.`,
        source: "Business Sports",
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        url: "#",
        imageUrl: this.generateImageUrl(teamName)
      },
      {
        id: `news-4-${teamName}`,
        title: `${teamName} Academy Produces New Talent`,
        summary: `Young prospects from the ${teamName} academy are making headlines.`,
        content: `The ${teamName} youth academy continues to produce exceptional talent, with several young players being promoted to the first team. Academy director ${this.generateCoachName()} praised the development program and highlighted the potential of the new recruits.`,
        source: "Youth Football Weekly",
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        url: "#",
        imageUrl: this.generateImageUrl(teamName)
      },
      {
        id: `news-5-${teamName}`,
        title: `${teamName} Stadium Upgrade Announced`,
        summary: `Plans revealed for major improvements to the team's home ground.`,
        content: `${teamName} has announced ambitious plans to upgrade their home stadium, including new seating, improved facilities, and enhanced fan experiences. The project is expected to begin next year and will significantly increase the stadium's capacity.`,
        source: "Stadium News",
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        url: "#",
        imageUrl: this.generateImageUrl(teamName)
      }
    ];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return sampleNews;
  }

  // Generate a random coach name
  private generateCoachName(): string {
    const firstNames = ['John', 'Michael', 'Robert', 'David', 'James', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }

  // Generate a random player name
  private generatePlayerName(): string {
    const firstNames = ['Lionel', 'Cristiano', 'Neymar', 'Kylian', 'Kevin', 'Virgil', 'Sergio', 'Luka', 'Karim', 'Erling'];
    const lastNames = ['Messi', 'Ronaldo', 'Mbappé', 'De Bruyne', 'van Dijk', 'Ramos', 'Modric', 'Benzema', 'Haaland', 'Salah'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${firstName} ${lastName}`;
  }

  // Generate a random sponsor name
  private generateSponsorName(): string {
    const sponsors = ['TechGlobal', 'SportMax', 'PowerFuel', 'QuickBank', 'HealthPlus', 'SpeedNet', 'EcoDrive', 'FreshFood', 'SafeHome', 'TravelEasy'];
    return sponsors[Math.floor(Math.random() * sponsors.length)];
  }

  // Generate an image URL based on team name
  private generateImageUrl(teamName: string): string {
    // Using placeholder images for now
    const teamSlug = teamName.toLowerCase().replace(/\s+/g, '-');
    return `https://via.placeholder.com/400x200/4A90E2/FFFFFF?text=${encodeURIComponent(teamName)}`;
  }
}

export const teamNewsService = new TeamNewsService();