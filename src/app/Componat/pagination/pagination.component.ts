import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  @Input() maxPageButtons: number = 7;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  totalPages: number = 0;
  pageNumbers: (number | string)[] = [];
  startItem: number = 0;
  endItem: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.calculatePagination();
    }
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    this.endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);

    this.pageNumbers = this.generatePageNumbers();
  }

  private generatePageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];

    if (this.totalPages <= this.maxPageButtons) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfWindow = Math.floor(this.maxPageButtons / 2);
      let start = Math.max(1, this.currentPage - halfWindow);
      let end = Math.min(this.totalPages, this.currentPage + halfWindow);

      if (start === 1) {
        end = Math.min(this.totalPages, this.maxPageButtons);
      } else if (end === this.totalPages) {
        start = Math.max(1, this.totalPages - this.maxPageButtons + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < this.totalPages) {
        if (end < this.totalPages - 1) {
          pages.push('...');
        }
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  onPreviousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onPageSelect(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(event: any): void {
    const newSize = parseInt(event.target.value, 10);
    if (newSize !== this.itemsPerPage) {
      this.pageSizeChange.emit(newSize);
    }
  }
}