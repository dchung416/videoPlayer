import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerComponent } from './video-player.component';
import { AppModule } from '../app.module';
import { DataService } from '../data.service';

describe('VideoPlayerComponent', () => {
  let component: VideoPlayerComponent;
  let fixture: ComponentFixture<VideoPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerComponent);
    component = fixture.componentInstance;
    component.videoId = '4d79041e-f25f-421d-9e5f-3462459b9934';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Ideally I would find a way to mock the query parameters in the url
  // and use that but I was unable to find a good way of doing it
  // But this is a way of mocking that the component is using the 
  // results of the data service call
  it('should use url from data service', () => {
    const service: DataService = TestBed.get(DataService);
    const id = '4d79041e-f25f-421d-9e5f-3462459b9934';
    fixture.debugElement.injector.get(DataService);
    component.videoId = id;
    component.getVideo();
    expect(service.getVideo(id)).toEqual(component.videoUrl);
  });

});
