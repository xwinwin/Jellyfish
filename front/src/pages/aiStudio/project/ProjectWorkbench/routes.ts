export function getProjectChaptersPath(projectId: string) {
  return `/projects/${projectId}/chapters`
}

export function getChapterPrepPath(projectId: string, chapterId: string) {
  return `/projects/${projectId}/chapters/${chapterId}/prep`
}

export function getChapterStudioPath(projectId: string, chapterId: string) {
  return `/projects/${projectId}/chapters/${chapterId}/studio`
}

export function getProjectEditorPath(projectId: string) {
  return `/projects/${projectId}/editor`
}

