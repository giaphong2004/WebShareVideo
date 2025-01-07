import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../../service/video/video.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommentsService } from '../../../service/comments.service';
import { UserService } from '../../../service/user/user.service';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  standalone: false,
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  video: any; // Sử dụng tên biến video để nhất quán với template
  similarVideos: any[] = []; // Sử dụng tên biến similarVideos để nhất quán với template
  safeUrl: SafeResourceUrl | null = null; // Sử dụng tên biến safeUrl để nhất quán với template
  likeCount: number = 0; // Thêm likeCount để lưu số lượt like
  dislikeCount: number = 0; // Thêm dislikeCount để lưu số lượt dislike
  hasLiked: boolean = false; // Thêm hasLiked để kiểm tra xem người dùng đã like chưa
  hasDisliked: boolean = false; // Thêm hasDisliked để kiểm tra xem người dùng đã dislike chưa
  newComment: string = ''; // Thêm newComment để lưu nội dung comment mới
  comments: {
    comment: string;
    user_uname: string; // Thêm user_uname để lưu tên người dùng
    video_id: number;
  }[] = [];

  currentUserId: number = 1; // Thêm currentUserId để lưu id người dùng hiện tại

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private sanitizer: DomSanitizer,
    private commentsService: CommentsService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const video_id = params['video_id'];
      this.loadVideo(video_id);
      this.loadSimilarVideos(video_id);
      this.loadComments(video_id);
    });
    // Lấy thông tin người dùng hiện tại
    const currentUserId = this.commentsService.getUserId();
    console.log('aklsfjadfj user ID:', currentUserId); // Thêm log để kiểm tra dữ liệu
  }

  loadVideo(video_id: number) {
    this.videoService.getVideoById(video_id).subscribe(
      (data) => {
        console.log('Video data:', data); // Thêm log để kiểm tra dữ liệu
        if (data) {
          this.video = data; // Truy cập đối tượng video
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://www.youtube.com/embed/' + this.video.url_video
          );
        }
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  loadSimilarVideos(video_id: number) {
    this.videoService.getSimilarVideos(video_id).subscribe(
      (data) => {
        console.log('Similar videos data:', data); // Thêm log để kiểm tra dữ liệu
        this.similarVideos = data;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }

  checkIfLiked(video_id: number) {
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    this.hasLiked = likedVideos.includes(video_id);
    if (this.hasLiked) {
      this.likeCount++;
    }
  }

  checkIfDisliked(video_id: number) {
    const dislikedVideos = JSON.parse(
      localStorage.getItem('dislikedVideos') || '[]'
    );
    this.hasDisliked = dislikedVideos.includes(video_id);
    if (this.hasDisliked) {
      this.dislikeCount++;
    }
  }

  likeVideo(): void {
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    const dislikedVideos = JSON.parse(
      localStorage.getItem('dislikedVideos') || '[]'
    );

    if (this.hasLiked) {
      this.likeCount--;
      this.hasLiked = false;
      const index = likedVideos.indexOf(this.video.id);
      if (index > -1) {
        likedVideos.splice(index, 1);
      }
      localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    } else {
      this.likeCount++;
      this.hasLiked = true;
      likedVideos.push(this.video.id);
      localStorage.setItem('likedVideos', JSON.stringify(likedVideos));

      // Nếu đã dislike, hủy dislike
      if (this.hasDisliked) {
        this.dislikeCount--;
        this.hasDisliked = false;
        const index = dislikedVideos.indexOf(this.video.id);
        if (index > -1) {
          dislikedVideos.splice(index, 1);
        }
        localStorage.setItem('dislikedVideos', JSON.stringify(dislikedVideos));
      }
    }
  }

  dislikeVideo(): void {
    const dislikedVideos = JSON.parse(
      localStorage.getItem('dislikedVideos') || '[]'
    );
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');

    if (this.hasDisliked) {
      this.dislikeCount--;
      this.hasDisliked = false;
      const index = dislikedVideos.indexOf(this.video.id);
      if (index > -1) {
        dislikedVideos.splice(index, 1);
      }
      localStorage.setItem('dislikedVideos', JSON.stringify(dislikedVideos));
    } else {
      this.dislikeCount++;
      this.hasDisliked = true;
      dislikedVideos.push(this.video.id);
      localStorage.setItem('dislikedVideos', JSON.stringify(dislikedVideos));

      // Nếu đã like, hủy like
      if (this.hasLiked) {
        this.likeCount--;
        this.hasLiked = false;
        const index = likedVideos.indexOf(this.video.id);
        if (index > -1) {
          likedVideos.splice(index, 1);
        }
        localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
      }
    }
  }

  // loadComments(video_id: number) {
  //   this.commentsService.getComments(video_id).subscribe(
  //     (data) => {
  //       console.log('Comments data:', data); // Thêm log để kiểm tra dữ liệu
  //       this.comments = data;
  //     },
  //     (error) => {
  //       console.error('Error loading comments:', error);
  //     }
  //   );
  // }
  loadComments(video_id: number) {
    this.commentsService.getComments(video_id).subscribe((data) => {
      console.log('Comments data:', data);
      this.comments = data;
    });
  }
  //thêm comment
  addComment(): void {
    if (this.newComment) {
      if (this.currentUserId !== null || this.currentUserId !== 0) {
        this.commentsService
          .addComment(this.currentUserId, this.video.video_id, this.newComment)
          .subscribe(
            (data) => {
              console.log('Comment added:', data); // Thêm log để kiểm tra dữ liệu
              this.loadComments(this.video.id);
              this.newComment = '';
            },
            (error) => {
              console.error('Error adding comment:', error);
            }
          );
      } else {
        console.error('User ID is null, cannot add comment.');
      }
    }
  }

  shareVideo(): void {
    const videoUrl = window.location.href; // Lấy URL hiện tại
    if (navigator.share) {
      // Kiểm tra xem trình duyệt có hỗ trợ chia sẻ không
      navigator
        .share({
          // Sử dụng API chia sẻ
          title: this.video.title,
          text: 'Check out this video!', // Thêm text để chia sẻ
          url: videoUrl, // Chia sẻ URL hiện tại
        })
        .then(() => {
          console.log('Thanks for sharing!'); // Thêm log để kiểm tra dữ liệu
        })
        .catch(console.error);
    } else {
      this.copyToClipboard(videoUrl); // Sao chép URL nếu trình duyệt không hỗ trợ chia sẻ
      alert('Lưu vào clipboard!'); // Thông báo cho người dùng
    }
  }

  copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea'); // Tạo một textarea ẩn
    textarea.value = text; // Gán giá trị cần sao chép
    document.body.appendChild(textarea); // Thêm vào body
    textarea.select(); // Chọn textarea
    document.execCommand('copy'); // Sao chép
    document.body.removeChild(textarea); // Xóa textarea
  }
}
