export default defineEventHandler(async (event) => {
    const cls = getRouterParam(event, 'cls.png').substring(0, getRouterParam(event, 'cls.png').lastIndexOf("."));
    const config = useRuntimeConfig();
    const plugins = await $fetch(`${config.public.apiUrl}/plugins`);
    const plugin = plugins.find(plugin => plugin.name === cls);
    const { title, description} = plugin;
    const icon = `https://kestra.io/icons/${plugin?.group}.svg`;

    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" style="-webkit-user-select: none;"  width="1200" height="625">
        <rect  width="1200" height="625" fill="#0e0e0e" />
        <foreignObject x="0" y="0" width="1200" height="625">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 1200px; height: 625px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-image: url('http://localhost:3001/og-bg.svg'); background-size: cover; background-position: center; color: #ffffff; padding: 20px;">
                <div style="width: 278.6px; height: 64.34px; position: absolute; top: 108.04px; left: 200.64px; transform: translate(-50%, -50%); background-image: url('https://kestra.io/logo-white.svg'); background-size: 100% 100%; color: #ffffff; padding: 20px;"></div>
                <div style="width: 425px; height: 425px; position: absolute; top: 50%; left: 75%; transform: translate(-50%, -50%); background-image: url('${icon}'); background-size: cover; background-position: center; color: #ffffff; padding: 20px;"></div>
                <div style="position: absolute; top: 187.88px; left: 55.64px;">
                  <p style="font-family: Source Code Pro; font-size: 31.69px; font-weight: 600; line-height: 52.76px; color: #CD88FF; margin: 0; text-transform: capitalize;">Plugin</p>
                  <h1 style="width: 562.89px; font-family:  Public Sans; font-size: 75px; font-weight: 600; line-height: 74px; color: #FFFFFF; margin-top: 47.86px">${title}</h1>
                  <p  style="width: 562.89px; font-family:  Public Sans; font-size: 29px; font-weight: 600; line-height: 44px; color: #FFFFFF; margin-top: 38.68px">${description}</p>
                </div>
            </div>
        </foreignObject>
    </svg>`;
    const svgBuffer = Buffer.from(svgString);


    event.node.res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
    });

    event.node.res.end(svgBuffer);
})