<svelte:head>
  <title>ImageToSkin</title>
</svelte:head>

<div class="bg-zinc-900">
  <div class="pt-10 max-w-4xl mx-auto flex flex-row justify-center pb-10">
    <div class="basis-1/3 flex flex-col justify-center pl-4">
      <img class="w-11/12" src="/logo.svg" alt="logo">
    </div>
    <div class="text-white text-center basis-2/3 max-w-md flex flex-col justify-center items-center">
      <h1 class="font-rubik font-semibold md:text-9xl text-8xl">skins</h1>
      <h2 class="pt-3 w-5/6 font-rubik md:text-2xl">A tool to turn any image into a Minecraft skin.</h2>
    </div>
  </div>
</div>
<div class="absolute right-0 bottom-0 p-2 text-right font-rubik text-white">
  <p>Source on <a class="underline" href="https://github.com/tgb20/ImageToSkin">GitHub</a></p>
  <p>Copyright © {year} tgb</p>
</div>
<script>
  let year = new Date().getFullYear();
</script>