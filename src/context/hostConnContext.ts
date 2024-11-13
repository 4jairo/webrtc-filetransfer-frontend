import { writable } from "svelte/store"
import { HostConnection } from "../lib/connectionHost"
import { fetchFilesAdd, fetchFilesDelete } from "../lib/fetching"
import type { FileProps, UnexpectedErrorProps } from "../lib/types"



const createContext = () => {
  let conn: HostConnection | null = null

  const State = writable<{
    passwordUser: string
    url: string
  }>({
    passwordUser: '',
    url: '',
  })

  const connect = async (passwordUser: string, passwordFiles: string, url: string) => {
    conn = new HostConnection(url, passwordFiles, passwordUser)
    State.update(prev => ({ ...prev, passwordUser, url }))
  }

  const removeFiles = async (files: string[], setError: (err: UnexpectedErrorProps | null) => void) => {
    if (!conn) return

    try {
      await fetchFilesDelete({
        files,
        passwordFiles: conn.passwordFiles,
        url: conn.url,
      })

      setError(null)
    } catch (err) {
      setError(err as UnexpectedErrorProps)
    }
  }


  const addFiles = async (files: FileProps[]) => {
    if (!conn) return

    await fetchFilesAdd({
      files,
      passwordFiles: conn.passwordFiles,
      url: conn.url,
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return {
    subscribe: State.subscribe,
    removeFiles,
    addFiles,
    connect,
  }
}

export const HostConnConext = createContext()
 