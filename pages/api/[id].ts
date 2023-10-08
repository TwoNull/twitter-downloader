import type { NextApiRequest, NextApiResponse } from "next";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { id } = req.query;
  if (typeof id != "string") {
    return res.status(400).json({ message: "malformed request" });
  }
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));
  let gt: string;
  try {
    const response: any = (
      await client.get(
        `https://twitter.com/TweetsOfCats/`,
        {
          headers: {
            'authority': 'twitter.com',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
          }
        }
      )
    ).data
    const start = response.indexOf('"gt=')+4
    const end = response.substring(response.indexOf('"gt=')+4, response.length).indexOf(";")
    gt = response.substring(start, start + end)
    console.log(gt)
  } catch (err: any) {
    console.log(err)
    return res.status(500).json({ message: "could not get guest token" });
  }
  let tweet: any;
  try {
    const variables = '{"tweetId":"' + id + '","withCommunity":false,"includePromotedContent":false,"withVoice":false}'
    const features = '{"creator_subscriptions_tweet_preview_api_enabled":true,"tweetypie_unmention_optimization_enabled":true,"responsive_web_edit_tweet_api_enabled":true,"graphql_is_translatable_rweb_tweet_is_translatable_enabled":true,"view_counts_everywhere_api_enabled":true,"longform_notetweets_consumption_enabled":true,"responsive_web_twitter_article_tweet_consumption_enabled":false,"tweet_awards_web_tipping_enabled":false,"responsive_web_home_pinned_timelines_enabled":false,"freedom_of_speech_not_reach_fetch_enabled":true,"standardized_nudges_misinfo":true,"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled":true,"longform_notetweets_rich_text_read_enabled":true,"longform_notetweets_inline_media_enabled":true,"responsive_web_graphql_exclude_directive_enabled":true,"verified_phone_label_enabled":false,"responsive_web_media_download_video_enabled":false,"responsive_web_graphql_skip_user_profile_image_extensions_enabled":false,"responsive_web_graphql_timeline_navigation_enabled":true,"responsive_web_enhance_cards_enabled":false}'
    tweet = (
      await client.get(
        `https://twitter.com/i/api/graphql/mbnjGF4gOwo5gyp9pe5s4A/TweetResultByRestId?variables=${encodeURIComponent(variables)}&features=${encodeURIComponent(features)}`,
        {
          headers: { 
            'authority': 'twitter.com', 
            'accept': '*/*', 
            'accept-language': 'en-US,en;q=0.9', 
            'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA', 
            'content-type': 'application/json', 
            'referer': 'https://twitter.com/TweetsOfCats/status/1710629064757608670', 
            'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"macOS"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-origin', 
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36', 
            'x-guest-token': gt, 
            'x-twitter-active-user': 'yes', 
            'x-twitter-client-language': 'en'
          }
        }
      )
    ).data
  } catch (err: any) {
    return res.status(500).json({ message: "tweet not found" });
  }
  try {
    const entities = tweet.data.tweetResult.result.legacy.extended_entities.media
    for (const entity in entities) {
      if (entities[entity].video_info.variants) {
        return res
          .status(200)
          .json({
            vars: entities[entity].video_info.variants,
            thumb: entities[entity].media_url_https,
            duration: entities[entity].video_info.duration_millis,
          });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "no media" });
  }
  return res.status(500).json({ message: "no video" });
}
