import { Test, TestingModule } from '@nestjs/testing';
import { SpecialLecturesService } from './special-lectures.service';

describe('SpecialLecturesService', () => {
  let service: SpecialLecturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialLecturesService],
    }).compile();

    service = module.get<SpecialLecturesService>(SpecialLecturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
