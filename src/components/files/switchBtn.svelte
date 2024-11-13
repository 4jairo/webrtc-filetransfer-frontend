<script lang="ts">
  export let disabled: boolean
  export let firstChecked: boolean
  export let setChecked: (c: boolean) => void
</script>

<label class="switch">
  <input 
    type="checkbox" 
    {disabled}
    checked={firstChecked}
    on:input={(e) => setChecked(e.currentTarget.checked)} 
  >
  <span class="slider"></span>
</label>

<style>
  /* Container for the switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  /* Hide the default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #1a1a1a;
    transition: 0.2s;
    border-radius: 34px;
  }

  /* The circle inside the slider */
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
  }

  /* When the checkbox is checked */
  input:checked + .slider {
    background-color: #646cff;
  }

  /* Move the circle inside the slider when checked */
  input:checked + .slider:before {
    transform: translateX(26px);
  }
</style>