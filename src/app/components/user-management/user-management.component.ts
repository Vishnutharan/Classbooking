import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models/shared.models';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  allUsers: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  searchQuery = '';
  filterRole = '';
  filterStatus = '';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  selectedUsers: Set<string> = new Set();
  showCreateModal = false;
  showEditModal = false;
  showSuspendModal = false;
  selectedUser: User | null = null;

  createForm!: FormGroup;
  editForm!: FormGroup;
  suspendReason = '';

  roles = ['Student', 'Teacher', 'Admin'];
  statuses = ['Active', 'Inactive', 'Suspended'];

  ngOnInit(): void {
    this.initForms();
    this.loadUsers();
  }

  private initForms(): void {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      role: ['Student', Validators.required],
      phoneNumber: ['']
    });

    this.editForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.email],
      phoneNumber: [''],
      role: ['Student', Validators.required]
    });
  }

  private loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers(1, 100).subscribe({
      next: (response) => {
        this.allUsers = response.users || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.showError('Failed to load users');
        this.isLoading = false;
      }
    });
  }

  private applyFilters(): void {
    let filtered = this.allUsers;

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(q) ||
        u.fullName.toLowerCase().includes(q)
      );
    }

    if (this.filterRole) {
      filtered = filtered.filter(u => u.role === this.filterRole);
    }

    if (this.filterStatus) {
      filtered = filtered.filter(u => u.status === this.filterStatus);
    }

    this.sortUsers(filtered);
    this.filteredUsers = filtered;
    this.calculatePagination();
  }

  private sortUsers(users: User[]): void {
    users.sort((a, b) => {
      let aVal = a[this.sortBy as keyof User];
      let bVal = b[this.sortBy as keyof User];

      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getDisplayedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  toggleUserSelection(userId: string): void {
    if (this.selectedUsers.has(userId)) {
      this.selectedUsers.delete(userId);
    } else {
      this.selectedUsers.add(userId);
    }
  }

  selectAllDisplayed(): void {
    this.getDisplayedUsers().forEach(u => this.selectedUsers.add(u.id));
  }

  deselectAll(): void {
    this.selectedUsers.clear();
  }

  openCreateModal(): void {
    this.createForm.reset({ role: 'Student' });
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createUser(): void {
    if (this.createForm.invalid) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    this.adminService.createUser(this.createForm.value).subscribe({
      next: () => {
        this.notificationService.showSuccess('User created successfully');
        this.closeCreateModal();
        this.loadUsers();
      },
      error: () => {
        this.notificationService.showError('Failed to create user');
      }
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue(user);
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  updateUser(): void {
    if (this.editForm.invalid || !this.selectedUser) {
      this.notificationService.showWarning('Please fill all required fields');
      return;
    }

    this.adminService.updateUser(this.selectedUser.id, this.editForm.value).subscribe({
      next: () => {
        this.notificationService.showSuccess('User updated successfully');
        this.closeEditModal();
        this.loadUsers();
      },
      error: () => {
        this.notificationService.showError('Failed to update user');
      }
    });
  }

  openSuspendModal(user: User): void {
    this.selectedUser = user;
    this.suspendReason = '';
    this.showSuspendModal = true;
  }

  closeSuspendModal(): void {
    this.showSuspendModal = false;
    this.selectedUser = null;
  }

  suspendUser(): void {
    if (!this.selectedUser || !this.suspendReason.trim()) {
      this.notificationService.showWarning('Please provide a suspension reason');
      return;
    }

    this.adminService.suspendUser(this.selectedUser.id, this.suspendReason).subscribe({
      next: () => {
        this.notificationService.showSuccess('User suspended');
        this.closeSuspendModal();
        this.loadUsers();
      },
      error: () => {
        this.notificationService.showError('Failed to suspend user');
      }
    });
  }

  activateUser(user: User): void {
    this.adminService.activateUser(user.id).subscribe({
      next: () => {
        this.notificationService.showSuccess('User activated');
        this.loadUsers();
      },
      error: () => {
        this.notificationService.showError('Failed to activate user');
      }
    });
  }

  exportSelected(): void {
    if (this.selectedUsers.size === 0) {
      this.notificationService.showWarning('Please select users to export');
      return;
    }

    const selected = Array.from(this.selectedUsers)
      .map(id => this.allUsers.find(u => u.id === id))
      .filter(u => u) as User[];

    const csv = this.generateCSV(selected);
    this.downloadCSV(csv);
  }

  private generateCSV(users: User[]): string {
    const headers = ['ID', 'Email', 'Full Name', 'Role', 'Status', 'Created At', 'Last Login'];
    const rows = users.map(u => [
      u.id,
      u.email,
      u.fullName,
      u.role,
      u.status,
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
      u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private downloadCSV(csv: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-${Date.now()}.csv`;
    link.click();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
