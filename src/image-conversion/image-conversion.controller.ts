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
};

export class RemoveBackgroundDto {
    @IsNotEmpty()
    @IsString()
    image: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(255)
    threshold?: number = 240;
};

@Controller('api/image')
@UseGuards(ApiKeyGuard)
export class ImageConversionController {
    constructor(private readonly imageConversionService: ImageConversionService) {}

    @Post('convert-to-png')
    async convertToPng(@Body() body: ConvertImageDto) {
        try {
            if (!body.image) {
                throw new HttpException('Se requiere una imagen', HttpStatus.BAD_REQUEST);
            };

            const pngBase64 = await this.imageConversionService.convertJpegToPng(body.image);

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

    @Post('remove-white-background')
    async removeWhiteBackground(@Body() body: RemoveBackgroundDto) {
        try {
            if (!body.image) {
                throw new HttpException('Se requiere una imagen', HttpStatus.BAD_REQUEST);
            };

            const threshold = body.threshold ?? 240;
            
            const pngWithTransparency = await this.imageConversionService.removeWhiteBackground(
                body.image,
                threshold
            );
            
            return {
                success: true,
                png: pngWithTransparency,
                message: 'Fondo removido exitosamente'
            };
        } catch (error) {
            throw new HttpException(
                error.message || 'Fallo al remover fondo',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        };
    };
};
