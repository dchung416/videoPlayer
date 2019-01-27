import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// import * as mock from '../../mocks/transcript';
import { DataService } from '../data.service';
import { Transcript } from '../../models/transcript';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('playButton') playButton: ElementRef;
  @ViewChild('vid') vid: any;
  querySubscription: Subscription;
  videoUrl: string;
  videoTranscript: Transcript[];
  repIndexes: number[] = [];
  customerIndexes: number[] = [];
  videoNotFound = false;
  videoId: string;

  constructor(
    private route: ActivatedRoute,
    private data: DataService
  ) {
  }

  ngOnInit() {
    // this.querySubscription = this.route.queryParams.subscribe(res => {
    //   const videoId = res.id;
    //   if (videoId) {
    //     this.videoNotFound = false;
    //     this.getVideo(videoId);
    //     this.getTranscript(videoId);
    //   } else {
    //     // This is in case an id was not passed in to the page
    //     // If no id was passed in, then the error component will display
    //     this.videoNotFound = true;
    //   }
    // });
    this.querySubscription = this.route.queryParams.subscribe(res => {
      this.videoId = res.id;
      if (this.videoId) {
        this.videoNotFound = false;
        this.getVideo();
        this.getTranscript();
      } else {
        this.videoNotFound = true;
      }
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  getVideo() {
    if (this.data.getVideo(this.videoId) === 'not_found') {
      this.videoNotFound = true;
    } else {
      this.videoUrl = this.data.getVideo(this.videoId);
    }
  }

  getTranscript() {
    this.data.getTranscript(this.videoId).toPromise()
    .then((res: Transcript[]) => {
      this.videoTranscript = sortTranscript(res);
      this.getSpeakerIndices();
    })
    .catch(err => console.log(err));
  }

  isRep(snip: Transcript) {
    const speaker: string = snip.speaker;
    return speaker === 'Rep';
  }

  showName(index: number) {
    const isRep: boolean = this.videoTranscript[index].speaker === 'Rep';
    const holdIndex: number = isRep ? this.repIndexes.indexOf(index) : this.customerIndexes.indexOf(index);
    const prevIndex: number = isRep ? this.repIndexes[holdIndex - 1] : this.customerIndexes[holdIndex - 1];
    if (holdIndex === 0) {
      return true;
    } else {
      if (Math.abs(prevIndex - index) > 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  showCircle(index: number) {
    const isRep: boolean = this.videoTranscript[index].speaker === 'Rep';
    const holdIndex: number = isRep ? this.repIndexes.indexOf(index) : this.customerIndexes.indexOf(index);
    const nextIndex: number = isRep ? this.repIndexes[holdIndex + 1] : this.customerIndexes[holdIndex + 1];
    if (index === 0) {
      if (Math.abs(nextIndex - index) > 1) {
        return true;
      } else {
        return false;
      }
    } else if (index === this.videoTranscript.length - 1 ||
      (holdIndex === this.repIndexes.length - 1) ||
      (holdIndex === this.customerIndexes.length - 1)) {
      return true;
    } else {
      const prevIndex = isRep ? this.repIndexes[holdIndex - 1] : this.customerIndexes[holdIndex - 1];
      if ((Math.abs(nextIndex - index) > 1) && Math.abs(prevIndex - index) > 1 || Math.abs(nextIndex - index) > 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  toggleVideo(e: any) {
    this.playButton.nativeElement.style = 'display: none;';
    if (this.vid.nativeElement.paused) {
      this.vid.nativeElement.play();
    } else {
      this.vid.nativeElement.pause();
    }
  }

  getSpeakerIndices() {
    for (let i = 0; i < this.videoTranscript.length; i++) {
      const snip = this.videoTranscript[i];
      if (snip.speaker === 'Rep') {
        // get rep indexes
        this.repIndexes.push(i);
      } else {
        // get customer indexes
        this.customerIndexes.push(i);
      }
    }
  }
}

// Helper functions go outside of the component class
const sortTranscript = (list: Transcript[]) => {
  return list.sort((a: any, b: any) => {
    return a.time - b.time;
  });
};

