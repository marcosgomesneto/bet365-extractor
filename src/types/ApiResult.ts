export interface ApiResult {
  competition_id: number
  fixture_id: number
  challenge_id: number
  hour: number
  minute: number
  team_home: string
  team_away: string
  score_home: number
  score_away: number
  half_time_home: null
  date: Date
  odd: string
}
