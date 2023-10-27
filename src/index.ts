import axios from 'axios'
import { firefox } from 'playwright-firefox'
import { extractResult } from './helpers/extractResult'
import { ApiResult } from './types/ApiResult'

(async () => {
  console.log("Lauching...")
  const browser = await firefox.launch({
    headless: true
  })

  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    extraHTTPHeaders: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'pt-BR,pt;q=0.9',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })

  console.log("Acessing Bet365...")

  await page.goto('https://www.bet365.com/#/HO/')

  await page.waitForLoadState('networkidle')

  console.log("Acessing Virtual Sports...")

  await page.getByText('Esportes Virtuais').click()

  await page.waitForTimeout(2000)

  console.log("Acessing Virtual Football...")

  await page.locator('.vs-VirtualSplashPod').first().click()

  await page.waitForTimeout(2000)

  const leagueButtons = [
    {
      name: 'Copa do Mundo',
      id: 20120650
    }, {
      name: 'Euro Cup',
      id: 20700663,
    },
    {
      name: 'Super Liga Sul-Americana',
      id: 20120654
    },
  ]

  console.log("Acessing leagues loop...")

  while (true) {
    const allRequestResults: ApiResult[] = []

    for (const [index, leagueButton] of leagueButtons.entries()) {

      try {
        console.log('Get ' + leagueButton.name, index)
        await page.locator('.vrl-MeetingsHeaderButton').nth(index).click()
        await page.waitForTimeout(5000)
        const bt = page.locator('.vrl-MeetingsHeaderButton').nth(index)
        await page.waitForTimeout(2000)
        await page.locator('.vr-ResultsNavBarButton_Text').first().click()
        const result = await extractResult(page)

        const resultData = {
          "competition_id": leagueButton.id,
          "fixture_id": 114363700,
          "challenge_id": 70482269,
          "hour": result.hour,
          "minute": result.minute,
          "team_home": result.teamOne,
          "team_away": result.teamTwo,
          "score_home": result.teamOneScore,
          "score_away": result.teamTwoScore,
          "half_time_home": null,
          "date": result.date,
          "odd": "0"
        }

        console.log(resultData)
        allRequestResults.push(resultData)


      } catch (e) {
        console.log('Error, next league')
        try {
          await page.reload()
        } catch (e) {
          // Nothing                                            
        }
      }
    }

    try {
      console.log('send sceenshoot')

      await page.screenshot({
        path: './screenshots/screenshoot-send.png'
      })

      //Send results to your API
      await axios.post('https://example.com/api/results', allRequestResults)
    } catch (e: any) {
      console.log("Error sending results")
    }

  }


})()