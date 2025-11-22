import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeePayment } from '../../core/models/admin.models';

@Component({
    selector: 'app-fee-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './fee-management.component.html',
    styleUrls: ['./fee-management.component.css']
})
export class FeeManagementComponent implements OnInit {
    payments: FeePayment[] = [];
    filteredPayments: FeePayment[] = [];
    searchTerm: string = '';

    // Form model
    newPayment: Partial<FeePayment> = {
        type: 'Monthly Fee',
        status: 'Paid',
        year: new Date().getFullYear(),
        month: new Date().toLocaleString('default', { month: 'long' })
    };

    showAddModal: boolean = false;

    ngOnInit(): void {
        this.loadDemoData();
    }

    loadDemoData() {
        // Sri Lankan context demo data
        this.payments = [
            {
                id: 'PAY-001',
                studentId: 'ST-2023001',
                studentName: 'Kasun Perera',
                amount: 2500,
                month: 'October',
                year: 2023,
                date: new Date('2023-10-05'),
                status: 'Paid',
                type: 'Monthly Fee'
            },
            {
                id: 'PAY-002',
                studentId: 'ST-2023002',
                studentName: 'Nimali Fernando',
                amount: 2500,
                month: 'October',
                year: 2023,
                date: new Date('2023-10-06'),
                status: 'Paid',
                type: 'Monthly Fee'
            },
            {
                id: 'PAY-003',
                studentId: 'ST-2023003',
                studentName: 'Ruwan Silva',
                amount: 1000,
                month: 'October',
                year: 2023,
                date: new Date('2023-10-10'),
                status: 'Pending',
                type: 'Exam Fee'
            }
        ];
        this.filteredPayments = [...this.payments];
    }

    filterPayments() {
        if (!this.searchTerm) {
            this.filteredPayments = [...this.payments];
        } else {
            const term = this.searchTerm.toLowerCase();
            this.filteredPayments = this.payments.filter(p =>
                p.studentName.toLowerCase().includes(term) ||
                p.studentId.toLowerCase().includes(term)
            );
        }
    }

    openAddModal() {
        this.showAddModal = true;
    }

    closeAddModal() {
        this.showAddModal = false;
        // Reset form
        this.newPayment = {
            type: 'Monthly Fee',
            status: 'Paid',
            year: new Date().getFullYear(),
            month: new Date().toLocaleString('default', { month: 'long' })
        };
    }

    savePayment() {
        if (this.newPayment.studentName && this.newPayment.amount) {
            const payment: FeePayment = {
                id: `PAY-${Date.now()}`,
                studentId: this.newPayment.studentId || 'ST-TEMP',
                studentName: this.newPayment.studentName,
                amount: this.newPayment.amount,
                month: this.newPayment.month || 'Current',
                year: this.newPayment.year || 2023,
                date: new Date(),
                status: this.newPayment.status as any,
                type: this.newPayment.type as any
            };

            this.payments.unshift(payment);
            this.filterPayments();
            this.closeAddModal();
        }
    }

    printReceipt(payment: FeePayment) {
        console.log('Printing receipt for', payment.id);
        alert(`Receipt generated for ${payment.studentName} - ${payment.amount} LKR`);
    }
}
