import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMemo, useRef, useState } from 'react'
import MuiMarkdown from 'markdown-to-jsx'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { filterByBook } from './helpers'
import AdminText from './components/AdminText'
import { useLessonsQuery } from '../../api/lessons/getLessons'

interface LessonsPropTypes {
  isAdmin: boolean
}

export default function Lessons({ isAdmin }: LessonsPropTypes) {
  const inputEl = useRef<HTMLInputElement>(null)
  const [lesson, setLesson] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [currentLessons, setCurrentLessons] = useState({})
  const { data, isLoading } = useLessonsQuery()
  console.log({ data })
  const lastIndex = useMemo(
    () => filterByBook(currentLessons)?.length - 1,
    [currentLessons],
  )
  // const lastSubIndex = useMemo(() => filterByBook(currentLessons)?.length - 1, [currentLessons])
  console.log(lastIndex, filterByBook(currentLessons), currentLessons)
  const expandedDefault = filterByBook(currentLessons)?.[lastIndex]?.book
  const [expanded, setExpanded] = useState<boolean | string>(expandedDefault)
  const [subExpanded, setSubExpanded] = useState<boolean | string>(
    expandedDefault,
  )
  console.log({ expandedDefault })
  if (isLoading) return <div>loaddddddddddddd offf</div>

  const deleteLessons = async (book: string, chapter: string) => {
    console.log(book, chapter)
    try {
      // await fetch('/api/deleteLessons', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     id,
      //   }),
      // })
      // const temp = await (
      //   await fetch(`${import.meta.env.VITE_DB_URL}/studies.json`)
      // ).json()
      // setCurrentLessons(temp)
      setCurrentLessons({})
    } catch (err) {
      console.error(err)
    }
    setUpdateId('')
  }

  return (
    <Stack spacing={2} padding={{ mobile: 3, tablet: 5 }}>
      {filterByBook(currentLessons).map((item) => {
        const { book, notes } = item
        // console.log({ book, notes })
        return (
          <Accordion
            key={book}
            expanded={expanded === book}
            onChange={(_, isExpanded: boolean) => {
              setExpanded(isExpanded ? book : false)
            }}
            TransitionProps={{ unmountOnExit: true }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {book}
            </AccordionSummary>
            {Object.keys(notes).map((note) => {
              // console.log({ note, notty: notes[note] })
              return (
                <AccordionDetails key={note}>
                  <Accordion
                    expanded={subExpanded === note}
                    onChange={(_, isSubExpanded: boolean) => {
                      setSubExpanded(isSubExpanded ? note : false)
                    }}
                    TransitionProps={{ unmountOnExit: true }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      Chapter {note}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="row" spacing={2}>
                        <Stack
                          direction={{ mobile: 'row', tablet: 'row' }}
                          spacing={2}
                        >
                          {isAdmin && (
                            <Stack
                              direction="row"
                              sx={{ alignSelf: 'flex-start', pt: 0.5 }}
                            >
                              <IconButton
                                type="button"
                                sx={{
                                  textTransform: 'none',
                                  cursor: 'pointer',
                                  p: 0,
                                }}
                                onClick={() => deleteLessons(book, note)}
                              >
                                <DeleteForeverIcon sx={{ height: 16 }} />
                              </IconButton>
                              <IconButton
                                type="button"
                                sx={{
                                  textTransform: 'none',
                                  cursor: 'pointer',
                                  p: 0,
                                }}
                                onClick={() => {
                                  setLesson(note[1])
                                  setUpdateId(note[0])
                                  inputEl.current?.focus()
                                }}
                              >
                                <EditIcon sx={{ height: 12 }} />
                              </IconButton>
                            </Stack>
                          )}
                          <Stack
                            direction={{ mobile: 'column', tablet: 'row' }}
                            spacing={2}
                          >
                            <Typography
                              component={MuiMarkdown}
                              sx={{ 'p:first-child': { mt: 0 } }}
                              onClick={() => {
                                setLesson(notes[note])
                                setUpdateId(note[0])
                              }}
                            >
                              {notes[note]}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              )
            })}
          </Accordion>
        )
      })}
      {isAdmin && (
        <AdminText
          // setCurrentLessons={setCurrentLessons}
          lesson={lesson}
          setLesson={setLesson}
          updateId={updateId}
          setUpdateId={setUpdateId}
          ref={inputEl}
        />
      )}
    </Stack>
  )
}
