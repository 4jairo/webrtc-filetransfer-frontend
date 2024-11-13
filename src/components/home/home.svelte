<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->

<script lang="ts">
  import { link } from "svelte-routing";
  import { FilesContext } from "../../context/filesContext";
  import { HostConnConext } from "../../context/hostConnContext";
  import { HostStatisticsContext } from "../../context/statisticsContext";
  import { UrlPathConext } from "../../context/urlPathContext";
  import { getFileName } from "../../lib/directoryContent";
  import { fetchFilesCreate } from "../../lib/fetching";
  import { toFileProps } from "../../lib/format";
  import type { IntoFilePropsList, RequestedFilesStatsType, UnexpectedErrorProps } from '../../lib/types';
  import ErrorSection from "../errorSection.svelte";
  import FileTable from "../fileList/fileTable.svelte";
  import EyeIcon from "../icons/eyeIcon.svelte";
  import EyeSlashIcon from "../icons/eyeSlashIcon.svelte";
  import css from '../inputContainer.module.css';
  import HostStatsCard from "../stats/hostStatsCard.svelte";
  
  UrlPathConext.set('/')

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/files/${hostConnCtx.url}`)
  }

  const onInputFiles = (e: Event & {currentTarget: EventTarget & HTMLInputElement}) => {
    const files = e.currentTarget.files
    files && FilesContext.setTemporaryFiles(files)
  }

  const onUploadFiles = () => {
    // newFiles is a list of files that are not in the files list
    const newFiles = FilesContext.getTemporaryUniqueFiles()
    if (!newFiles.length) return

    FilesContext.moveTemporaryFiles(newFiles)
    HostConnConext.addFiles(newFiles.map(toFileProps))
  }

  const joinStats = (stats: { [signalingId: string]: RequestedFilesStatsType }) => {
    const result = {
      bytesPerSec: 0,
      totalChannels: 0,
      cancelDownloads: [] as (() => void)[],
    }

    return Object.values(stats).reduce((acc, item) => {
      acc.bytesPerSec += item.bytesPerSec
      acc.totalChannels += 1
      acc.cancelDownloads.push(item.cancelDownload)
      return acc
    }, result)
  }

  const onGenerateUrl = async () => {
    try {
      const files = FilesContext.getFiles().map(toFileProps)
      const response = await fetchFilesCreate({
        files, password: passwordUser,
      })

      HostConnConext.connect(passwordUser, response.passwordFiles, response.url)

      error = null
    } catch (err) {
      error = err as UnexpectedErrorProps
    }
  }

  const directoryInputCompatible = () => {
    const input = document.createElement('input')
    input.type = 'file'
    return 'webkitdirectory' in input //&& 'directory' in input
  }

  $: filesCtx = $FilesContext
  $: hostConnCtx = $HostConnConext
  $: HostStatisticsCtx = $HostStatisticsContext
  let passwordUser = ''
  let error: UnexpectedErrorProps | null = null
  let showPassword = false


  $: tempFileList = {
    list: filesCtx.temporaryFiles,
    intoFileProps: toFileProps,
    onClickFile: FilesContext.removeTemporaryFile,
    onClickDir: FilesContext.removeTemporaryDirectory
  } as IntoFilePropsList<File>

  $: notTempFileList = {
    list: filesCtx.files,
    intoFileProps: toFileProps,
    onClickFile: (f) => {
      HostConnConext.removeFiles([getFileName(f)], (e) => error = e)
        .then(() => FilesContext.removeFile(f))
    },
    onClickDir: (dir) => {
      const files = filesCtx.files
        .map(getFileName)
        .filter((f) => f.startsWith(dir))

      HostConnConext.removeFiles(files, (e) => error = e)
        .then(() => FilesContext.removeDirectory(dir))
    }
  } as IntoFilePropsList<File>
</script>

<main>
  <section>
    <h3>Upload files</h3>
    <p>Note that the files will not be stored on the server, so the generated URL will be the only way to access the files.</p>
    <p>You can <code>add / remove</code> files when the URL is generated</p>

    <div class={css.inputContainer}>
      <div>
        <p>Files (select single files)</p>
        <input type="file" multiple on:input={onInputFiles} />
      </div>
      {#if directoryInputCompatible()}
        <div>
          <p>Direcrories (upload all the files inside)</p>
          <input type="file" webkitdirectory multiple on:input={onInputFiles} />
        </div>
      {/if}
    </div>
  </section>

  <section>
    <div class={css.title}>
      <h3>Temporary selected files</h3>
      <button on:click={onUploadFiles}>Publish files</button>
    </div>
    <p>In this table you can edit the file selection before publishing the result by pressing the <code>Upload files</code> button</p>

    <FileTable
      path={filesCtx.temporaryPath}
      setPath={FilesContext.setTemporaryPath}
      fileListProps={tempFileList} 
      hoverRowColor="#3f0909"
      onClickMsg="Remove"
    />
  </section>


  <section>
    <h3>Uploaded files</h3>
    <p>This table shows the <code>uploaded</code> files</p>

    <FileTable 
      path={filesCtx.path}
      setPath={FilesContext.setPath}
      fileListProps={notTempFileList} 
      hoverRowColor="#3f0909"
      onClickMsg="Remove"
    />
  </section>

  <section>
    <h3>Create password</h3>
    <p>The password will be required to download the files</p>

    <div class={css.inputContainer}>
      {#if showPassword}
        <input bind:value={passwordUser} type="text" placeholder="Enter password" readonly={Boolean(hostConnCtx.url)} />
      {:else}
        <input bind:value={passwordUser} type="password" placeholder="Enter password" readonly={Boolean(hostConnCtx.url)} />
      {/if}

      <button on:click={() => showPassword = !showPassword}>
        {#if showPassword}
          <EyeSlashIcon />
        {:else}
          <EyeIcon />
        {/if}
      </button>
    </div>
  </section>

  <section>
    <h3>Generate URL</h3>
    <p>When the URL is created, anyone with the <code>URL</code> and <code>password</code> will be able to download the uploaded files.</p>
    <p>The files will be available while this browser tab is open</p>
    {#if hostConnCtx.url}
      <p>
        URL:
        <code><a use:link href="/files/{hostConnCtx.url}">{window.location.origin}/files/{hostConnCtx.url}</a></code>
        <code on:click={handleCopyUrl} style="cursor: pointer;" >copy</code>
      </p>
    {/if}

    <div class={css.inputContainer}>
      <input
        bind:value={hostConnCtx.url}
        on:click={handleCopyUrl}
        class="urlInput"
        type="text"
        placeholder="URL code will be generated here"
        readonly
      />

      <button on:click={onGenerateUrl} disabled={Boolean(hostConnCtx.url)}>Generate url</button>
    </div>
  </section>

  {#if Object.keys(HostStatisticsCtx).length}
    <section>
      <h3>Statistics</h3>

      <div class={css.statsContainer}>
        {#each Object.entries(HostStatisticsCtx) as [fileName, stats]}
          <HostStatsCard {fileName} {...joinStats(stats)} />
        {/each}
      </div>
    </section>
  {/if}

  {#if error}
    <ErrorSection err={{
      'There was an error': error.err,
      'Status code': error.status,
      'Status text': error.statusText
    }} />
  {/if}
</main>

<style>
  .urlInput {
    padding: 8px;
    border-radius: 10px;
    cursor: text;
    text-align: center;
  }
</style>