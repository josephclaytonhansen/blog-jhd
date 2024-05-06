
let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;

let components = {};

for (let prefix of prefixes) {
    components[`${prefix}Home`] = import('./' + prefix + '/Home.vue');
}

export default components;
