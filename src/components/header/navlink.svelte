<script lang="ts">
  import { link } from "svelte-routing";

  export let href: string
  export let pretty: string
  export let current: string 
</script>


<a use:link {href} class="{current === href ? 'current' : ''}">
  {pretty}
</a>


<style>
  a {
    font-weight: 500;
    color: #646cff;
  }

  a:hover, a.current {
    color: #4c54ee;
    text-decoration: none;
  }

  @media (prefers-color-scheme: light) {
    a:hover {
      color: #747bff;
    }
  }
</style>