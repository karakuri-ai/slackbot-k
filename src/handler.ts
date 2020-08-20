import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { randomNews } from './news'
import { fetchRandomChannelUsers } from './api'
import { App, ExpressReceiver } from '@slack/bolt'

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  processBeforeResponse: true,
})
const slack = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
  processBeforeResponse: true,
})
const watchingMessage = process.env.WATCHING_MESSAGE || ''
// ------------------------
// Application Logic
// ------------------------
slack.command('/news', async ({ logger, ack, say, command, context }) => {
  const token = context.botToken
  const channel = command.channel_id
  try {
    await ack()
    const item = await randomNews()
    if (!item) {
      logger.info('no news!')
      return
    }

    const res = await say({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `<${item.link}|${item.title}>`,
          },
        },
      ],
    } as any)
    // console.log(res.ts)

    const users = await fetchRandomChannelUsers(slack, token, channel)

    await say({
      thread_ts: res.ts as any,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `どう思う？\n ${users.map((u) => `<@${u.name}>`)}`,
          },
        },
      ],
    } as any)
  } catch (e) {
    logger.error(JSON.stringify(e))
    // await ack(`:x: Failed to post a message (error: ${e})`)
  }
})

slack.message(watchingMessage, async ({ context, message, logger, say }) => {
  const token = context.botToken
  const channel = message.channel
  const item = await randomNews()
  if (!item) {
    logger.info('no news!')
    return
  }

  const res = await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${item.link}|${item.title}>`,
        },
      },
    ],
  } as any)
  // console.log(res.ts)

  const users = await fetchRandomChannelUsers(slack, token, channel)
  await say({
    thread_ts: res.ts as any,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `どう思う？\n ${users.map((u) => `<@${u.name}>`)}`,
        },
      },
    ],
  } as any)
})
// ------------------------
// AWS Lambda handler
// ------------------------
import * as awsServerlessExpress from 'aws-serverless-express'

slack.error(async (error) => {
  console.error(JSON.stringify(error))
})
const server = awsServerlessExpress.createServer(expressReceiver.app)
export const events: APIGatewayProxyHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
}
