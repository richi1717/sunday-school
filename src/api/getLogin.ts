import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export const useLoginQuery = () => {
  return useQuery({
    queryKey: ['login'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DB_URL}/login.json`,
      )

      return data
    },
  })
}
