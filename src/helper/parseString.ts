export default function parseString(str: string | null | undefined) : string {
    return (str === null || str === undefined) ? "" : str
}