import fileExtensions from "./icons/fileExtensions"
import fileNames from "./icons/fileNames"
import folderNames from "./icons/folderNames"

export const getIconForFolder = (folderName: string) => {
  const folderIcon = folderNames[folderName]
  if(folderIcon) {
    return `folder_${folderIcon}.svg`
  }

  return "folder.svg"
}

export const getIconForFile = (fileName: string) => {
  const exactName = fileNames[fileName]
  if(exactName) {
    return `${exactName}.svg`
  }

  const fileChunks = fileName.split(".")
  
  while (fileChunks.length > 1) {
    fileChunks.shift()
    
    const extension = fileChunks.join(".")
    const icon = fileExtensions[extension]
    if(icon) {
      return `${icon}.svg`
    }
  }
  
  return "file.svg"
}