export default function getTextFieldValue(id: string): string {
    return (document.getElementById(id) as HTMLInputElement).value
}