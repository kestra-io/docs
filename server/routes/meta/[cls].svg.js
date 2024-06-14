export default defineEventHandler(async (event) => {

    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" style="-webkit-user-select: none;"  width="1200" height="625">
        <rect  width="1200" height="625" fill="#0e0e0e" />
        <foreignObject x="0" y="0" width="1200" height="625">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width: 1200px; height: 625px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffffff; padding: 20px;">
                <div style="position: absolute; top: 187.88px; left: 55.64px;">
                  <p style="font-family: Source Code Pro; font-size: 31.69px; font-weight: 600; line-height: 52.76px; color: #CD88FF; margin: 0; text-transform: capitalize;">Plugin</p>
                  <h1 style="width: 562.89px; font-family:  Public Sans; font-size: 75px; font-weight: 600; line-height: 74px; color: #FFFFFF; margin-top: 47.86px">Core</h1>
                  <p  style="width: 562.89px; font-family:  Public Sans; font-size: 29px; font-weight: 600; line-height: 44px; color: #FFFFFF; margin-top: 38.68px">Core</p>
                </div>
            </div>
        </foreignObject>
    </svg>`;


    event.node.res.writeHead(200, {
        'Content-Type': 'image/svg+xml',
    });

    event.node.res.end(svgString);
})