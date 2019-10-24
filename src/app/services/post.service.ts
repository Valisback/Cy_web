import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private webReqService: WebRequestService) {}
    createPost(title: string) {
      // Send a we request to create a post
      return this.webReqService.post('posts', {title});
    }

    retrievePosts() {
      return this.webReqService.get('posts');
    }
}
