import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AssetService } from '../_services/asset.service';
import { Asset } from '../_model/asset.model';
import { NgForm } from '@angular/forms';
import { AssetTypeService } from '../_services/asset-type.service';
import { UserService } from '../_services/user.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-asset-management',
  templateUrl: './asset-management.component.html',
  styleUrls: ['./asset-management.component.css']
})

export class AssetManagementComponent implements OnInit {
  assets: Asset[] = [];
  filteredAssets: Asset[] = [];
  searchAssetText: string = '';
  suggestions: string[] = [];
  selectedAsset: Asset | null = null;
  originalAsset: Asset | null = null;
  assetTypes: any[] = [];
  users: any[] = [];
  shouldShowAddAsset: boolean = false;
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;

  assetData = {
    assetName: '',
    typeName: '',
  };


  constructor(private assetService: AssetService, private cdr: ChangeDetectorRef, private assetTypeService: AssetTypeService, private userService: UserService, private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.loadAsset();
    this.loadAssetTypes();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data: any[]) => {
        console.log('Response from getUsers API:', data);
        this.users = data;
        console.log(this.users);

      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }


  loadAsset() {
    this.assetService.getAllAssets().subscribe((data: Asset[]) => {
      this.assets = data;
      this.filteredAssets = data;
      this.cdr.detectChanges();
    });
  }

  addAsset(addAssetForm: NgForm) {
    const assetName = this.assetData?.assetName?.trim();
    const assetTypeName = this.assetData?.typeName;

    if (!assetName || assetName.length < 4) {
      const errorMessage = assetName ? 'Asset name must be at least 4 characters' : 'Asset name cannot be empty';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'error-snackbar',
      });
      return;
    }

    if (!assetTypeName) {
      this.snackBar.open('Please select an asset type', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'error-snackbar',
      });
      return;
    }

    this.assetService.addAsset(this.assetData).subscribe(
      (response) => {
        console.log('Asset Add successful:', response);
        this.loadAsset();
        addAssetForm.resetForm();

        this.snackBar.open('Asset added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'success-snackbar',
        });
      },
      (error) => {
        console.error('Asset Add failed:', error);
        this.snackBar.open('Failed to add asset', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-snackbar',
        });
      }
    );
  }

  deleteAssetById(assetId: number) {
    this.assetService.deleteAssetById(assetId).subscribe(
      (response) => {
        console.log('Asset type deleted successfully:', response);
        this.assets = this.assets.filter((asset) => asset.assetId !== assetId);
        this.filteredAssets = this.filteredAssets.filter((asset) => asset.assetId !== assetId);
      },
      (error) => {
        console.error('Asset deletion failed:', error);
      }
    );
  }

  searchAsset() {
    if (this.searchAssetText.trim() === '') {
      this.loadAsset();
    } else {
      this.filteredAssets = this.assets.filter((asset: any) => {
        return Object.values(asset).some((value: any) => {
          if (typeof value === 'string' || typeof value === 'number') {
            return value.toString().toLowerCase().includes(this.searchAssetText.toLowerCase());
          }
          return false;
        });
      });
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchAssetText = suggestion;
    this.searchAsset();
    this.suggestions = [];
  }

  showSuggestions() {
    this.suggestions = [
      `Suggestion 1 for ${this.searchAssetText}`,
      `Suggestion 2 for ${this.searchAssetText}`,
    ];
  }

  editAsset(asset: Asset) {
    this.selectedAsset = { ...asset };
    console.log(this.selectedAsset);

    this.originalAsset = { ...asset };
  }

  updateAsset(updatedAsset: Asset) {
    if (updatedAsset.assetStatus === 'IN_USE' && !updatedAsset.user) {
      this.snackBar.open('Please select a user when the status is IN USE.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    } else {
      const isUserSelected = updatedAsset.user !== null;

      if (!isUserSelected) {
        updatedAsset.user = null;
      }

      const updateRequest = {
        user: updatedAsset.user,
        status: updatedAsset.assetStatus
      };

      this.assetService.updateAsset(updatedAsset.assetId, updateRequest).subscribe(
        (response: any) => {
          console.log('Asset updated successfully:', response);
          const index = this.assets.findIndex(asset => asset.assetId === updatedAsset.assetId);
          if (index !== -1) {
            this.assets[index] = {
              ...this.assets[index],
              assetStatus: updatedAsset.assetStatus,
              user: updatedAsset.user
            };
          }
          this.selectedAsset = null;
          this.snackBar.open(`Asset ${updatedAsset.assetName} updated successfully`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
          this.loadAsset();
        },
        (error) => {
          console.error('Asset update failed:', error);
          this.snackBar.open('Failed to update asset', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      );
    }
  }

  cancelEdit() {
    if (this.originalAsset) {
      this.selectedAsset = { ...this.originalAsset };
      this.originalAsset = null;

      this.snackBar.open('Edit canceled', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['info-snackbar'],
      });
    } else {
      this.selectedAsset = null;
    }
  }


  loadAssetTypes() {
    this.assetTypeService.getAllAssetTypes().subscribe(
      (data: any[]) => {
        this.assetTypes = data;
      },
      (error) => {
        console.error('Error fetching asset types:', error);
      }
    );
  }

  toggleDropdown(event: MouseEvent) {
    const selectElement = event.target as HTMLSelectElement;
    selectElement.focus();
  }

  openDeleteConfirmationDialog(asset: Asset) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: asset,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteAssetById(asset.assetId);
      }
    });
  }

  getStatusDisplayName(assetStatus: string): string {
    switch (assetStatus) {
      case 'IN_USE':
        return 'In Use';
      case 'AVAILABLE':
        return 'Available';
      case 'UNDER_REPAIR':
        return 'Under Repair';
      default:
        return 'Other';
    }
  }

  onAssetStatusChange() {
    if (this.selectedAsset && (this.selectedAsset.assetStatus === 'UNDER_REPAIR' || this.selectedAsset.assetStatus === 'AVAILABLE')) {
      this.selectedAsset.user = null;
    }
  }

  getUserNameById(id: any) {
    console.log(this.users)
    const user = this.users.find(u => u.id === id);
    if (user) return user?.firstName;
  }

  getPaginatedAssets(): Asset[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredAssets.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredAssets.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

}
