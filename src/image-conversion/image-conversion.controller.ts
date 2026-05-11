import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
    UseGuards
} from '@nestjs/common';
import { ImageConversionService } from './image-conversion.service';
import { ApiKeyGuard } from '../auth/api-key.guard';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class ConvertImageDto {
    @IsNotEmpty()
    @IsString()
    image: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(9)
    compressionLevel?: number = 6;

    @IsOptional()
    @IsNumber()
    @Min(50)
    @Max(1200)
    maxSize?: number = 400;
}

@Controller('api/image')
@UseGuards(ApiKeyGuard)
export class ImageConversionController {
    constructor(private readonly imageConversionService: ImageConversionService) { }

    @Post('convert-to-png')
    async convertToPng(@Body() body: ConvertImageDto) {
        try {
            if (!body.image) {
                throw new HttpException('Se requiere una imagen', HttpStatus.BAD_REQUEST);
            };

            const pngBase64 = await this.imageConversionService.convertToPng(
                body.image,
                body.compressionLevel,
                body.maxSize
            );

            return {
                success: true,
                png: pngBase64,
                message: 'Converción exitosa'
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Fallo al convertir imágen',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        };
    };
};
