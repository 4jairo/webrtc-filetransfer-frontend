
export interface UnexpectedErrorProps {
  err: string
  status: number
  statusText: string
}
export interface FileProps {
  name: string
  length: number
  lastModified: number
}


export type Directory<T> = {
  [path: string]: DirectoryContent<T>
}
export type DirectoryContent<T> = {
  files: T[],
  dirs: Directory<T>
}


export interface FetchFilesNewRequest {
  password: string
  files: FileProps[]
}
export interface FetchFilesNewResponse {
  url: string
  passwordFiles: string
}
export interface FetchFilesAddRequest {
  url: string
  passwordFiles: string
  files: FileProps[]
}
export interface FetchFilesRemoveRequest {
  url: string
  passwordFiles: string
  files: string[]
}
export interface FetchSignalingNewRequest {
  url: string
  passwordUser: string
}
export interface FetchSignalingNewResponse {
  id: string
}

export interface IntoFilePropsList<T> {
  list: T[]
  intoFileProps: (item: T) => FileProps
  onClickFile: (item: T) => void
  onClickDir: (item: string) => void
}


export type OnDownloadCompleteType = (buf: Blob) => boolean

export interface RequestedFilesStatsType {
  percent: number
  bytesPerSec: number
  remainingBytes: number
  cancelDownload: () => void
  /**
   * 
   * @param {OnDownloadCompleteType} cb
   * true === download also the file \
   * false === do not download the file \
   * when the downlaod is complete and some callback returns true (or 0 callbacks), the file will be downloaded
   *
   */
  addDownloadComplete: (cb: OnDownloadCompleteType) => string
  removeDownloadComplete: (id: string) => void
}

