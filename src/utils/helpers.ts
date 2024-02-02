import booksOfTheBible from '../constants/booksOfTheBible'

type CurrentLessons = {
  [key: string]: string[]
}

export const filterByBook = (
  currentLessons: CurrentLessons,
  bookName: string,
) => {
  const byBook = currentLessons[bookName]

  if (!byBook) return []

  if (!Object.hasOwn(byBook, 'length')) {
    const keys = Object.keys(byBook)
    const lastKey = keys[keys.length - 1]

    return new Array(Number(lastKey) + 1)
      .fill(null)
      .map((_, index) => byBook[index] ?? null)
  }

  return byBook
}

export const getLastBook = (currentLessons: {
  [key: string]: { [key: string]: string }
}) => {
  const items = Object.keys(currentLessons)

  return items[items.length - 1]
}

export const getNextAndPreviousBooks = (currentBook: string) => {
  const found = booksOfTheBible.findIndex((book) => book === currentBook)

  return {
    previous: booksOfTheBible[found - 1],
    next: booksOfTheBible[found + 1],
  }
}

export const getChaptersList = (
  currentLessons: CurrentLessons,
  book: string,
) => {
  const chaptersArr = filterByBook(currentLessons, book)

  return chaptersArr.map((chapter, idx) => chapter && idx).filter((c) => c)
}

export const getNextAndPreviousChapter = (
  chaptersArr: string[],
  chapter: string,
) => {
  if (chaptersArr.length === 0) return { previous: undefined, next: undefined }

  const chapters = chaptersArr
    .map((chapter, idx) => chapter && idx)
    .filter((c) => c)

  const found = chapters.findIndex((chap) => chap === Number(chapter))

  return {
    previous: chapters[found - 1],
    next: chapters[found + 1],
  }
}

export const lastChapterOfPreviousBook = (chapters: string[]) => {
  const length = chapters.length

  if (length > 0) {
    return chapters.length - 1
  }

  return 1
}

export const getOrderedListOfBooksFromLessons = (
  currentLessons: CurrentLessons,
) => booksOfTheBible.filter((book) => currentLessons[book])

export const getCookie = () => {
  const cookieArr = document.cookie.split(';')
  const found = cookieArr.find((cookie) => cookie.includes('loggedIn'))

  return found?.split('=')[1]
}
