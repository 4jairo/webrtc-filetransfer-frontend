<script lang="ts">
  import { UrlPathConext } from "../../context/urlPathContext";
  import WithoutUrl from "./withoutUrl.svelte";
  import WithUrl from "./withUrl.svelte";

  UrlPathConext.set('/files')

  export let url: string
</script>


{#if url !== ""}
  <WithUrl {url}/>
{:else}
  <WithoutUrl />
{/if}
