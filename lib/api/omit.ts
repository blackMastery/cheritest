export { omit };

function omit(obj:any, key:any) {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}