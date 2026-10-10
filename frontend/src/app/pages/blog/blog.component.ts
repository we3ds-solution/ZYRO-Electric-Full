import { Component } from '@angular/core';
import { BLOG_POSTS, BlogPost } from './data';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  blogPosts: BlogPost[] = BLOG_POSTS;
}
