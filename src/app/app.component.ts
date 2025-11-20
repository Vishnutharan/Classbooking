import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationsToastComponent } from "./Componat/notifications-toast/notifications-toast.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationsToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Classbooking';
}
