let prefixes = process.env.VUE_APP_FRONTEND_PREFIXES;

let componentPromises = prefixes.map(prefix => {
  return import(`../../../pages/${prefix}/Header.vue`)
    .then(component => {
      return { name: `${prefix}Header`, component: component.default };
    });
});

export default Promise.all(componentPromises)
  .then(componentsArray => {
    let components = {};
    for (let { name, component } of componentsArray) {
      components[name] = component;
    }
    return components;
  });