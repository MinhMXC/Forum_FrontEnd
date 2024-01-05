export default function textChipColour(hex: string): string {
    return isColourBright(hex) ? "black" : "white"
}

function isColourBright(hex: string): boolean {
    const [red, green, blue] = hexToRGB(hex)
    const hsp = Math.sqrt(0.299 * (red * red) + 0.587 * (green * green) + 0.114 * (blue * blue))
    return hsp > 127.5
}

function hexToRGB(hex: string) {
    const red = parseInt(hex.substring(1, 3), 16)
    const green = parseInt(hex.substring(3, 5), 16)
    const blue = parseInt(hex.substring(5, 7), 16)

    return [red, green, blue]
}