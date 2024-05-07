<script setup>
</script>

<template>
    <div class = "p-8">
        <div class = "prose font-normal w-full">
            <h1 class="text-2xl text-text-2">Pages</h1>
            <h2 class="text-xl text-text-2">Creating a new page</h2>
            <p class="text-text-3">
                To add a new page, run the following command in the terminal:
                <br/>
                <code class="p-2 rounded-lg bg-backdrop-1 text-accent-500">npm run create-site-page {PageName} {sites?}</code>
                </br>
                The sites parameter is optional and can be used to specify the sites that the page should be created for. If it is not set, the page will be created for all sites. To set specific sites, format the parameter as <code class="p-2 rounded-lg bg-backdrop-1 text-accent-500">'["site1","site2"]'</code>.
            </p>
            <h2 class="text-xl text-text-2">Editing a page</h2>
            <p class="text-text-3">
                To edit a page, navigate to the <code class="p-2 rounded-lg bg-backdrop-1 text-accent-500">frontend/src/pages</code> directory and open the page you want to edit. Unlike posts, pages are meant to be designed, so they don't have a frontend editor. Use Vue components to design the page. Run <code class="p-2 rounded-lg bg-backdrop-1 text-accent-500">npm run buildbot</code> after any changes.
            </p>
            <h2 class="text-xl text-text-2">Deleting a page</h2>
            <p class="text-text-3">
                To delete a page, run the following command in the terminal: <br/>
                <code class="p-2 rounded-lg bg-backdrop-1 text-accent-500">npm run remove-site-page {PageName} {sites?}</code>
            </p>
        </div>
    </div>
</template>