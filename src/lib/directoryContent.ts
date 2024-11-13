import type { DirectoryContent, FileProps } from "./types"

const defaultDirectoryContent = <T>(): DirectoryContent<T> => ({
  dirs: {},
  files: []
}) 
// file.webkitRelativePath -> files from input for directories
// file.name               -> files from input for files
export const getFileName = (file: File | FileProps) => {
  if(file instanceof File) {
    return file.webkitRelativePath || file.name
  } else {
    return file.name
  }
}

// ----- help functions 
export const compareDirectories = (tempFiles: DirectoryContent<File>, notTempFiles: DirectoryContent<File>) => {
  const temp = defaultDirectoryContent<File>()
  
  temp.files = tempFiles.files.filter((f) => { 
    return !notTempFiles.files.some((f2) => getFileName(f) === getFileName(f2))
  })

  for (const key in tempFiles.dirs) {
    if(!notTempFiles.dirs[key]) {
      temp.dirs[key] = tempFiles.dirs[key]
    } else {
      const subDir = compareDirectories(tempFiles.dirs[key], notTempFiles.dirs[key])
      if(subDir.files.length > 0 || Object.keys(subDir.dirs).length > 0) {
        temp.dirs[key] = subDir
      }
    }
  }

  return temp
}

export const mergeDirectories = (tempFiles: DirectoryContent<File>, notTempFiles: DirectoryContent<File>) => {
  notTempFiles.files = [...tempFiles.files, ...notTempFiles.files]

  for (const key in tempFiles.dirs) {
    if(!notTempFiles.dirs[key]) {
      notTempFiles.dirs[key] = tempFiles.dirs[key]
    } else {
      mergeDirectories(tempFiles.dirs[key], notTempFiles.dirs[key])
    }
  }
}

export const getFilesOnDir = <T>(obj: DirectoryContent<T>, fileName: string, edit: boolean) => {
  const filePaths = fileName.split('/')

  if(filePaths.length > 1) {
    filePaths.pop()
    let lastDirectory = obj

    for (const pathChunk of filePaths) {

      if(edit) {
        if(!lastDirectory.dirs[pathChunk]) 
          lastDirectory.dirs[pathChunk] = defaultDirectoryContent()
      } else {
        if(!lastDirectory.dirs[pathChunk]) 
          return null
      }

      lastDirectory = lastDirectory.dirs[pathChunk]
    }

    return lastDirectory.files
  } else {
    return obj.files
  }
}

export const getDirectory = <T>(obj: DirectoryContent<T>, dirName: string) => {
  if(dirName === '') return obj

  let lastDirectory = obj
  const fileChunks = dirName.split('/')

  for (const fileChunk of fileChunks) {
    if(!lastDirectory.dirs[fileChunk]) return null

    lastDirectory = lastDirectory.dirs[fileChunk]
  }

  return lastDirectory
}

export const deleteDirectory = (obj: DirectoryContent<File>, dirName: string) => {
  let lastDirectory = obj
  const fileChunks = dirName.split('/')
  const last = fileChunks.pop()!

  for (const fileChunk of fileChunks) {        
    if(!lastDirectory.dirs[fileChunk]) return

    lastDirectory = lastDirectory.dirs[fileChunk]
  }

  delete lastDirectory.dirs[last]
}

export const deleteFile = (obj: DirectoryContent<File>, file: File) => {
  const filesOnDir = getFilesOnDir(obj, getFileName(file), false)
  if(!filesOnDir) return

  const fileIdx = filesOnDir.findIndex((f) => {
    return getFileName(f) === getFileName(file)
  })

  if(fileIdx !== -1) {
    filesOnDir.splice(fileIdx, 1)
  }
}

export const iterateDirectories = (obj: DirectoryContent<File>, cb: (file: File) => void) => {
  for (const file of obj.files) {
    cb(file)
  }
  for (const subDir in obj.dirs) {
    iterateDirectories(obj.dirs[subDir], cb);
  }
}
export const toDirectoryContent = <T extends File | FileProps>(files: T[]) => {
  const temp = defaultDirectoryContent<T>()

  for (const file of files) {
    const filesOnDir = getFilesOnDir(temp, getFileName(file), true)!

    filesOnDir.push(file)
  }
  
  return temp
}
