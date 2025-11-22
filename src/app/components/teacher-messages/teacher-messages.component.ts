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
  template: `
    <div class="messages-container">
      <div class="header">
        <h1>💬 Messages & Announcements</h1>
        <button class="btn-primary" (click)="createAnnouncement()">📢 New Announcement</button>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'messages'" (click)="activeTab = 'messages'">
          Messages <span class="badge">{{ unreadCount }}</span>
        </button>
        <button class="tab" [class.active]="activeTab === 'announcements'" (click)="activeTab = 'announcements'">
          Announcements
        </button>
      </div>

      <!-- Messages Tab -->
      <div *ngIf="activeTab === 'messages'" class="messages-list">
        <div class="conversation-card" *ngFor="let conv of conversations">
          <div class="conversation-header">
            <div class="participant-info">
              <div class="avatar">{{ (conv.participants[1].name || '?')[0] }}</div>
              <div>
                <h3>{{ conv.participants[1].name || 'Unknown' }}</h3>
                <p class="subject">{{ conv.subject }}</p>
              </div>
            </div>
            <span *ngIf="conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</span>
          </div>
          <p class="last-message">{{ conv.lastMessage.content || 'No messages yet' }}</p>
          <small class="timestamp">{{ conv.updatedAt | date:'MMM dd, yyyy HH:mm' }}</small>
        </div>

        <div *ngIf="conversations.length === 0" class="empty-state">
          <p>No conversations yet</p>
        </div>
      </div>

      <!-- Announcements Tab -->
      <div *ngIf="activeTab === 'announcements'" class="announcements-list">
        <div class="announcement-card" *ngFor="let ann of announcements">
          <div class="announcement-header">
            <h3>{{ ann.title }}</h3>
            <span *ngIf="ann.isPinned" class="pin-icon">📌</span>
          </div>
          <p>{{ ann.content }}</p>
          <div class="announcement-meta">
            <span>👥 {{ ann.recipientType }}</span>
            <span>👁️ {{ ann.viewCount }} views</span>
            <span>{{ ann.sentAt | date:'MMM dd, yyyy' }}</span>
          </div>
        </div>

        <div *ngIf="announcements.length === 0" class="empty-state">
          <p>No announcements yet</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messages-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h1 { font-size: 2rem; color: #333; margin: 0; }
    .btn-primary { padding: 0.75rem 1.5rem; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; }
    .tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid #e0e0e0; }
    .tab { padding: 1rem 2rem; background: none; border: none; font-size: 1rem; cursor: pointer; position: relative; color: #666; }
    .tab.active { color: #667eea; border-bottom: 3px solid #667eea; }
    .badge { background: #f44336; color: white; padding: 0.25rem 0.5rem; border-radius: 10px; font-size: 0.75rem; margin-left: 0.5rem; }
    .messages-list, .announcements-list { display: flex; flex-direction: column; gap: 1rem; }
    .conversation-card { background: white; border: 2px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; }
    .conversation-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-color: #667eea; }
    .conversation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .participant-info { display: flex; gap: 1rem; align-items: center; }
    .avatar { width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; }
    .participant-info h3 { margin: 0; color: #333; font-size: 1.1rem; }
    .subject { margin: 0.25rem 0 0; color: #666; font-size: 0.9rem; }
    .unread-badge { background: #f44336; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
    .last-message { color: #666; margin: 0 0 0.5rem; }
    .timestamp { color: #999; font-size: 0.85rem; }
    .announcement-card { background: #fff9e6; border: 2px solid #ffd54f; border-radius: 12px; padding: 1.5rem; }
    .announcement-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .announcement-header h3 { margin: 0; color: #333; }
    .pin-icon { font-size: 1.5rem; }
    .announcement-card p { color: #333; margin: 0 0 1rem; line-height: 1.6; }
    .announcement-meta { display: flex; gap: 1.5rem; font-size: 0.9rem; color: #666; }
    .empty-state { text-align: center; padding: 3rem; color: #999; }
  `]
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
