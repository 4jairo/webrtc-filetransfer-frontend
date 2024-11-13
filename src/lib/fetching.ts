import type {
  FetchFilesAddRequest,
  FetchFilesNewRequest,
  FetchFilesNewResponse,
  FetchFilesRemoveRequest,
  FetchSignalingNewRequest,
  FetchSignalingNewResponse,
  FileProps,
  UnexpectedErrorProps
} from "./types"


const handleFetchResponse = async (response: Response) => {
  if (!response.ok) {
    const { status, statusText } = response
    const data = await response.text()
    throw { err: data, status, statusText } as UnexpectedErrorProps
  }
}

const handleVoid = async (response: Response) => {
  await handleFetchResponse(response)
}
const handleJson = async <T>(response: Response) => {
  await handleFetchResponse(response)
  return response.json() as Promise<T>
}
// const handleBlob = async (response: Response) => {
//   await handleFetchResponse(response)
//   return response.blob()
// }

const handleCatch = (e: TypeError | UnexpectedErrorProps) => {
  if (e instanceof TypeError) throw {
    err: e.message,
    status: 0,
    statusText: 'Connection error',
  } as UnexpectedErrorProps
  
  throw e
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const API_WS_URL = `${API_BASE_URL}/ws`


export const fetchFilesCreate = async (body: FetchFilesNewRequest) => {
  const reqProps = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }

  return fetch(`${API_BASE_URL}/files/new`, reqProps)
    .then(handleJson<FetchFilesNewResponse>)
    .catch(handleCatch)
}

export const fetchFilesAdd = async (body: FetchFilesAddRequest) => {
  const reqProps = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }

  return fetch(`${API_BASE_URL}/files/add`, reqProps)
    .then(handleVoid)
    .catch(handleCatch)
}

export const fetchFilesDelete = async (body: FetchFilesRemoveRequest) => {
  const reqProps = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }

  return fetch(`${API_BASE_URL}/files/remove`, reqProps)
    .then(handleVoid)
    .catch(handleCatch)
}

export const fetchFilesGet = async (url: string) => {  
  return fetch(`${API_BASE_URL}/files/${url}`)
    .then(handleJson<FileProps[]>)
    .catch(handleCatch)
}


export const fetchNewSignaling = async (body: FetchSignalingNewRequest) => {
  const reqProps = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }

  return fetch(`${API_BASE_URL}/signaling/new`, reqProps)
    .then(handleJson<FetchSignalingNewResponse>)
    .catch(handleCatch)
}

// const fetchMethods = {
//   files: {
//     create: fetchFilesNew,
//     add: fetchFilesAdd,
//     delete: fetchFilesDelete,
//     get: fetchFilesGet
//   },
//   signaling: {
//     create: fetchNewSignaling
//   }
// }