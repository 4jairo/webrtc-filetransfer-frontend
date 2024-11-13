<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
 
<script lang="ts">
  import { formatByteUnity } from "../../lib/format";
  import XIcon from "../icons/xIcon.svelte";
  import './stats.css';

  export let fileName: string
  export let percent: number
  export let bytesPerSec: number
  export let remainingBytes: number
  export let cancelDownload: () => void


  let showCancel = false
</script>


<div 
  class="downloadingStats" 
  on:mouseenter={() => showCancel = true} 
  on:mouseleave={() => showCancel = false}
>
  <b>{fileName}</b>

  <div>
    <p class="stat">Downloaded</p>
    <p>{percent}%</p>
  </div>
  
  <div>
    <div class="progress">
      <div style="width: {percent}%"></div>
    </div>
  </div>

  <div>
    <p class="stat">Transfer rate</p>
    <p>{formatByteUnity(bytesPerSec)}/s</p>
  </div>

  <div>
    <p class="stat">Remaining</p>
    <p>{formatByteUnity(remainingBytes)}</p>
  </div>

  {#if showCancel}
    <div class="cancelDownload" on:click={cancelDownload}>
      <XIcon size="1.5em"/>
    </div>
  {/if}
</div>