
let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;

let components = {};

for (let prefix of prefixes) {
    components[`${prefix}NotFound`] = import('./' + prefix + '/NotFound.vue');
}

export default components;
