<script lang="ts">
  import { UrlPathConext } from "../../context/urlPathContext";
  import Navlink from "./navlink.svelte";

  $: path = $UrlPathConext
</script>

<header>
  <div>
    <h1>File Transfer</h1>
    <p>Browser to browser communication</p>
  </div>

  <div class="nav">
    <Navlink href="/" pretty="Publish" current={path}/>
    <!-- <Navlink href="/about" pretty="About" current={path}/> -->
    <Navlink href="/files" pretty="Download" current={path}/>
  </div>
</header>


<style>
  .nav {
    display: flex;
    gap: 3rem
  }
</style>