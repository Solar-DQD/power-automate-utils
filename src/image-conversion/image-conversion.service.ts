import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageConversionService {
    async convertJpegToPng(base64Image: string): Promise<string> {
        try {
            const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

            const imageBuffer = Buffer.from(base64Data, 'base64');

            const pngBuffer = await sharp(imageBuffer)
                .png()
                .toBuffer();

            return pngBuffer.toString('base64');
        } catch (error) {
            throw new Error(`Converción fallida: ${error.message}`)
        };
    };

    async removeWhiteBackground(base64Image: string, threshold: number = 240): Promise<string> {
        try {
            const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

            const imageBuffer = Buffer.from(base64Data, 'base64');

            const { data, info } = await sharp(imageBuffer)
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });

            const { width, height, channels } = info;

            for (let i = 0; i < data.length; i += channels) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (r > threshold && g > threshold && b > threshold) {
                    data[i + 3] = 0;
                };
            };

            const pngBuffer = await sharp(data, {
                raw: {
                    width,
                    height,
                    channels,
                },
            })
                .png()
                .toBuffer();

            return pngBuffer.toString('base64');
        } catch (error) {
            throw new Error(`Converción fallida: ${error.message}`)
        };
    };
};
