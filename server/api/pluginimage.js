import url from "node:url";
import nodeHtmlToImage from 'node-html-to-image'

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();

    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    const page = requestUrl.searchParams.get("page");
    const config = useRuntimeConfig();
    const plugins = await $fetch(`${config.public.apiUrl}/plugins`);
    const plugin = plugins.find(plugin => plugin.name === page);
    const title = plugin?.title;
    const logoPath = `${runtimeConfig.public.siteUrl}/icons/${plugin?.group}.svg`;
    const backgroundPath = `${runtimeConfig.public.siteUrl}/og-bg.svg`;
    const kestraLogo= `${runtimeConfig.public.siteUrl}/logo-white.svg`;


    const html =  `
    </div>
            <html>
            <head>
                <style>
                    body {
                      width: 1200px;
                      height: 675px;
                    }
                    
                    .og-container {
                      background-image: url('${backgroundPath}');
                      background-size: cover;
                      background-repeat: no-repeat;
                      background-color: #1b0f29;
                      padding: 108px;
                      width: 100%;
                      height: 100%;
                      display: flex;
                      gap: 82px;
                    }
                    
                    .og-content {
                      width: 514px;
                      display: flex;
                      flex-direction: column;
                      gap: 47.86px;
                    }
                    
                    .kestra-logo-block {
                      display: flex;
                      flex-direction: column;
                      gap: 15px;
                    }
                    
                    .kestra-logo {
                      width: 278px;
                      height: 64px;
                    }
                    
                    .og-content-type {
                      font-family: Source Code Pro;
                      font-size: 32px;
                      font-weight: 600;
                      line-height: 53px;
                      color: #CD88FF; 
                      margin: 0; 
                      text-transform: capitalize;
                    }
                    
                    .title-block {
                      display: flex;
                      flex-direction: column;
                      gap: 38.64px;
                    }
                    
                    .page-title {
                      font-family:  Public Sans;
                      font-size: 75px; 
                      font-weight: 600;
                      line-height: 74px;
                      color: #FFFFFF;
                      margin: 0;
                    }
                    
                    .page-description {
                      font-family:  Public Sans;
                      font-size: 29px;
                      font-weight: 600; 
                      line-height: 44px; 
                      color: #FFFFFF; 
                      margin: 0;
                    }
                    
                    .page-icon-block {
                      display: flex;
                      justify-content: flex-end;
                      align-items: center;
                      margin-bottom: 150px;
                    }
                    
                    .page-icon {
                      width: 425px; 
                      height: 425px;
                    }
                </style>
            </head>
            <body>
               <div class="og-container">
                <div class="og-content">
                  <div class="kestra-logo-block">
                      <img class="kestra-logo" src="${kestraLogo}">
                      <p class="og-content-type">Plugins</p>
                  </div>
                  <div class="title-block">
                    <h1 class="page-title">${title || ''}</h1>
                    <p  class="page-description">${plugin.description || ''}</p>
                  </div>
                </div>
                <div class="page-icon-block">
                  <img class="page-icon" src="${logoPath}">
                </div>
              </div>
            </body>
        </html>
    `;

    const ogImage = await nodeHtmlToImage({
        html
    });


    return  ogImage
});