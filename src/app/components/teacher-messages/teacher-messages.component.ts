import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherDataService } from '../../core/services/teacher-data.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Conversation, Announcement } from '../../core/models/teacher-communication.models';

@Component({
  selector: 'app-teacher-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-messages.component.html',
  styleUrls: ['./teacher-messages.component.css']
})
export class TeacherMessagesComponent implements OnInit {
  private teacherDataService = inject(TeacherDataService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  conversations: Conversation[] = [];
  announcements: Announcement[] = [];
  activeTab: 'messages' | 'announcements' = 'messages';
  unreadCount = 0;

  ngOnInit(): void {
    this.loadConversations();
    this.loadAnnouncements();
  }

  loadConversations(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.teacherDataService.getConversations(user.id).subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
      }
    });
  }

  loadAnnouncements(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.teacherDataService.getAnnouncements(user.id).subscribe({
      next: (announcements) => {
        this.announcements = announcements;
      }
    });
  }

  createAnnouncement(): void {
    this.notificationService.showSuccess('Announcement creation form coming soon!');
  }
}
