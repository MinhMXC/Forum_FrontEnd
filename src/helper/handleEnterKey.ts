export default function handleEnterKey(func: Function) {
    return (event: any) => {
        if (event.key === "Enter") {
            func()
        }
    }
}