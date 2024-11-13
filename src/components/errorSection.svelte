<script lang="ts">
  export let err: { [key: string]: any }
</script>

<section>
  <table>
    <tbody>
      {#each Object.entries(err) as [key, value]}
        <tr>
          <td><h3>{key}</h3></td>
          <td>{value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  section {
    background-color: #3f090985;
    display: flex;
    flex-direction: column;
  }

  h3 {
    margin: 0;
  }
</style>