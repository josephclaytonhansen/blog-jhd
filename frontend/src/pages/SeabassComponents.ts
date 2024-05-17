
    let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;
    
    let components = {};
    
    for (let prefix of prefixes) {
        components[`${prefix}Seabass`] = import(`./${prefix}/Seabass.vue`);
    }
    
    export default components;
    