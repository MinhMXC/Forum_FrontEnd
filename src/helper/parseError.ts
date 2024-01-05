export default function parseError(error: string | string[]) : string {
    console.log(error)
    return Array.isArray(error)
           ? error.reduce((x: string, y: string) => x === "" ? y : y + "\n" + x, "")
           : error.replaceAll(";", "\n")
}