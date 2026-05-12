/**
 * Converts legacy plain-text/markdown lessons to HTML.
 * Run with: node scripts/migrate-lessons-to-html.mjs
 * Writes output to: src/sunday-school-2ff81-migrated.json
 * Review that file before importing to Firebase.
 */

import { readFileSync, writeFileSync } from 'fs'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: true, breaks: true, linkify: true })

const inputPath = new URL('../sunday-school-2ff81-default-rtdb-export.json', import.meta.url)
const outputPath = new URL('../src/sunday-school-2ff81-migrated.json', import.meta.url)

const data = JSON.parse(readFileSync(inputPath, 'utf8'))

function normalizeLesson(text) {
  return text
    // ### Heading markers without a space: ###Verse 1 → ### Verse 1
    .replace(/^(#{1,6})([^# \n])/gm, '$1 $2')
    // *Commentary lines* — wrap bare *text that runs to end of line without closing * in italic
    // Leave properly-paired *text* alone (markdown-it handles those)
    .replace(/^\*([^*\n]+[^*])$/gm, '*$1*')
}

let converted = 0
let skipped = 0

for (const [book, chapters] of Object.entries(data.studies)) {
  for (const [chapterKey, lesson] of Object.entries(chapters)) {
    if (!lesson) continue

    if (lesson.trimStart().startsWith('<')) {
      skipped++
    } else {
      data.studies[book][chapterKey] = md.render(normalizeLesson(lesson))
      converted++
    }
  }
}

writeFileSync(outputPath, JSON.stringify(data, null, 2))
console.log(`Done. Converted: ${converted}, Already HTML (skipped): ${skipped}`)
console.log(`Output: src/sunday-school-2ff81-migrated.json`)
console.log(`Review it, then import to Firebase if it looks good.`)
