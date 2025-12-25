import { type Player } from "@/types";

/**
 * Premier League 2022-23 Player Data
 * 
 * Simplified player rosters for each Premier League team.
 * Used for display purposes in the match prediction interface.
 */
const mockPlayers: Record<string, Player[]> = {
  "Arsenal": [
    { id: "1", name: "Bukayo Saka", position: "FWD", rating: 86 },
    { id: "2", name: "Martin Ødegaard", position: "MID", rating: 87 },
    { id: "3", name: "William Saliba", position: "DEF", rating: 84 },
    { id: "4", name: "Gabriel Jesus", position: "FWD", rating: 83 },
    { id: "5", name: "Aaron Ramsdale", position: "GK", rating: 82 },
  ],
  "Manchester City": [
    { id: "6", name: "Erling Haaland", position: "FWD", rating: 91 },
    { id: "7", name: "Kevin De Bruyne", position: "MID", rating: 91 },
    { id: "8", name: "Rodri", position: "MID", rating: 88 },
    { id: "9", name: "Ederson", position: "GK", rating: 88 },
    { id: "10", name: "Rúben Dias", position: "DEF", rating: 87 },
  ],
  "Liverpool": [
    { id: "11", name: "Mohamed Salah", position: "FWD", rating: 89 },
    { id: "12", name: "Virgil van Dijk", position: "DEF", rating: 89 },
    { id: "13", name: "Trent Alexander-Arnold", position: "DEF", rating: 87 },
    { id: "14", name: "Alisson", position: "GK", rating: 89 },
    { id: "15", name: "Darwin Núñez", position: "FWD", rating: 83 },
  ],
  "Manchester United": [
    { id: "16", name: "Bruno Fernandes", position: "MID", rating: 86 },
    { id: "17", name: "Marcus Rashford", position: "FWD", rating: 85 },
    { id: "18", name: "Casemiro", position: "MID", rating: 87 },
    { id: "19", name: "Lisandro Martínez", position: "DEF", rating: 84 },
    { id: "20", name: "David de Gea", position: "GK", rating: 85 },
  ],
  "Chelsea": [
    { id: "21", name: "Enzo Fernández", position: "MID", rating: 84 },
    { id: "22", name: "Raheem Sterling", position: "FWD", rating: 84 },
    { id: "23", name: "Reece James", position: "DEF", rating: 85 },
    { id: "24", name: "Thiago Silva", position: "DEF", rating: 85 },
    { id: "25", name: "Kepa Arrizabalaga", position: "GK", rating: 81 },
  ],
  "Tottenham": [
    { id: "26", name: "Harry Kane", position: "FWD", rating: 90 },
    { id: "27", name: "Son Heung-min", position: "FWD", rating: 89 },
    { id: "28", name: "Cristian Romero", position: "DEF", rating: 85 },
    { id: "29", name: "Hugo Lloris", position: "GK", rating: 85 },
    { id: "30", name: "Pierre-Emile Højbjerg", position: "MID", rating: 82 },
  ],
  "Newcastle": [
    { id: "31", name: "Bruno Guimarães", position: "MID", rating: 85 },
    { id: "32", name: "Alexander Isak", position: "FWD", rating: 83 },
    { id: "33", name: "Kieran Trippier", position: "DEF", rating: 84 },
    { id: "34", name: "Nick Pope", position: "GK", rating: 84 },
    { id: "35", name: "Sven Botman", position: "DEF", rating: 82 },
  ],
  "Aston Villa": [
    { id: "36", name: "Ollie Watkins", position: "FWD", rating: 83 },
    { id: "37", name: "Emiliano Martínez", position: "GK", rating: 86 },
    { id: "38", name: "Douglas Luiz", position: "MID", rating: 82 },
    { id: "39", name: "Tyrone Mings", position: "DEF", rating: 80 },
    { id: "40", name: "John McGinn", position: "MID", rating: 81 },
  ],
  "Brighton": [
    { id: "41", name: "Moises Caicedo", position: "MID", rating: 82 },
    { id: "42", name: "Alexis Mac Allister", position: "MID", rating: 83 },
    { id: "43", name: "Kaoru Mitoma", position: "FWD", rating: 80 },
    { id: "44", name: "Lewis Dunk", position: "DEF", rating: 81 },
    { id: "45", name: "Robert Sánchez", position: "GK", rating: 80 },
  ],
  "West Ham": [
    { id: "46", name: "Declan Rice", position: "MID", rating: 86 },
    { id: "47", name: "Jarrod Bowen", position: "FWD", rating: 82 },
    { id: "48", name: "Lucas Paquetá", position: "MID", rating: 83 },
    { id: "49", name: "Kurt Zouma", position: "DEF", rating: 80 },
    { id: "50", name: "Łukasz Fabiański", position: "GK", rating: 79 },
  ],
  "Crystal Palace": [
    { id: "51", name: "Wilfried Zaha", position: "FWD", rating: 81 },
    { id: "52", name: "Eberechi Eze", position: "MID", rating: 80 },
    { id: "53", name: "Marc Guéhi", position: "DEF", rating: 81 },
    { id: "54", name: "Vicente Guaita", position: "GK", rating: 79 },
    { id: "55", name: "Michael Olise", position: "FWD", rating: 78 },
  ],
  "Brentford": [
    { id: "56", name: "Ivan Toney", position: "FWD", rating: 82 },
    { id: "57", name: "Bryan Mbeumo", position: "FWD", rating: 79 },
    { id: "58", name: "David Raya", position: "GK", rating: 81 },
    { id: "59", name: "Christian Nørgaard", position: "MID", rating: 78 },
    { id: "60", name: "Pontus Jansson", position: "DEF", rating: 78 },
  ],
  "Fulham": [
    { id: "61", name: "Aleksandar Mitrović", position: "FWD", rating: 80 },
    { id: "62", name: "Andreas Pereira", position: "MID", rating: 78 },
    { id: "63", name: "Tim Ream", position: "DEF", rating: 77 },
    { id: "64", name: "Bernd Leno", position: "GK", rating: 82 },
    { id: "65", name: "João Palhinha", position: "MID", rating: 81 },
  ],
  "Wolverhampton": [
    { id: "66", name: "Matheus Nunes", position: "MID", rating: 81 },
    { id: "67", name: "Rúben Neves", position: "MID", rating: 82 },
    { id: "68", name: "Pedro Neto", position: "FWD", rating: 79 },
    { id: "69", name: "José Sá", position: "GK", rating: 81 },
    { id: "70", name: "Max Kilman", position: "DEF", rating: 78 },
  ],
  "Everton": [
    { id: "71", name: "Dominic Calvert-Lewin", position: "FWD", rating: 78 },
    { id: "72", name: "Jordan Pickford", position: "GK", rating: 82 },
    { id: "73", name: "Abdoulaye Doucouré", position: "MID", rating: 78 },
    { id: "74", name: "James Tarkowski", position: "DEF", rating: 79 },
    { id: "75", name: "Dwight McNeil", position: "FWD", rating: 77 },
  ],
  "Nottingham Forest": [
    { id: "76", name: "Morgan Gibbs-White", position: "MID", rating: 77 },
    { id: "77", name: "Taiwo Awoniyi", position: "FWD", rating: 76 },
    { id: "78", name: "Dean Henderson", position: "GK", rating: 78 },
    { id: "79", name: "Neco Williams", position: "DEF", rating: 76 },
    { id: "80", name: "Moussa Niakhaté", position: "DEF", rating: 77 },
  ],
  "Bournemouth": [
    { id: "81", name: "Dominic Solanke", position: "FWD", rating: 77 },
    { id: "82", name: "Marcus Tavernier", position: "MID", rating: 76 },
    { id: "83", name: "Lloyd Kelly", position: "DEF", rating: 76 },
    { id: "84", name: "Neto", position: "GK", rating: 78 },
    { id: "85", name: "Philip Billing", position: "MID", rating: 77 },
  ],
  "Leicester City": [
    { id: "86", name: "James Maddison", position: "MID", rating: 82 },
    { id: "87", name: "Harvey Barnes", position: "FWD", rating: 79 },
    { id: "88", name: "Youri Tielemans", position: "MID", rating: 81 },
    { id: "89", name: "Danny Ward", position: "GK", rating: 77 },
    { id: "90", name: "Wesley Fofana", position: "DEF", rating: 80 },
  ],
  "Leeds United": [
    { id: "91", name: "Rodrigo", position: "FWD", rating: 78 },
    { id: "92", name: "Brenden Aaronson", position: "MID", rating: 77 },
    { id: "93", name: "Tyler Adams", position: "MID", rating: 77 },
    { id: "94", name: "Illan Meslier", position: "GK", rating: 79 },
    { id: "95", name: "Rasmus Kristensen", position: "DEF", rating: 76 },
  ],
  "Southampton": [
    { id: "96", name: "James Ward-Prowse", position: "MID", rating: 80 },
    { id: "97", name: "Che Adams", position: "FWD", rating: 77 },
    { id: "98", name: "Romeo Lavia", position: "MID", rating: 76 },
    { id: "99", name: "Gavin Bazunu", position: "GK", rating: 76 },
    { id: "100", name: "Duje Ćaleta-Car", position: "DEF", rating: 77 },
  ],
};

export const getTeamPlayers = (teamName: string): Player[] => {
  return mockPlayers[teamName] || [];
};

export const getAllPlayers = (): Player[] => {
  return Object.values(mockPlayers).flat();
};