export function autoBind(instance: any) {
    const props = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(p => typeof instance[p] === 'function');
    props.forEach(p => instance[p] = instance[p].bind(instance));
}