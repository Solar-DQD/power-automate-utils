import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageConversionService {

    private stripBase64Prefix(base64Image: string): Buffer {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        return Buffer.from(base64Data, 'base64');
    };

    async convertToPng(
        base64Image: string,
        compressionLevel: number = 6,
        maxSize: number = 400
    ): Promise<string> {
        try {
            const imageBuffer = this.stripBase64Prefix(base64Image);
            const pngBuffer = await sharp(imageBuffer)
                .resize(maxSize, maxSize, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .png({
                    compressionLevel,
                    effort: 10,
                })
                .toBuffer();
            return pngBuffer.toString('base64');
        } catch (error) {
            throw new Error(`Conversión fallida: ${error.message}`);
        }
    }
};
