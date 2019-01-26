import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// import * as mock from '../../mocks/transcript';
import { DataServiceService } from '../data-service.service';
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

  constructor(
    private route: ActivatedRoute,
    private data: DataServiceService
  ) {
  }

  ngOnInit() {
    this.querySubscription = this.route.queryParams.subscribe(res => {
      const videoId = res.id;
      if (videoId) {
        this.getVideo(videoId);
        this.getTranscript(videoId);
      }
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  getVideo(id: string) {
    this.videoUrl = this.data.getVideo(id);
  }

  getTranscript(id: string) {
    this.data.getTranscript(id).toPromise()
    .then((res: Transcript[]) => {
      this.videoTranscript = sortTranscript(res);
      this.getSpeakerIndices();
      console.log('repindexes', this.repIndexes);
    })
    .catch(err => console.log(err));
  }

  isRep(snip: Transcript) {
    const speaker = snip.speaker;
    return speaker === 'Rep';
  }

  showName(index: number) {
    const isRep = this.videoTranscript[index].speaker === 'Rep';
    const holdIndex = isRep ? this.repIndexes.indexOf(index) : this.customerIndexes.indexOf(index);
    const prevIndex = isRep ? this.repIndexes[holdIndex - 1] : this.customerIndexes[holdIndex - 1];
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
    const isRep = this.videoTranscript[index].speaker === 'Rep';
    const holdIndex = isRep ? this.repIndexes.indexOf(index) : this.customerIndexes.indexOf(index);
    const nextIndex = isRep ? this.repIndexes[holdIndex + 1] : this.customerIndexes[holdIndex + 1];
    if (index === this.videoTranscript.length - 1) {
      return true;
    } else {
      if (Math.abs(nextIndex - index) > 1) {
        return true;
      } else {
        return false;
      }
    }
    // const repIndex = this.repIndexes.indexOf(index);
    // if (repIndex === this.videoTranscript.length - 1) {
    //   return true;
    // } else {
    //   const nextIndex = this.repIndexes[repIndex + 1];
    //   if (Math.abs(nextIndex - index) > 1) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }
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

