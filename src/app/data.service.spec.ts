import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { AppModule } from './app.module';
import { Transcript } from 'src/models/transcript';

describe('DataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ AppModule ]
  }));

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });

  it('should return not_found', () => {
    const service: DataService = TestBed.get(DataService);
    const id = 'test_id';
    const result = service.getVideo(id);
    expect(result).toEqual('not_found');
  });

  it('should return a video url', () => {
    const service: DataService = TestBed.get(DataService);
    const id = '4d79041e-f25f-421d-9e5f-3462459b9934';
    const result = service.getVideo(id);
    expect(result).toContain('.mp4');
  });

  it('should return an array of transcripts', () => {
    const service: DataService = TestBed.get(DataService);
    const id = '4d79041e-f25f-421d-9e5f-3462459b9934';
    service.getTranscript(id).toPromise()
    .then((res: Transcript[]) => {
      expect(res.length).toBeGreaterThanOrEqual(0);
    });
  });
});

// if there were more functions I could write more tests for this service
//
