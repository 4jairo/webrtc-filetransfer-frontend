<script lang="ts">
  import { ClientConnContext, ConnectionState } from "../../context/clientConnContext";
  import { FilesContext } from "../../context/filesContext";
  import { ClientStatisticsContext } from "../../context/statisticsContext";
  import { fetchFilesGet } from "../../lib/fetching";
  import { OnDisk } from "../../lib/fileReciever/common";
  import { formatFileName } from "../../lib/format";
  import type { FileProps, IntoFilePropsList, UnexpectedErrorProps } from "../../lib/types";
  import ErrorSection from "../errorSection.svelte";
  import FileTable from "../fileList/fileTable.svelte";
  import EyeIcon from "../icons/eyeIcon.svelte";
  import EyeSlashIcon from "../icons/eyeSlashIcon.svelte";
  import LoadingGif from "../icons/loadingGif.svelte";
  import css from '../inputContainer.module.css';
  import StatsCard from "../stats/clientStatsCard.svelte";
  import SwitchBtn from "./switchBtn.svelte";

  export let url: string
  
  const onClickFile = async (file: FileProps) => {
    ClientConnContext.downloadFile(file)

    if(clientConnCtx.connState === ConnectionState.Connected) {
      error = null
    } else {
      error = { err: "Not connected", status: 0, statusText: "Not connected" }
      const inputPasswordElmt = document.getElementById("inputPassword") as HTMLInputElement
      inputPasswordElmt.focus()

      //TODO: rm files works ??????
    }
  }

  const onClickDir = async (dir: string) => {
    const filesOnDir = files.filter((f) => {
      return f.name.startsWith(dir)
    })
    console.log(files, filesOnDir)
    ClientConnContext.downloadFilesAsZip(dir, filesOnDir, compressionLevel)

    if(clientConnCtx.connState === ConnectionState.Connected) {
      error = null
    } else {
      error = { err: "Not connected", status: 0, statusText: "Not connected" }
      const inputPasswordElmt = document.getElementById("inputPassword") as HTMLInputElement
      inputPasswordElmt.focus()
    }
  }

  const onConnect = () => {
    ClientConnContext.connect(url, inputPassword, (e) => error = e)
  }


  const getFileList = (list: FileProps[]) => {
    const fileList: IntoFilePropsList<FileProps> = {
      list,
      intoFileProps: (item: FileProps) => item,
      onClickFile,
      onClickDir
    }
    return fileList
  }

  const getFiles = async (url: string) => {
    try {
      const result = await fetchFilesGet(url)
      error = null
      files = result
      return result
    } catch (err) {
      console.log(err)
      error = err as UnexpectedErrorProps
      throw err
    }
  }

  const getStatusColor = (s: ConnectionState) => {
    switch (s) {
      case ConnectionState.Connected:
        return '#233d24' // green
      case ConnectionState.Connecting:
        return 'yellow'
      case ConnectionState.WaitingPassword:
        return ''
    }
  }

  const onDiskCompatible = OnDisk.isCompatible()
  let files: FileProps[] = []
  $: console.log(files)
  let error: UnexpectedErrorProps | null = null
  let inputPassword = ""
  let showPassword = false
  let fetchFiles = getFiles(url)
  let compressionLevel = 5
  $: filesCtx = $FilesContext
  $: clientConnCtx = $ClientConnContext
  $: clientStatisticsCtx = $ClientStatisticsContext
</script>

<main>
  {#if error}
    <ErrorSection err={{
      'There was an error': error.err,
      'Status code': error.status,
      'Status text': error.statusText
    }} />
  {/if}

  <section style="opacity: {onDiskCompatible ? '100%' : '40%'};">
    <div class={css.title}>
      <h3>Memory efficient</h3>

      <SwitchBtn 
        firstChecked={OnDisk.enabled} 
        setChecked={(c) => OnDisk.enabled = c} 
        disabled={!onDiskCompatible} 
      />
    </div>

    <p>When this switch is enabled, the files will be saved directly on disk instead of using memory</p>
    <p>This option is not compatible with {onDiskCompatible ? 'some browsers' : 'this browser'}</p>
    <p>Note that if this option is disabled, the browser will need the equivalent memory ammount of the file size</p>
  </section>

  <section>
    <h3>
      Connection State:
      <code style="background-color: {getStatusColor(clientConnCtx.connState)}; margin: 1rem">
        <b>{clientConnCtx.connState}</b>
      </code>
    </h3>
  </section>

  {#if clientConnCtx.connState !== ConnectionState.Connected}
    <section>
      <form on:submit|preventDefault={onConnect}>
        <div class={css.title}>
          <h3>Password</h3>

          <button>Connect</button>
        </div>
        <p>Enter the password to access the files</p>
        
        <div class={css.inputContainer}>
          {#if showPassword}
            <input type="text" placeholder="Enter password" id="inputPassword" bind:value={inputPassword}/>
          {:else}
            <input type="password" placeholder="Enter password" id="inputPassword" bind:value={inputPassword}/>
          {/if}
          
          <button on:click|preventDefault={() => showPassword = !showPassword}>
            {#if showPassword}
              <EyeSlashIcon />
            {:else}
              <EyeIcon />
            {/if}
          </button>
        </div>
      </form>
    </section>
  {/if}

  <section>
    <div class={css.title}>
      <h3>Download as Zip</h3>

      <button on:click={() => ClientConnContext.downloadFilesAsZip('Download.zip', files, compressionLevel)}>
        Download as Zip
      </button>
    </div>

    <p>Download all files as a single zip</p>

    
    <p>Compression level: {compressionLevel}</p>
    <p>0: Fast and low compression, 9: Slow and high compression</p>

    <input type="range" max="9" min="0" bind:value={compressionLevel}/>    
  </section>

  <section>
    <div class={css.title}>
      <h3>Files</h3>
      
      <button on:click={() => fetchFiles = getFiles(url)}>
        Refresh
      </button>      
    </div>

    {#await fetchFiles}
      <div class="loadingGif">
        <LoadingGif size="2em"/>
      </div>
    {:then result} 
      <FileTable
        path={filesCtx.path}
        setPath={FilesContext.setPath}
        fileListProps={getFileList(result)}
        hoverRowColor="#233d24"
        onClickMsg="Download"
        onClickDirDesc="Download all files in this directory as a zip"
      />
    {/await}
  </section>

  {#if Object.keys(clientStatisticsCtx).length}
    <section>
      <h3>Statistics</h3>

      <div class={css.statsContainer}>
        {#each Object.entries(clientStatisticsCtx) as [
          name, {bytesPerSec, remainingBytes, percent, cancelDownload}
        ]}
          {@const fileName = formatFileName(name)}
          <StatsCard {fileName} {bytesPerSec} {remainingBytes} {percent} {cancelDownload}/>
        {/each}
      </div>
    </section>
  {/if}
</main>

<style>
  .loadingGif {
    display: grid;
    place-items: center;
  }
</style>