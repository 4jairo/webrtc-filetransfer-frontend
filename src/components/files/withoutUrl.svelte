<script lang="ts">
  import { navigate } from "svelte-routing";
  import type { UnexpectedErrorProps } from "../../lib/types";
  import ErrorSection from "../errorSection.svelte";

  let inputElmt: HTMLInputElement
  let error: UnexpectedErrorProps | null = null

  const handleClick = () => {
    if(!inputElmt.value) {
      return inputElmt.focus()
    }

    let navigateUrl: string

    if(URL.canParse(inputElmt.value)) {
      const url = new URL(inputElmt.value)

      // pathname
      if(!url.href.startsWith(`${window.location.origin}/files/`)) {
        error = {
          err: 'The URL is not from this website',
          status: 400,
          statusText: 'Bad Request'
        }
        return
      }
      
      navigateUrl = url.pathname
    } else {
      navigateUrl = `/files/${inputElmt.value}`
    }

    navigate(navigateUrl)
}
</script>


<section class="urlSearcher">
  <span>Please insert the generated URL</span>

  <form on:submit|preventDefault={handleClick}>
    <input type="text" placeholder="'code'   or   {window.location.origin}/files/'code'" bind:this={inputElmt}/>
    <button>Go</button>
  </form>
</section>

{#if error}
  <ErrorSection err={{
    'There was an error': error.err,
    'Status code': error.status,
    'Status text': error.statusText
  }} />
{/if}



<style>
  .urlSearcher  {
    align-items: center;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  span {
    font-size: large;
  }

  form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 5px
  }

  form > input {
    flex: 1;
    padding: 8px; 
    border-radius: 10px;
  }
</style>
