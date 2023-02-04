import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const {id} = req.query
  if(typeof id != "string") {
    return res.status(400).json({message: 'Malformed Request'})
  }
  let tweet: any;
  try {
    tweet = (await axios.get(`https://api.twitter.com/2/timeline/conversation/${id}.json`,
      {
        headers: {
        'accept': 'text/plain, */*; q=0.01',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': `Bearer ${process.env.GLOBAL_BEARER}`,
        'origin': 'https://tweetdeck.twitter.com',
        'referer': 'https://tweetdeck.twitter.com/',
        'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
        'x-twitter-client-version': 'Twitter-TweetDeck-blackbird-chrome/4.0.220811153004 web/',
      }
    })).data.globalObjects.tweets[String(id)]
  }
  catch(err: any) {
    return res.status(500).json({message: 'No Tweet'})
  }
  try {
    const entities = tweet.extended_entities.media
    for(const entity in entities) {
      if(entities[entity].video_info.variants) {
        return res.status(200).json({vars: entities[entity].video_info.variants, thumb: entities[entity].media_url_https, duration: entities[entity].video_info.duration_millis})
      }
    }
  }
  catch(err) {
    return res.status(500).json({message: 'No Media'})
  }
  return res.status(500).json({message: 'No Video'})
}
