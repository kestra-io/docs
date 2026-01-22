const baseUrl = (request: Request): string => {
    const url = new URL(request.url)
    const protocol = request.headers.get("x-forwarded-proto") || url.protocol
    const host = request.headers.get("x-forwarded-host") || url.host
    return `${protocol}//${host}`
}

export const generate = (
    request: Request,
    category: string,
    title: string,
    image?: string | null,
    description?: string | null,
): string => {
    const base = baseUrl(request)

    return `<svg xmlns="http://www.w3.org/2000/svg" style="-webkit-user-select: none;"  width="1200" height="625">
            <rect  width="1200" height="625" fill="#0e0e0e" />
            <foreignObject x="0" y="0" width="1200" height="625">
                <div xmlns="http://www.w3.org/1999/xhtml" style="width: 1200px; height: 625px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-image: url('${base}/og-bg.svg'); background-size: cover; background-position: center; color: #ffffff; padding: 20px;">
                    <div style="width: 298px; height: 38px; position: absolute; top: 108px; left: 210px; transform: translate(-50%, -50%); background-image: url('${base}/logo-white.svg'); background-size: 100% 100%; color: #ffffff; padding: 20px;"></div>
                    <div v-if="image" style="width: 425px; height: 425px; position: absolute; top: 50%; left: 75%; transform: translate(-50%, -50%); background-image: url('${image?.startsWith("/") ? base + image : "data:image/svg+xml;base64," + image}'); background-size: 100% 100%; background-position: center; color: #ffffff; padding: 20px;"></div>
                    <div style="position: absolute; top: 187.88px; left: 55.64px;">
                        <p style="font-family: 'Public Sans', sans-serif; font-size: 31.69px; font-weight: 600; line-height: 52.76px; color: #CD88FF; margin: 0;">${category?.toUpperCase()}</p>
                        <h1 style="width: 562.89px; font-family:  'Public Sans', sans-serif; font-size: 60px; font-weight: 600; line-height: 74px; color: #FFFFFF; margin-top: 47.86px">${title}</h1>
                        <p v-if="description" style="width: 562.89px; font-family: 'Public Sans', sans-serif; font-size: 29px; font-weight: 600; line-height: 44px; color: #FFFFFF; margin-top: 38.68px">${description || ""}</p>
                    </div>
                </div>
            </foreignObject>
        </svg>`
}