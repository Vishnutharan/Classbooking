import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

export type SearchType = 'teacher' | 'subject' | 'content' | 'generic';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() searchType: SearchType = 'generic';
  @Input() debounceTime = 300;
  @Input() maxRecentSearches = 5;
  @Input() placeholder = '🔍 Search...';

  @Output() searchQuery$ = new EventEmitter<string>();
  @Output() resultSelected = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  searchQuery = '';
  results: any[] = [];
  recentSearches: string[] = [];
  isLoading = false;
  showResults = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadRecentSearches();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.performSearch(query);
      });
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.showResults = true;
    if (query.trim()) {
      this.searchSubject.next(query);
    } else {
      this.results = [];
    }
  }

  private performSearch(query: string): void {
    this.isLoading = true;
    this.searchQuery$.emit(query);

    // Simulate API call
    setTimeout(() => {
      this.results = this.getMockResults(query);
      this.isLoading = false;
    }, 300);
  }

  private getMockResults(query: string): any[] {
    const mockResults = {
      teacher: [
        { icon: '👨‍🏫', title: 'Mr. Silva', subtitle: 'Mathematics • 4.9★ • LKR 500/hr', id: 1 },
        { icon: '👩‍🏫', title: 'Ms. Perera', subtitle: 'Science • 4.8★ • LKR 600/hr', id: 2 },
      ],
      subject: [
        { icon: '📚', title: 'Mathematics', subtitle: '45 teachers available', id: 1 },
        { icon: '🧪', title: 'Science', subtitle: '38 teachers available', id: 2 },
      ],
      content: [
        { icon: '📹', title: 'Algebra Basics', subtitle: 'Video • 30 mins', id: 1 },
        { icon: '📄', title: 'Physics Notes', subtitle: 'PDF • 15 pages', id: 2 },
      ],
      generic: [
        { icon: '👨‍🏫', title: 'Mr. Silva', subtitle: 'Teacher • Mathematics', id: 1 },
        { icon: '📚', title: 'Mathematics', subtitle: 'Subject • 45 teachers', id: 2 },
      ]
    };

    return mockResults[this.searchType] || [];
  }

  selectResult(result: any): void {
    this.addToRecentSearches(result.title);
    this.resultSelected.emit(result);
    this.clearSearch();
  }

  onRecentSearch(search: string): void {
    this.searchQuery = search;
    this.onSearchChange(search);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.results = [];
    this.showResults = false;
    this.searchInput.nativeElement.focus();
  }

  private loadRecentSearches(): void {
    const saved = sessionStorage.getItem('recentSearches');
    if (saved) {
      this.recentSearches = JSON.parse(saved).slice(0, this.maxRecentSearches);
    }
  }

  private addToRecentSearches(search: string): void {
    this.recentSearches = [search, ...this.recentSearches.filter(s => s !== search)].slice(0, this.maxRecentSearches);
    sessionStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }
}
