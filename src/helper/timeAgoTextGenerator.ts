function timeAgoTextGenerator(created_at: number, updated_at: number) {
    return updated_at === created_at
           ? convertEpochToTimeAgo(+created_at)
           : convertEpochToTimeAgo(+created_at) + " (edited: " + convertEpochToTimeAgo(+updated_at) + ")"
}

function convertEpochToTimeAgo(epoch: number) : string {
    const now = Date.now() / 1000 //epoch is in milisecond
    const diff = now - epoch

    switch (true) {
        case diff < 60:         return Math.floor(diff) + "s"
        case diff < 3600:       return Math.floor(diff / 60) + "m"
        case diff < 86400:      return Math.floor(diff / 3600) + "h"
        case diff < 31536000:   return Math.floor(diff / 86400) + "d"
        default:                return Math.floor(diff / 31536000) + "y"
    }
}

export default timeAgoTextGenerator