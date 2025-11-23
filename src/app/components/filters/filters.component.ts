import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  key: string;
  label: string;
  type: 'checkbox' | 'dropdown' | 'multiselect';
  options?: { label: string; value: any }[];
  value?: any;
}

export interface FilterConfig {
  filters: FilterOption[];
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {
  @Input() filterConfig: FilterConfig = { filters: [] };
  @Output() filtersApplied = new EventEmitter<any>();
  @Output() filtersReset = new EventEmitter<void>();

  filters: FilterOption[] = [];
  activeFilters: any[] = [];
  filtersExpanded = true;

  ngOnInit(): void {
    this.filters = JSON.parse(JSON.stringify(this.filterConfig.filters));
  }

  isOptionSelected(filterKey: string, optionValue: any): boolean {
    const filter = this.filters.find(f => f.key === filterKey);
    if (filter && Array.isArray(filter.value)) {
      return filter.value.includes(optionValue);
    }
    return false;
  }

  onMultiselectChange(filterKey: string, event: any): void {
    const filter = this.filters.find(f => f.key === filterKey);
    if (filter) {
      if (!Array.isArray(filter.value)) {
        filter.value = [];
      }
      if (event.target.checked) {
        filter.value.push(event.target.value);
      } else {
        filter.value = filter.value.filter((v: any) => v !== event.target.value);
      }
    }
  }

  onFilterChange(): void {
    this.updateActiveFilters();
  }

  private updateActiveFilters(): void {
    this.activeFilters = this.filters
      .filter(f => f.value && (typeof f.value === 'string' || typeof f.value === 'number' || (Array.isArray(f.value) && f.value.length > 0)))
      .map(f => ({
        key: f.key,
        label: f.label,
        value: Array.isArray(f.value) ? f.value.join(', ') : f.value
      }));
  }

  removeFilter(filterKey: string): void {
    const filter = this.filters.find(f => f.key === filterKey);
    if (filter) {
      if (filter.type === 'multiselect') {
        filter.value = [];
      } else {
        filter.value = filter.type === 'checkbox' ? false : '';
      }
      this.updateActiveFilters();
    }
  }

  applyFilters(): void {
    const appliedFilters: any = {};
    this.filters.forEach(f => {
      if (f.value && (typeof f.value === 'string' || typeof f.value === 'number' || (Array.isArray(f.value) && f.value.length > 0))) {
        appliedFilters[f.key] = f.value;
      }
    });
    this.filtersApplied.emit(appliedFilters);
  }

  resetFilters(): void {
    this.filters.forEach(f => {
      if (f.type === 'multiselect') {
        f.value = [];
      } else if (f.type === 'checkbox') {
        f.value = false;
      } else {
        f.value = '';
      }
    });
    this.activeFilters = [];
    this.filtersReset.emit();
  }

  toggleFilters(): void {
    this.filtersExpanded = !this.filtersExpanded;
  }
}
