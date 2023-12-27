import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export const useLessonsQuery = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DB_URL}/studies.json`,
      )

      return data
    },
  })
}
