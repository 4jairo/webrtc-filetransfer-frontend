<script lang="ts">
  import { Route, Router } from "svelte-routing";
  import About from "./components/about.svelte";
  import Files from "./components/files/files.svelte";
  import Header from "./components/header/header.svelte";
  import Home from "./components/home/home.svelte";
  import NotFound from "./components/notFound.svelte";
</script>

<Header />

<Router>
  <Route path="/">
    <Home />
  </Route> 

  <Route path="/about">
    <About />
  </Route>

  <Route path="files/:url" let:params>
    <Files url={params.url}/>
  </Route>
  
  <Route path="/files">
    <Files url="" />
  </Route>

  <Route>
    <NotFound />
  </Route>
</Router>
