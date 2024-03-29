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
import { UserNotFoundError } from '../common/exceptions/UserNotFoundError';
import { LectureNotFoundError } from '../common/exceptions/LectureNotFoundError';
import { LectureNotBeginError } from '../common/exceptions/LectureNotBeginError';
import { DupliateAplicationNotPossibleError } from '../common/exceptions/DupliateAplicationNotPossibleError';
import { StudentCapacityOverError } from '../common/exceptions/studentCapacityOverError';
import { ApplicationNotFoundError } from '../common/exceptions/ApplicationNotFoundError';
import { SpecialLecturesService } from './domain/special-lectures.service';
import { PositiveIntValidationPipe } from '../common/pipes/positive-int-validation.pipe';

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
