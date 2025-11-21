import { Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    template: `
    <div class="calendar-container">
      <full-calendar [options]="calendarOptions"></full-calendar>
    </div>
  `,
    styles: [`
    .calendar-container {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    :host ::ng-deep .fc-toolbar-title {
      font-size: 1.2rem;
    }
    :host ::ng-deep .fc-button-primary {
      background-color: #3f51b5;
      border-color: #3f51b5;
    }
  `]
})
export class CalendarComponent implements OnInit {
    @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

    @Input() events: EventInput[] = [];
    @Input() editable = false;
    @Input() selectable = false;
    @Input() initialView = 'timeGridWeek';

    @Output() slotSelected = new EventEmitter<DateSelectArg>();
    @Output() eventClicked = new EventEmitter<EventClickArg>();

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'timeGridWeek',
        weekends: true,
        editable: false,
        selectable: false,
        selectMirror: true,
        dayMaxEvents: true,
        allDaySlot: false,
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        height: 'auto',
        select: (arg) => this.handleDateSelect(arg),
        eventClick: (arg) => this.handleEventClick(arg)
    };

    ngOnInit() {
        this.calendarOptions.initialView = this.initialView;
        this.calendarOptions.editable = this.editable;
        this.calendarOptions.selectable = this.selectable;
        this.calendarOptions.events = this.events;
    }

    // Watch for changes in events input
    ngOnChanges() {
        if (this.calendarOptions) {
            this.calendarOptions.events = this.events;
        }
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        this.slotSelected.emit(selectInfo);
    }

    handleEventClick(clickInfo: EventClickArg) {
        this.eventClicked.emit(clickInfo);
    }
}
