import {
  ArgumentMetadata,
  Injectable,
  ParseIntPipe,
  PipeTransform
} from '@nestjs/common';

@Injectable()
export class CustomParseIntPipe implements PipeTransform<string | undefined, Promise<number | undefined>> {
  async transform(value: string | undefined, metadata: ArgumentMetadata): Promise<number | undefined> {
    if (!value) {
      return undefined;
    }

    return await new ParseIntPipe().transform(value, metadata);
  }
}
