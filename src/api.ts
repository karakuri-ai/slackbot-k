/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { App } from '@slack/bolt'
import { shuffle } from './util'

export async function fetchChannelMembers(
  slack: App,
  token: string,
  channel: string
): Promise<string[]> {
  try {
    const result = await slack.client.conversations.members({
      token,
      channel,
    })

    return (result.members || []) as string[]
  } catch (e) {
    console.error(e)
    return []
  }
}

export async function fetchUsers(slack: App, token: string): Promise<any[]> {
  try {
    // Call the users.list method using the built-in WebClient
    const result = await slack.client.users.list({
      token,
    })

    return (result.members || []) as any[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function postMessage(
  slack: App,
  token: string,
  channel: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  message: any
) {
  message.token = token
  message.channel = channel
  try {
    const res = await slack.client.chat.postMessage(message)
    // console.log(res)
    return res
  } catch (e) {
    console.error(e)
    return null
  }
}

function isUser(u: any) {
  return !u.is_bot && !u.profile?.always_active
}

export async function fetchRandomChannelUsers(
  slack: App,
  token: string,
  channel: string,
  limit: number = 4
) {
  try {
    const userIdList = await fetchChannelMembers(slack, token, channel)
    const users = await fetchUsers(slack, token)
    const channelUsers = users
      .filter((u) => userIdList.includes(u.id))
      .filter(isUser)
    if (channelUsers.length > limit) {
      return shuffle(channelUsers).slice(0, 4)
    }
    return shuffle(channelUsers)
  } catch (e) {
    console.error(e)
    return []
  }
}
