import type { EditorOptions } from '@tiptap/core'
import { useCallback, useEffect, useRef } from 'react'
import { LoadingButton } from '@mui/lab'
import { Stack } from '@mui/material'
import { RichTextEditor, insertImages, type RichTextEditorRef } from 'mui-tiptap'
import EditorMenuControls from './EditorMenuControls'
import useExtensions from './useExtensions'

function fileListToImageFiles(fileList: FileList): File[] {
  return Array.from(fileList).filter((file) =>
    file.type.toLowerCase().startsWith('image/'),
  )
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function filesToImageAttrs(
  files: File[],
): Promise<{ src: string; alt: string }[]> {
  return Promise.all(
    files.map(async (file) => ({
      src: await fileToBase64(file),
      alt: file.name,
    })),
  )
}

interface MuiTextEditorProps {
  value: string
  onChange: (val: string) => void
  onBlur?: () => void
  disabled?: boolean
  loading?: boolean
  errorMessage?: string
}

export default function MuiTextEditor({
  value,
  onChange,
  onBlur,
  disabled,
  loading,
}: MuiTextEditorProps) {
  const extensions = useExtensions({ placeholder: 'Your notes...  📝' })
  const rteRef = useRef<RichTextEditorRef>(null)

  useEffect(() => {
    const editor = rteRef.current?.editor
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false)
    }
  }, [value])

  useEffect(() => {
    const editor = rteRef.current?.editor
    if (!editor) return
    const handleUpdate = () => onChange(editor.getHTML())
    const handleBlur = () => onBlur?.()
    editor.on('update', handleUpdate)
    editor.on('blur', handleBlur)
    return () => {
      editor.off('update', handleUpdate)
      editor.off('blur', handleBlur)
    }
  }, [onChange, onBlur])

  const handleNewImageFiles = useCallback(
    async (files: File[], insertPosition?: number) => {
      const editor = rteRef.current?.editor
      if (!editor) return
      const images = await filesToImageAttrs(files)
      insertImages({ editor, images, position: insertPosition })
    },
    [],
  )

  const handleDrop: NonNullable<EditorOptions['editorProps']['handleDrop']> =
    useCallback(
      (view, event) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) return false
        const imageFiles = fileListToImageFiles(event.dataTransfer.files)
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos
          handleNewImageFiles(imageFiles, insertPosition)
          event.preventDefault()
          return true
        }
        return false
      },
      [handleNewImageFiles],
    )

  const handlePaste: NonNullable<EditorOptions['editorProps']['handlePaste']> =
    useCallback(
      (_view, event) => {
        if (!event.clipboardData) return false
        const pastedImageFiles = fileListToImageFiles(event.clipboardData.files)
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles)
          return true
        }
        return false
      },
      [handleNewImageFiles],
    )

  const onUploadFiles = useCallback(
    (files: File[]) => filesToImageAttrs(files),
    [],
  )

  return (
    <RichTextEditor
      ref={rteRef}
      extensions={extensions}
      content={value || ''}
      editorProps={{
        handleDrop,
        handlePaste,
      }}
      renderControls={() => (
        <EditorMenuControls onUploadFiles={onUploadFiles} />
      )}
      RichTextFieldProps={{
        variant: 'outlined',
        footer: (
          <Stack
            direction="row"
            sx={{
              borderTopStyle: 'solid',
              borderTopWidth: 1,
              borderTopColor: (theme) => theme.palette.divider,
              py: 1,
              px: 1.5,
            }}
          >
            <LoadingButton
              fullWidth
              loading={loading}
              type="submit"
              variant="contained"
              sx={{ textTransform: 'none' }}
              disabled={disabled}
            >
              Update
            </LoadingButton>
          </Stack>
        ),
      }}
    />
  )
}
