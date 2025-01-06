import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../../../service/video/video.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommentsService } from '../../../service/comments.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  standalone: false,
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  video: any; // Sử dụng tên biến video để nhất quán với template
  similarVideos: any[] = [];
  safeUrl: SafeResourceUrl | null = null;
  likeCount: number = 0;
  dislikeCount: number = 0;
  hasLiked: boolean = false;
  hasDisliked: boolean = false;
  newComment: string = '';
  comments: { id: number; username: string; text: string }[] = [];
  currentUsername: string = '';

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private sanitizer: DomSanitizer,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const video_id = params['video_id'];
      this.loadVideo(video_id);
      this.loadSimilarVideos(video_id);
    });
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
  addComment(): void {
    if (this.newComment.trim()) {
      const comment = {
        videoId: this.video.id,
        username: this.currentUsername,
        text: this.newComment,
      };
      this.commentsService.addComment(comment).subscribe(
        (response: any) => {
          this.comments.push({
            id: response.id,
            username: this.currentUsername,
            text: this.newComment,
          });
          this.newComment = '';
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }

  deleteComment(commentId: number): void {
    this.commentsService.deleteComment(commentId).subscribe(
      () => {
        this.comments = this.comments.filter(
          (comment) => comment.id !== commentId
        );
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  updateComment(commentId: number, newText: string): void {
    this.commentsService.updateComment(commentId, newText).subscribe(
      () => {
        const comment = this.comments.find(
          (comment) => comment.id === commentId
        );
        if (comment) {
          comment.text = newText;
        }
      },
      (error) => {
        console.error('Error updating comment:', error);
      }
    );
  }

  loadComments(video_id: number) {
    this.commentsService.getComments(video_id).subscribe(
      (data) => {
        this.comments = data;
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
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
