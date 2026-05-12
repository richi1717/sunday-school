import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

// chapters keyed by chapter number string: { "1": "text", "2": "text", ... }
export type ChapterMap = { [chapter: string]: string }
export type LessonsData = { [book: string]: ChapterMap }

export const useLessonsQuery = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async (): Promise<LessonsData> => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DB_URL}/studies.json`,
      )
      return data as LessonsData
    },
  })
}
