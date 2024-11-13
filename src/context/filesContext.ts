import { get, writable } from "svelte/store"
import { getFileName } from "../lib/directoryContent"

const createContext = () => {
  const State = writable<{
    files: File[],
    path: string,
    temporaryPath: string,
    temporaryFiles: File[]
  }>({
    files: [],
    path: "",
    temporaryFiles: [],
    temporaryPath: ""
  })

  const setPath = (path: string) => {
    State.update((state) => ({
      ...state,
      path
    }))
  }

  const setTemporaryPath = (path: string) => {
    State.update((state) => ({
      ...state,
      temporaryPath: path
    }))
  }

  const setTemporaryFiles = (fileList: FileList) => {
    State.update((state) => {
      return {
        ...state,
        temporaryFiles: [...state.temporaryFiles, ...Array.from(fileList).filter((f) => {
          return !state.temporaryFiles.some((tf) => getFileName(tf) === getFileName(f))
        })]
      }
    })
  }

  const removeTemporaryFile = (file: File) => {
    State.update((state) => {
      return {
        ...state,
        temporaryFiles: state.temporaryFiles.filter(f => f !== file)
      }
    })
  }

  const removeTemporaryDirectory = (dirName: string) => {
    State.update((state) => {
      return {
        ...state,
        temporaryFiles: state.temporaryFiles.filter(f => {
          return f.webkitRelativePath
            ? !f.webkitRelativePath.startsWith(dirName)
            : !f.name.startsWith(dirName)
        })
      }
    })
  }

  const getFiles = () => {
    return get(State).files
  }

  const getFile = (name: string) => {
    return get(State).files.find(f => {
      return f.webkitRelativePath
        ? f.webkitRelativePath === name
        : f.name === name
    })
  }

  /// Returns files that are not in `State.files`
  const getTemporaryUniqueFiles = () => {
    const state = get(State)
    return state.temporaryFiles
      .filter(file => !state.files.some((f) => {
        return f.webkitRelativePath
          ? f.webkitRelativePath === file.webkitRelativePath
          : f.name === file.name
      }))
  }

  const moveTemporaryFiles = (files: File[]) => {
    State.update((state) => {
      return {
        ...state,
        files: [...state.files, ...files],
        temporaryFiles: [],
        temporaryPath: ""
      }
    })
  }
    
  const addFiles = (fileList: FileList) => {
    State.update((state) => {
      const files = Array.from(fileList)
        .filter((file) => !state.files.some(f => {
          return f.webkitRelativePath
            ? f.webkitRelativePath === file.webkitRelativePath
            : f.name === file.name
        }));

      return {
        ...state,
        files: [...state.files, ...files]
      }
    })
  }

  const removeFile = (file: File) => {
    State.update((state) => {
      return {
        ...state,
        files: state.files.filter(f => f !== file)
      }
    })
  }

  const removeDirectory = (dirName: string) => {
    State.update((state) => {
      return {
        ...state,
        files: state.files.filter(f => {
          return f.webkitRelativePath
            ? !f.webkitRelativePath.startsWith(dirName)
            : !f.name.startsWith(dirName)
        })
      }
    })
  }

  return {
    subscribe: State.subscribe,
    addFiles,
    getFiles,
    getFile,
    removeFile,
    removeDirectory,
    setPath,
    setTemporaryFiles,
    removeTemporaryFile,
    removeTemporaryDirectory,
    getTemporaryUniqueFiles,
    moveTemporaryFiles,
    setTemporaryPath,
  }
}

export const FilesContext = createContext()

 