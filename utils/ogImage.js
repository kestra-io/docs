export function defineOgImage({ type, icon, title, description}) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="-webkit-user-select: none;">
        <rect width="100%" height="100%" fill="#0e0e0e" />
        <foreignObject x="0" y="0" width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 1200px; height: 625px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-image: url('http://localhost:3001/og-bg.svg'); background-size: cover; background-position: center; color: #ffffff; padding: 20px;">
                <div style="width: 278.6px; height: 64.34px; position: absolute; top: 108.04px; left: 200.64px; transform: translate(-50%, -50%); background-image: url('https://kestra.io/logo-white.svg'); background-size: 100% 100%; color: #ffffff; padding: 20px;"></div>
                <div style="width: 425px; height: 425px; position: absolute; top: 50%; left: 75%; transform: translate(-50%, -50%); background-image: url('${type === 'plugins' ? icon : `https://kestra.io${icon}`}'); background-size: cover; background-position: center; color: #ffffff; padding: 20px;"></div>
                <div style="position: absolute; top: 187.88px; left: 55.64px;">
                  <p style="font-family: Source Code Pro; font-size: 31.69px; font-weight: 600; line-height: 52.76px; color: #CD88FF; margin: 0; text-transform: capitalize;">${type}</p>
                  <h1 style="width: 562.89px; font-family:  Public Sans; font-size: 75px; font-weight: 600; line-height: 74px; color: #FFFFFF; margin-top: 47.86px">${title}</h1>
                  <p  style="width: 562.89px; font-family:  Public Sans; font-size: 29px; font-weight: 600; line-height: 44px; color: #FFFFFF; margin-top: 38.68px">${description}</p>
                </div>
            </div>
        </foreignObject>
    </svg>`;
}