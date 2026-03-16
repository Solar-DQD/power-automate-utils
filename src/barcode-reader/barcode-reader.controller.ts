import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BarcodeReaderService } from './barcode-reader.service';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiKeyGuard } from 'src/auth/api-key.guard';

export class PanelesEscaneados {
  @IsNotEmpty()
  @IsString()
  parque: string;

  @IsNotEmpty()
  @IsString()
  tracker: string;

  @IsNotEmpty()
  @IsString()
  paneles: string[];
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
