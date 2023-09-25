import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../_model/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  searchText: string = '';
  suggestions: string[] = [];
  currentPage: number = 1;
  pageSize: number = 7;
  totalItems: number = 0;

  constructor(private userService: UserService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.totalItems = this.users.length;
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  deleteUser(userId: number) {
    const newState = 'INACTIVE';
    this.userService.updateUserState(userId, newState).subscribe(() => {
      this.loadUsers();
    });
  }

  onSearchInputChange(): void {
    const searchTerms = this.searchText.trim().toLowerCase().split(' ');

    if (searchTerms.length === 0) {
      this.loadUsers();
    } else {
      this.userService.getUsers().subscribe((data) => {
        this.users = data.filter((user) => {
          return searchTerms.every((term) => {
            if (!isNaN(Number(term))) {
              return user.id.toString().toLowerCase().includes(term);
            } else {
              return Object.values(user).some((value) => {
                if (typeof value === 'string') {
                  return value.toLowerCase().includes(term);
                }
                return false;
              });
            }
          });
        });
      });
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchText = suggestion;
    this.onSearchInputChange();
    this.suggestions = [];
  }

  showSuggestions(input: string) {
    this.suggestions = [];

    for (let i = 1; i <= input.length; i++) {
      const suggestion = input.slice(0, i);
      this.suggestions.push(`Suggestion for ${suggestion}`);
    }
  }

  openDeleteConfirmationDialog(userId: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: userId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteUser(userId);
      }
    });
  }

  getRoleDisplayName(userRoles: string): string {
    if (userRoles.includes('ROLE_USER')) {
      return 'User';
    } else if (userRoles.includes('ROLE_ADMIN')) {
      return 'Admin';
    } else {
      return 'Other';
    }
  }

  getPaginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.users.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

}

