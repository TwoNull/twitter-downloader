export default function Links({links, duration}: any) {
    links = links.sort(function(a: any, b: any) {
        return a.bitrate - b.bitrate
    })
    let list: any = [];
    for(const link in links) {
        const url = new URL(links[link].url)
        const paths = url.pathname.split('/')
        const res = paths[paths.length-2]
        if(duration * (links[link].bitrate/8000) < 12000000) {
            list.push(<a href={`/api/proxy?link=${url.href}`}><span>{res + ' | ' + formatBytes(duration * (links[link].bitrate/8000))}</span></a>)
        }
        else {
            list.push(<a href={url.href} target="_blank" rel="noopener noreferrer"><span>{res + ' | Source (Over 12MB)'}</span></a>)
        }
    }
    return list;
}

function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}