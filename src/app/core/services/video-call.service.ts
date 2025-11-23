import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface VideoCallState {
  isInCall: boolean;
  channelName?: string;
  localStream?: MediaStream;
  remoteStreams: Map<string, MediaStream>;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private initialState: VideoCallState = {
    isInCall: false,
    remoteStreams: new Map(),
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false
  };

  private callStateSubject = new BehaviorSubject<VideoCallState>(this.initialState);
  public callState$ = this.callStateSubject.asObservable();

  // Placeholder for Agora/Jitsi API client
  private client: any;

  constructor() {
    // Initialize SDK here
  }

  async joinCall(channel: string, token: string, uid: string): Promise<void> {
    console.log(`Joining channel ${channel} as ${uid}`);
    // Mock joining logic
    this.updateState({ isInCall: true, channelName: channel });
    
    try {
      // Mock acquiring local media
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.updateState({ localStream: stream });
    } catch (err) {
      console.error('Failed to get local stream', err);
    }
  }

  leaveCall(): void {
    console.log('Leaving call');
    const state = this.callStateSubject.value;
    state.localStream?.getTracks().forEach(track => track.stop());
    
    this.updateState({
      ...this.initialState,
      isInCall: false
    });
  }

  toggleAudio(): void {
    const current = this.callStateSubject.value.isMuted;
    this.updateState({ isMuted: !current });
    // Logic to mute local stream track
    if (this.callStateSubject.value.localStream) {
      this.callStateSubject.value.localStream.getAudioTracks().forEach(t => t.enabled = current); // Toggle
    }
  }

  toggleVideo(): void {
    const current = this.callStateSubject.value.isVideoOff;
    this.updateState({ isVideoOff: !current });
    // Logic to disable local video track
    if (this.callStateSubject.value.localStream) {
      this.callStateSubject.value.localStream.getVideoTracks().forEach(t => t.enabled = current); // Toggle
    }
  }

  async startScreenShare(): Promise<void> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      this.updateState({ isScreenSharing: true });
      // Logic to replace video track with screen track
    } catch (err) {
      console.error('Error sharing screen', err);
    }
  }

  private updateState(newState: Partial<VideoCallState>): void {
    this.callStateSubject.next({ ...this.callStateSubject.value, ...newState });
  }
}