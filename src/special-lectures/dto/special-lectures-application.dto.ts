import { IsNotEmpty, IsInt, Min } from 'class-validator';

export class ApplicationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  userId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  lectureId: number;
}
