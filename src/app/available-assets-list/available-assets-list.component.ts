import { Component } from '@angular/core';
import { Asset } from '../_model/asset.model';
import { AssetService } from '../_services/asset.service';

@Component({
  selector: 'app-available-assets-list',
  templateUrl: './available-assets-list.component.html',
  styleUrls: ['./available-assets-list.component.css']
})
export class AvailableAssetsListComponent {

  assets: Asset[] = [];
  searchTerm: string = '';
  suggestions: string[] = [];
  pageSize: number = 7;
  currentPage: number = 1;

  constructor(private assetService: AssetService) { }

  ngOnInit() {
    this.loadAsset();
  }

  loadAsset() {
    this.assetService.getAllAssets().subscribe((data: Asset[]) => {
      this.assets = data;
    });
  }

  filterAssets() {
    if (!this.searchTerm) {
      this.loadAsset();
      this.suggestions = [];
    } else {
      this.assets = this.assets.filter(asset =>
        asset.assetName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        asset.assetType.typeName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      this.suggestions = this.assets
        .map(asset => asset.assetName)
        .filter(name => name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        .slice(0, 5);
    }

    this.currentPage = 1;
  }

  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.filterAssets();
  }

  getTotalPages(): number {
    return Math.ceil(this.assets.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getPaginatedAssets(): Asset[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.assets.slice(startIndex, endIndex);
  }
}
