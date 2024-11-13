<script lang="ts">
  import { getDirectory, toDirectoryContent } from "../../lib/directoryContent";
  import { formatByteUnity, formatDate, formatFileName } from "../../lib/format";
  import { getIconForFile, getIconForFolder } from "../../lib/icons/getIcon";
  import type { FileProps, IntoFilePropsList } from "../../lib/types";
    
  export let fileListProps: IntoFilePropsList<any>
  export let onClickMsg: string
  export let onClickDirDesc: string | null = null
  export let hoverRowColor: string
  export let path: string
  export let setPath: (p: string) => void

  const addToPath = (p: string) => {
    return path
      ? `${path}/${p}`
      : p
  }

  const popPath = () => {
    const pathArr = path.split('/')
    pathArr.pop()
    setPath(pathArr.join('/'))
  }

  const onMouseLeaveEnter = (e: MouseEvent & {currentTarget: EventTarget & HTMLTableCellElement}, bgc: string) => {
    if(e.currentTarget.parentElement) {
      e.currentTarget.parentElement.style.backgroundColor = bgc;
    }
  }

  const getFileAndItem = (item: any) => {
    return {
      item,
      file: fileListProps.intoFileProps(item)
    }
  }

  const sortDirectories = (a: string, b: string) => {
    if(sortKey === 'name') {
      return sortDirection * a.localeCompare(b)
    }

    return 0
  }

  type FileAndItem = { file: FileProps, item: any }
  const sortFiles = ({ file: a }: FileAndItem, { file: b }: FileAndItem) => {
    if(sortKey === 'name') return a.name.localeCompare(b.name) * sortDirection
    if(sortKey === 'size') return (a.length - b.length) * sortDirection
    if(sortKey === 'lastModified') return (a.lastModified - b.lastModified) * sortDirection
    return 0
  }

  const setSortKey = (key: string) => {
    sortDirection *= -1
    sortKey = key
  }

  $: files = toDirectoryContent(fileListProps.list)
  $: currentDir = getDirectory(files, path)
  let sortKey = ''
  let sortDirection = 1

  const cols = [
    { key: 'name', label: 'Name' },
    { key: 'size', label: 'Size' },
    { key: 'lastModified', label: 'Last Modified' },
  ]
</script>


<main>
  <table>
    <thead>
      <tr>
        {#each cols as { key, label }}
          <th on:click={() => setSortKey(key)}>
            <span>{label}</span> 

            {#if cols.every((c) => c.key !== sortKey)}
              <span>&udarr;</span>
            {:else if sortKey === key}
              <span>{@html sortDirection === 1 ? '&darr;' : '&uarr;'}</span>
            {:else}
              <span></span>
            {/if}

          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if path}
        <tr on:click={popPath} class="dir">
          <td colspan="4">&larr; Back</td>
        </tr>
      {/if}
      

      {#key [sortKey, sortDirection]}
      {#each Object.keys(currentDir?.dirs || {}).sort(sortDirectories) as dirName}
        <tr on:click={() => setPath(addToPath(dirName))} class="dir">
          <td>
            <div class="fileName">
              <img src="/icons/{getIconForFolder(dirName)}" alt="folder icon" width="24" height="24" />
              <p>{dirName}</p>
            </div>
          </td>
          <td></td>
          <td></td>
          <td 
            class="op"
            title={onClickDirDesc}
            on:mouseenter={(e) => onMouseLeaveEnter(e, hoverRowColor)} 
            on:mouseleave={(e) => onMouseLeaveEnter(e, '')}
            on:click|stopPropagation={() => fileListProps.onClickDir(addToPath(dirName))}
          >
            {onClickMsg}
          </td>
        </tr>
      {/each}

      {#each (currentDir?.files || []).map(getFileAndItem).sort(sortFiles) as { file, item }}
        {@const fileName = formatFileName(file.name)}

        <tr>
          <td>
            <div class="fileName">
              <img src="/icons/{getIconForFile(fileName)}" alt="folder icon" width="24" height="24" />
              <p>{fileName}</p>
            </div>
          </td>
          <td>{formatByteUnity(file.length)}</td>
          <td>{formatDate(file.lastModified)}</td>
  
          <td 
            class="op"
            on:mouseenter={(e) => onMouseLeaveEnter(e, hoverRowColor)} 
            on:mouseleave={(e) => onMouseLeaveEnter(e, '')}
            on:click={() => fileListProps.onClickFile(item)}
          >
            {onClickMsg}
          </td>
        </tr>
      {/each}
      {/key}
    </tbody>
  </table>
</main>

<style>
  table {
    width: 100%;
    table-layout: auto;
    border-collapse: collapse;
  }
  table th {
    padding: 8px;
    cursor: pointer;
  }
  table th span {
    margin: 5px
  }

  .fileName {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  tbody tr, tbody td {
    border: 1px solid #8a8a8a;
    padding: 0.5rem;
  }

  .dir {
    cursor: pointer;
  }
  
  .op {
    cursor: pointer;
    text-align: center;
  }

  tbody > tr {
    transition: background-color 0.15s;
  }

  tbody tr:not(.op):hover {
    background-color: #23243d
  }
</style>

