<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
 
<script lang="ts">
  import { formatByteUnity } from "../../lib/format";
  import XIcon from "../icons/xIcon.svelte";
  import './stats.css';

  export let fileName: string
  export let bytesPerSec: number
  export let totalChannels: number
  export let cancelDownloads: (() => void)[]

  const cancelDownload = () => {
    for (const cancel of cancelDownloads) {
      cancel()
    }
  }
</script>


<div class="downloadingStats">
  <b>{fileName}</b>

  <div>
    <p class="stat">Channels open</p>
    <p>{totalChannels}</p>
  </div>

  <div>
    <p class="stat">Transfer rate</p>
    <p>{formatByteUnity(bytesPerSec)}/s</p>
  </div>

  <div class="cancelDownload" on:click={cancelDownload}>
    <XIcon size="1.5em"/>
  </div>
</div>