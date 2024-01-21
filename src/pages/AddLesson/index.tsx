import { Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
// import { useLessonsQuery } from '../../api/lessons/getLessons'
// import axios from 'axios'

const AddLesson = () => {
  // const { data: lessonsData } = useLessonsQuery()
  const [chapter, setChapter] = useState('')

  // useEffect(() => {
  //   setChapter(updateId?.split('-')?.[1] || '')
  // }, [updateId])

  // const updateLessons = async () => {
  //   try {
  //     // const updateIdMatches = updateId?.split('-')?.[1] === chapter
  //     // await axios.post('/api/updateLessons', {
  //     //   body: JSON.stringify({
  //     //     id: (updateIdMatches && updateId) || `${Date.now()}-${chapter}`,
  //     //     lesson,
  //     //   }),
  //     // })
  //     // const temp = await (
  //     //   await axios.get(`${import.meta.env.VITE_DB_URL}/studies.json`)
  //     // ).json()

  //     // setCurrentLessons(temp)
  //     // setLesson('')
  //     setChapter('')
  //   } catch (err) {
  //     console.error(err)
  //   }
  //   // setUpdateId('')
  // }

  return (
    <Stack
      sx={{ p: 5 }}
      component="form"
      alignItems="center"
      width={1}
      spacing={2}
      onSubmit={(e) => {
        e.preventDefault()
        // lesson && updateLessons()
      }}
    >
      <Typography variant="h1" sx={{ fontSize: { mobile: 24, tablet: 30 } }}>
        Add lesson
      </Typography>
      <Stack spacing={2} width={1}>
        {/* {(lesson || chapter) && (
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                sx={{ textTransform: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setLesson('')
                  updateId && setUpdateId('')
                }}
              >
                {updateId ? 'Cancel' : 'Clear'}
              </Button>
              <Button
                type="button"
                variant="contained"
                sx={{ textTransform: 'none', cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault()
                  lesson && updateLessons()
                }}
              >
                {updateId ? 'Update' : 'Add'}
              </Button>
            </Stack>
          )} */}
        <TextField
          value={chapter}
          onChange={(e) => {
            setChapter(e.target.value)
          }}
          label="Bible chapter"
          placeholder="Bible chapter"
        />
        {/* <TextField
            inputRef={ref}
            value={lesson}
            multiline
            minRows={4}
            label="Your notes"
            onChange={(e) => {
              setLesson(e.target.value)
            }}
            placeholder="https://www.markdownguide.org/cheat-sheet/ to learn how to use markdown"
          />
          {(lesson || chapter) && (
            <Stack spacing={2} direction="row" justifyContent="flex-end">
              <Button
                type="button"
                variant="outlined"
                sx={{ textTransform: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setLesson('')
                  setChapter('')
                  updateId && setUpdateId('')
                }}
              >
                {updateId ? 'Cancel' : 'Clear'}
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ textTransform: 'none', cursor: 'pointer' }}
              >
                {updateId ? 'Update' : 'Add'}
              </Button>
            </Stack>
          )} */}
      </Stack>
    </Stack>
  )
}

export default AddLesson
