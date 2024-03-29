import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApplicationDto } from './dto/special-lectures-application.dto';
import { UserNotFoundError } from 'src/common/exceptions/UserNotFoundError';
import { LectureNotFoundError } from 'src/common/exceptions/LectureNotFoundError';
import { LectureNotBeginError } from 'src/common/exceptions/LectureNotBeginError';
import { DupliateAplicationNotPossibleError } from 'src/common/exceptions/DupliateAplicationNotPossibleError';
import { StudentCapacityOverError } from 'src/common/exceptions/studentCapacityOverError';
import { ApplicationNotFoundError } from 'src/common/exceptions/ApplicationNotFoundError';
import { SpecialLecturesService } from './domain/special-lectures.service';
import { PositiveIntValidationPipe } from 'src/common/pipes/positive-int-validation.pipe';

@Controller('special-lectures')
export class SpecialLecturesController {
  constructor(
    private readonly specialLecturesService: SpecialLecturesService,
  ) {}

  @Get('/specialLectures')
  async getSpecialLectures() {
    return await this.specialLecturesService.getSpecialLectures();
  }

  @Post('/apply')
  async apply(@Body(ValidationPipe) applicationDto: ApplicationDto) {
    try {
      return await this.specialLecturesService.apply(applicationDto);
    } catch (error) {
      console.log(error);
      if (
        error instanceof UserNotFoundError ||
        error instanceof LectureNotFoundError ||
        error instanceof LectureNotBeginError ||
        error instanceof DupliateAplicationNotPossibleError ||
        error instanceof StudentCapacityOverError
      ) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Get('/applicationStatus')
  async getApplicationStatus(
    @Query('userId', PositiveIntValidationPipe) userId: number,
    @Query('lectureId', PositiveIntValidationPipe) lectureId: number,
  ) {
    try {
      return await this.specialLecturesService.getApplicationStatusOneBy({
        userId,
        lectureId,
      });
    } catch (error) {
      console.log(error);
      if (
        error instanceof UserNotFoundError ||
        error instanceof LectureNotFoundError ||
        error instanceof ApplicationNotFoundError
      ) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
