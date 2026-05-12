import { useState, useMemo } from 'react'
import {
  Card,
  CardActionArea,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { getOrderedListOfBooksFromLessons } from '../../utils/helpers'

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getSnippet(text: string, query: string, radius = 120): string {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, radius * 2)
  const start = Math.max(0, idx - radius)
  const end = Math.min(text.length, idx + query.length + radius)
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '')
}

function HighlightedSnippet({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <Box component="mark" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', borderRadius: '2px', px: 0.3 }}>
        {text.slice(idx, idx + query.length)}
      </Box>
      {text.slice(idx + query.length)}
    </>
  )
}

import { Box } from '@mui/material'

interface SearchResult {
  book: string
  chapter: string
  snippet: string
}

export default function Search() {
  const [query, setQuery] = useState('')
  const { data: lessonsData } = useLessonsQuery()
  const navigate = useNavigate()

  const results = useMemo((): SearchResult[] => {
    const q = query.trim()
    if (q.length < 2 || !lessonsData) return []

    const orderedBooks = getOrderedListOfBooksFromLessons(lessonsData)
    const matches: SearchResult[] = []

    for (const book of orderedBooks) {
      const chapters = lessonsData[book]
      if (!chapters) continue
      const sortedChapters = Object.keys(chapters).sort((a, b) => Number(a) - Number(b))
      for (const chapter of sortedChapters) {
        const text = stripHtml(chapters[chapter])
        if (text.toLowerCase().includes(q.toLowerCase())) {
          matches.push({ book, chapter, snippet: getSnippet(text, q) })
        }
      }
    }

    return matches
  }, [query, lessonsData])

  return (
    <Stack
      sx={{
        py: { mobile: 2, tablet: 4 },
        px: { mobile: 3, tablet: 4 },
        width: 1,
        maxWidth: 'desktop',
      }}
      spacing={3}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: { mobile: 24, tablet: 30 }, textAlign: 'center' }}
      >
        Search
      </Typography>

      <TextField
        autoFocus
        fullWidth
        placeholder="Search all lessons…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {query.trim().length >= 2 && (
        <Typography variant="body2" color="text.secondary">
          {results.length} {results.length === 1 ? 'result' : 'results'}
        </Typography>
      )}

      <Stack spacing={2}>
        {results.map(({ book, chapter, snippet }) => (
          <Card key={`${book}-${chapter}`} variant="outlined">
            <CardActionArea
              onClick={() => navigate(`/${book}/${chapter}`)}
              sx={{ p: 2 }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {book} {chapter}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <HighlightedSnippet text={snippet} query={query.trim()} />
              </Typography>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
