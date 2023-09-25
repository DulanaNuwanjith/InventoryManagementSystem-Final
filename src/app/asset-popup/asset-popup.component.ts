import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asset } from '../_model/asset.model';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-asset-popup',
  templateUrl: './asset-popup.component.html',
  styleUrls: ['./asset-popup.component.css']
})
export class AssetPopupComponent {
  typeName: string | undefined;
  assets: Asset[] = [];
  users: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.typeName) {
      this.typeName = data.typeName;
      this.assets = data.assets || [];
      if (data.assets && data.assets.length > 0) {
        console.log('User object:', data.assets[0].user);
      }
    }
    console.log('popup');
  }

  getStatusDisplayName(assetStatus: string): string {
    switch (assetStatus) {
      case 'IN_USE':
        return 'In use';
      case 'AVAILABLE':
        return 'Available';
      case 'UNDER_REPAIR':
        return 'Under repair';
      default:
        return 'Other';
    }
  }

}
