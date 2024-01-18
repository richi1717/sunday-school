import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  // IconButton,
  Stack,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMemo, useState } from 'react'
import MuiMarkdown from 'markdown-to-jsx'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  filterByBook,
  // getLastBook,
  getNextAndPreviousBooks,
} from '../../utils/helpers'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { Link, useParams } from 'react-router-dom'

export default function Book() {
  const { bookName = '' } = useParams()
  // const inputEl = useRef<HTMLInputElement>(null)
  const [lesson, setLesson] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [currentLessons, setCurrentLessons] = useState({})
  console.log(lesson, updateId, setCurrentLessons)
  const { data } = useLessonsQuery()
  console.log({ data })
  const filteredByBook = useMemo(
    () => filterByBook(data, bookName),
    [data, bookName],
  )
  const previousAndNextButtons = useMemo(
    () => getNextAndPreviousBooks(bookName),
    [bookName],
  )
  console.log({ filteredByBook })
  const lastIndex = useMemo(() => filteredByBook?.length - 1, [filteredByBook])

  // const lastSubIndex = useMemo(() => filterByBook(currentLessons, bookName)?.length - 1, [currentLessons])
  console.log(lastIndex, filteredByBook, currentLessons)
  const expandedDefault = filteredByBook?.[lastIndex]?.book
  // const [expanded, setExpanded] = useState<boolean | string>(expandedDefault)
  const [subExpanded, setSubExpanded] = useState<boolean | string>(
    expandedDefault,
  )
  // console.log({ expandedDefault, lesson, updateId, lastOne: getLastBook() })

  // const deleteLessons = async (book: string, chapter: string) => {
  //   console.log(book, chapter)
  //   try {
  //     // await fetch('/api/deleteLessons', {
  //     //   method: 'POST',
  //     //   body: JSON.stringify({
  //     //     id,
  //     //   }),
  //     // })
  //     // const temp = await (
  //     //   await fetch(`${import.meta.env.VITE_DB_URL}/studies.json`)
  //     // ).json()
  //     // setCurrentLessons(temp)
  //     setCurrentLessons({})
  //   } catch (err) {
  //     console.error(err)
  //   }
  //   setUpdateId('')
  // }

  const renderPreviousAndNextButton = (next: boolean) => {
    if (previousAndNextButtons[next ? 'next' : 'previous'])
      return (
        <Button
          component={Link}
          to={`/books/${previousAndNextButtons[next ? 'next' : 'previous']}`}
          variant="contained"
          sx={{
            textTransform: 'none',
            width: 146,
          }}
        >
          {previousAndNextButtons[next ? 'next' : 'previous']}
        </Button>
      )

    return <Box sx={{ width: 146 }} />
  }

  return (
    <Stack spacing={2} padding={{ mobile: 3, tablet: 5 }}>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h1" sx={{ fontSize: { mobile: 16, tablet: 24 } }}>
          {bookName}
        </Typography>
        <Stack direction="row" justifyContent="space-between" width={1}>
          {renderPreviousAndNextButton(false)}
          {renderPreviousAndNextButton(true)}
        </Stack>
      </Stack>
      {filteredByBook.length === 0 && (
        <Stack justifyContent="center" direction="row">
          <Typography fontSize={32}>Coming soon</Typography>
        </Stack>
      )}
      {filteredByBook.map((notes) => {
        // console.log({ notes })
        return Object.keys(notes).map((note) => (
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
                    {/* {isAdmin && (
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
                    )} */}
                    <Stack
                      direction={{ mobile: 'column', tablet: 'row' }}
                      spacing={2}
                    >
                      <Typography
                        component={MuiMarkdown}
                        sx={{ 'p:first-child': { mt: 0 } }}
                        onClick={() => {
                          setLesson(note)
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
        ))
      })}
    </Stack>
  )
}
