import booksOfTheBible from '../constants/booksOfTheBible'
import type { ChapterMap, LessonsData } from '../api/lessons/getLessons'

export const filterByBook = (
  currentLessons: LessonsData | undefined,
  bookName: string,
): ChapterMap => currentLessons?.[bookName] ?? {}

// Returns chapter numbers sorted ascending that have content
export const getChaptersList = (
  currentLessons: LessonsData | undefined,
  book: string,
): number[] =>
  Object.keys(filterByBook(currentLessons, book))
    .map(Number)
    .sort((a, b) => a - b)

export const getNextAndPreviousBooks = (currentBook: string) => {
  const found = booksOfTheBible.findIndex((book) => book === currentBook)
  return {
    previous: booksOfTheBible[found - 1],
    next: booksOfTheBible[found + 1],
  }
}

export const getNextAndPreviousChapter = (
  chapters: ChapterMap,
  chapter: string,
) => {
  const sorted = Object.keys(chapters)
    .map(Number)
    .sort((a, b) => a - b)
  const found = sorted.indexOf(Number(chapter))
  return {
    previous: sorted[found - 1],
    next: sorted[found + 1],
  }
}

// Returns the last chapter number in the book, used for cross-book navigation
export const lastChapterOfPreviousBook = (chapters: ChapterMap): number => {
  const sorted = Object.keys(chapters)
    .map(Number)
    .sort((a, b) => a - b)
  return sorted[sorted.length - 1] ?? 1
}

export const getOrderedListOfBooksFromLessons = (
  currentLessons: LessonsData | undefined,
): (typeof booksOfTheBible)[number][] => {
  if (!currentLessons) return []
  return booksOfTheBible.filter((book) => currentLessons[book])
}

export const getCookie = () => {
  const cookieArr = document.cookie.split(';')
  const found = cookieArr.find((cookie) => cookie.includes('loggedIn'))
  return found?.split('=')[1]
}
