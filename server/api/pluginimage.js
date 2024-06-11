import url from "node:url";
import { createCanvas, loadImage } from 'canvas'

export default defineEventHandler(async (event) => {
    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    const page = requestUrl.searchParams.get("page");
    const config = useRuntimeConfig();
    const plugins = await $fetch(`${config.public.apiUrl}/plugins`);
    const plugin = plugins.find(plugin => plugin.name === page);
    const title = plugin?.title;
    const logoPath = `https://kestra.io/icons/${plugin?.group}.svg`;
    const backgroundPath = 'http://localhost:3001/og-bg.svg';
    const kestraLogo= 'https://kestra.io/logo-white.svg';

    const [logoImage, backgroundImage, kestraLogoImage] = await Promise.all([
        loadImage(logoPath),
        loadImage(backgroundPath),
        loadImage(kestraLogo),
    ]);

    const writeText = (context, text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';

        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth) {
                context.fillText(line, x, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        });

        context.fillText(line, x, y);
    };


    const canvas = createCanvas(1200, 675);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.drawImage(kestraLogoImage, 60.68,  108.04, 278.6, 64.34);


    const logoWidth = 534.69;
    const logoHeight = 534.69;
    logoImage.width =  534.69;
    logoImage.height =  534.69;
    ctx.drawImage(logoImage, 613.09,  58.16, logoImage.width, logoImage.height);

    ctx.fillStyle = '#CD88FF';
    ctx.font = '600 31.69px Source Code Pro';
    ctx.fillText('Plugins', 73.68, 220.88);


    if (title) {
        ctx.fillStyle = 'white';
        ctx.font = '600 75px Public Sans';
        writeText(ctx, title, 70.52, 300.74, 562.89, 74);
    }

    if (plugin?.description) {
        ctx.fillStyle = 'white';
        ctx.font = '600 29px Public Sans';
        writeText(ctx, plugin?.description, 70.52, 495.42, 514.25, 44);
    }

    return canvas.toBuffer("image/png", {compressionLevel: 6, filters: canvas.PNG_ALL_FILTERS, palette: undefined, backgroundIndex: 0, resolution: undefined});

});