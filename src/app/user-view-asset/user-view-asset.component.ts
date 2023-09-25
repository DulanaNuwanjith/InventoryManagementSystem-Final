import { Component, OnInit } from '@angular/core';
import { AssetService } from '../_services/asset.service';
import { Asset } from '../_model/asset.model';

@Component({
  selector: 'app-user-view-asset',
  templateUrl: './user-view-asset.component.html',
  styleUrls: ['./user-view-asset.component.css']
})
export class UserViewAssetComponent implements OnInit {

  assets: Asset[] = [];
  currentPage: number = 1;
  pageSize: number = 7;

  constructor(private assetService: AssetService) { }

  ngOnInit() {
    this.assetService.getUserAssets().subscribe((data: any[]) => {
      this.assets = data;
    });
  }

  getPaginatedAssets(): Asset[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.assets.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.assets.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

}
