import { Page } from "playwright-firefox"

interface Result {
  hour: number
  minute: number
  teamOne: string
  teamTwo: string
  teamOneScore: number
  teamTwoScore: number
  date: Date
}

export const extractResult = async (page: Page): Promise<Result> => {
  const time = await page
    .locator(".vrr-FixtureDetails_Event")
    .first()
    .textContent()
  const teamOne = await page
    .locator(".vrr-HTHTeamDetails_TeamOne")
    .first()
    .textContent()
  const teamTwo = await page
    .locator(".vrr-HTHTeamDetails_TeamTwo")
    .first()
    .textContent()
  const score = await page
    .locator(".vrr-HTHTeamDetails_Score")
    .first()
    .textContent()

  if (!time || !teamOne || !teamTwo || !score)
    throw new Error("Failed to read data.")

  const [, hour, minute] = time.match(/- ([0-9]+)\.([0-9]+)/i)!
  const [, teamOneScore, teamTwoScore] = score.match(/([0-9]+) - ([0-9]+)/i)!
  const date = new Date()
  date.setHours(date.getHours() + 4)
  date.setHours(+hour, +minute, 0, 0)


  return {
    hour: +hour,
    minute: +minute,
    teamOne,
    teamTwo,
    teamOneScore: +teamOneScore,
    teamTwoScore: +teamTwoScore,
    date,
  }
}
