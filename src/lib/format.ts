import type { FileProps } from "./types";

const pastTime = (dateNum: number) => {
  const minsSinceDate = (Date.now() - dateNum) / (1000 * 60)

  const formatIfSingular = (num: number, format: string) => {
    return `${num} ${format}${num === 1 ? '' : 's'} ago`
  }

  // year
  if (minsSinceDate < 1) {
    return 'Now';
  } else if (minsSinceDate < 60) {
    return formatIfSingular(Math.floor(minsSinceDate), 'minute');
  } else if (minsSinceDate < 24 * 60) {
    return formatIfSingular(Math.floor(minsSinceDate / 60), 'hour')
  } else if (minsSinceDate < 30 * 24 * 60) {
    return formatIfSingular(Math.floor(minsSinceDate / (24 * 60)), 'day')
  } else if (minsSinceDate < 12 * 30 * 24 * 60) {
    return formatIfSingular(Math.floor(minsSinceDate / (30 * 24 * 60)), 'month')
  }
  
  return formatIfSingular(Math.floor(minsSinceDate / (12 * 30 * 24 * 60)), 'year')
}


export function formatDate(dateNum: number) {
  const date = new Date(dateNum)
  return `${date.toLocaleString()} (${pastTime(dateNum)})`
}


const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
export function formatByteUnity(num: number) {
  let unitIndex = 0
  while (num >= 1000 && unitIndex < units.length) {
    num /= 1000
    unitIndex++
  }

  const unit = units[unitIndex]
  return `${num.toFixed(2)} ${unit}`
}

/// from 'folder1/folder2/file.txt' to 'file.txt'
export function formatFileName(name: string) {
  return name.split('/').pop()!
}


export function toFileProps(file: File): FileProps {
  return {
    name: file.webkitRelativePath || file.name,
    lastModified: file.lastModified,
    length: file.size
  }
}