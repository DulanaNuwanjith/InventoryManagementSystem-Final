import { Component, OnInit } from '@angular/core';
import { AssetTypeService } from '../_services/asset-type.service';
import { NgForm } from '@angular/forms';
import { Asset } from '../_model/asset.model';
import { MatDialog } from '@angular/material/dialog';
import { AssetPopupComponent } from '../asset-popup/asset-popup.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

interface AssetType {
  typeId: number;
  typeName: string;
  isEditing: boolean;
  updatedName: string;
}

@Component({
  selector: 'app-asset-type-management',
  templateUrl: './asset-type-management.component.html',
  styleUrls: ['./asset-type-management.component.css']
})
export class AssetTypeManagementComponent implements OnInit {
  assetTypes: AssetType[] = [];
  searchAssetTypeText: string = '';
  suggestions: string[] = [];
  filteredAssetTypes: AssetType[] = [];
  typeName: string = '';
  currentPage: number = 1;
  pageSize: number = 6;

  assetTypeData = {
    typeName: '',
  };

  constructor(private assetTypeService: AssetTypeService,
    public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadAssetType();
  }

  loadAssetType() {
    this.assetTypeService.getAllAssetTypes().subscribe((data: AssetType[]) => {
      this.assetTypes = data.map(assetType => ({ ...assetType, isEditing: false, updatedName: assetType.typeName }));
      this.filteredAssetTypes = [...this.assetTypes];
    });
  }

  addAssetType(addAssetTypeForm: NgForm) {
    const assetTypeName = this.assetTypeData?.typeName?.trim();

    if (!assetTypeName || assetTypeName.length < 4) {
      const errorMessage = assetTypeName ? 'Asset type must be at least 4 characters' : 'Asset type cannot be empty';
      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'error-snackbar',
      });
      return;
    }

    this.assetTypeService.addAssetType({ typeName: assetTypeName }).subscribe(
      (response) => {
        console.log('Asset type Add successful:', response);
        addAssetTypeForm.resetForm();
        this.loadAssetType();

        this.snackBar.open('Asset type added successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'success-snackbar',
        });
      },
      (error) => {
        console.error('Asset type Add failed:', error);
        this.snackBar.open('Failed to add asset type', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-snackbar',
        });
      }
    );
  }

  searchAssetType() {
    if (this.searchAssetTypeText.trim() === '') {
      this.loadAssetType();
    } else {
      this.filteredAssetTypes = this.assetTypes.filter((assetType: any) => {
        return Object.values(assetType).some((value: any) => {
          if (typeof value === 'string' || typeof value === 'number') {
            return value.toString().toLowerCase().includes(this.searchAssetTypeText.toLowerCase());
          }
          return false;
        });
      });
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchAssetTypeText = suggestion;
    this.searchAssetType();
    this.suggestions = [];
  }

  showSuggestions() {
    this.suggestions = [
      `Suggestion 1 for ${this.searchAssetTypeText}`,
      `Suggestion 2 for ${this.searchAssetTypeText}`,
    ];
  }

  deleteAssetTypeByTypeId(typeId: number) {
    this.assetTypeService.deleteAssetTypeByTypeId(typeId).subscribe(
      (response) => {
        console.log('Asset type deleted successfully:', response);
        this.assetTypes = this.assetTypes.filter((assetType) => assetType.typeId !== typeId);
        this.filteredAssetTypes = this.filteredAssetTypes.filter((assetType) => assetType.typeId !== typeId);
      },
      (error) => {
        console.error('Asset type deletion failed:', error);
      }
    );
  }

  viewAssetsByTypeName(typeName: string) {
    console.log(this.filteredAssetTypes)
    console.log({ typeName })
    this.assetTypeService.getAssetsByAssetTypeName(typeName).subscribe(
      (assets: Asset[]) => {
        console.log({ assets })
        const dialogRef = this.dialog.open(AssetPopupComponent, {
          data: { typeName, assets },
        });
      },
      (error) => {
        console.error('Error fetching assets:', error);
      }
    );
  }

  openDeleteConfirmationDialog(typeId: number) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: typeId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteAssetTypeByTypeId(typeId);
      }
    });
  }

  getCurrentPageData(): AssetType[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredAssetTypes.slice(startIndex, endIndex);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= Math.ceil(this.filteredAssetTypes.length / this.pageSize)) {
      this.currentPage = newPage;
    }
  }

  getPageNumbers(): number[] {
    const totalItems = this.filteredAssetTypes.length;
    const totalPages = Math.ceil(totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

}
