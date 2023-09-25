import { AssetType } from "./asset-type.model";
import { User } from "./user.model";

export class Asset {
  assetId: number;
  assetName: string;
  assetStatus: string;
  assetType: AssetType
  user: User | null;

  constructor(assetId: number, assetName: string, assetStatus: string, assetType: AssetType, user: User,) {
    this.assetId = assetId;
    this.assetName = assetName;
    this.assetStatus = assetStatus;
    this.assetType = assetType;
    this.user = user;
  }
}
