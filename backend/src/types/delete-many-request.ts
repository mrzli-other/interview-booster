import { ArrayNotEmpty, IsArray } from 'class-validator';

export class DeleteManyRequest {
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: readonly number[];
}
