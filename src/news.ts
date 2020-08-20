import googleNewsAPI from 'google-news-json'
import { randomInt } from './util'

interface NewsItem {
  title: string
  id: string
  url: string
  link: string
  author?: string
  created: number
  category: string[]
  content: string | null
  enclosures: string[]
}
interface News {
  title: string
  description: string
  link: string
  category: string[]
  items: NewsItem[]
}

export async function retrieveNews(): Promise<News> {
  const news = await googleNewsAPI.getNews(
    googleNewsAPI.TOP_NEWS,
    null,
    'ja-JP'
  )
  news.items = (news.items || []).map((n) => {
    delete n.description
    return n
  })
  // console.log(news)
  return news
}
// retrieveNews()
export async function randomNews(): Promise<NewsItem | undefined> {
  const news = await retrieveNews()
  if (!news || !news.items || news.items.length === 0) {
    return undefined
  }

  // console.log(users)
  // logger.debug(message)
  const index = randomInt(news.items.length)
  const item = news.items[index]
  return item
}
