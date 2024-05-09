<script setup>
const t = window.location.hostname
</script>

<template>
    <div class="w-full h-full overflow-hidden flex flex-row max-h-[100vh]">
        <div class="w-[100%] h-[100vh] min-w-[300px] min-h-[400px]" style="resize: both; overflow: auto;">
            <iframe :src="`https://${t}`" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
    </div>
</template>