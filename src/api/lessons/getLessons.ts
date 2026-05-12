import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

// chapters keyed by chapter number string: { "1": "text", "2": "text", ... }
export type ChapterMap = { [chapter: string]: string }
export type LessonsData = { [book: string]: ChapterMap }

// Firebase returns consecutive integer keys as arrays — convert to ChapterMap and drop nulls
function normalizeStudies(raw: Record<string, unknown>): LessonsData {
  const result: LessonsData = {}
  for (const [book, chapters] of Object.entries(raw)) {
    const entries = Array.isArray(chapters)
      ? chapters.map((content, idx) => [String(idx), content] as const)
      : Object.entries(chapters as Record<string, unknown>)
    result[book] = Object.fromEntries(
      entries.filter(([, content]) => content != null),
    ) as ChapterMap
  }
  return result
}

export const useLessonsQuery = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async (): Promise<LessonsData> => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DB_URL}/studies.json`,
      )
      return normalizeStudies(data)
    },
  })
}
