import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export type StudiesMetaData = { [book: string]: { [chapter: string]: string } }

export const useStudiesMetaQuery = () => {
  return useQuery({
    queryKey: ['studiesMeta'],
    queryFn: async (): Promise<StudiesMetaData> => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DB_URL}/studiesMeta.json`,
      )
      return data ?? {}
    },
  })
}
