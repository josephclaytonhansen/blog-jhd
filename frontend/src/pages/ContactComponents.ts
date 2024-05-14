
    let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;
    
    let components = {};
    
    for (let prefix of prefixes) {
        components[`${prefix}Contact`] = import(`./${prefix}/Contact.vue`);
    }
    
    export default components;
    