export function isEmptyOrSpaces(str: string) {
    return str === null || str === undefined || str.match(/^ *$/) !== null
}