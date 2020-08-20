import dotenv from 'dotenv'
import { App } from '@slack/bolt'
import { randomNews } from './news'
import { postMessage, fetchRandomChannelUsers } from './api'

dotenv.config()
// console.log(process.env)
const token = process.env.SLACK_BOT_TOKEN || ''
const slack = new App({
  token,
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
})

const channel = process.env.SLACK_TARGET_CHANELL || ''

async function main() {
  const item = await randomNews()
  if (!item) {
    console.info('no news!')
    return
  }
  const res = await postMessage(slack, token, channel, {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${item.link}|${item.title}>`,
        },
      },
    ],
  })
  const users = await fetchRandomChannelUsers(slack, token, channel)
  // console.log(users.map((u) => u.name))
  await postMessage(slack, token, channel, {
    thread_ts: res?.ts as any,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `どう思う？\n ${users.map((u) => `<@${u.name}>`)}`,
        },
      },
    ],
  })
}
main()
