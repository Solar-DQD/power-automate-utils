import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BarcodeReaderService } from './barcode-reader.service';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiKeyGuard } from 'src/auth/api-key.guard';

export class PanelesEscaneados {
  @IsNotEmpty()
  @IsString()
  parque: string;

  @IsNotEmpty()
  @IsString()
  tracker: string;

  @IsArray()
  @ArrayNotEmpty() // ensures array is not empty
  @IsString({ each: true })
  paneles: string[];

  @IsString()
  @IsOptional()
  creadoPor?: string;
};

@Controller('barcodereader')
@UseGuards(ApiKeyGuard)
export class BarcodeReaderController {
  constructor(private readonly barcodereaderService: BarcodeReaderService) { }

  @Post()
  async registerPanel(@Body() body: PanelesEscaneados) {
    return this.barcodereaderService.createPanel(body);
  };
};
