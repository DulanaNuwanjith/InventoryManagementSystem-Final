import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from '../_model/asset.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  baseUrl

  constructor(private httpclient: HttpClient) {
    this.baseUrl = environment.backendbaseUrl + "/assets";
  }

  getAllAssets(): Observable<any[]> {
    return this.httpclient.get<any[]>(this.baseUrl + "/all");
  }

  addAsset(assetData: any) {
    return this.httpclient.post(this.baseUrl + "/add", assetData)
  }

  deleteAssetById(assetId: number): Observable<any> {
    return this.httpclient.delete(`${this.baseUrl}/${assetId}`);
  }

  searchAsset(searchText: string): Observable<any[]> {
    return this.httpclient.get<any[]>(this.baseUrl + "/all");
  }

  getUserAssets(): Observable<any[]> {
    return this.httpclient.get<any[]>(`${this.baseUrl}/my/assets`);
  }

  updateAsset(assetId: number, updatedAsset: any): Observable<any> {
    return this.httpclient.put(`${this.baseUrl}/${assetId}`, updatedAsset);
  }

  getAssetsByAssetTypeName(typeName: string): Observable<Asset[]> {
    return this.httpclient.get<Asset[]>(`${this.baseUrl}/assetsByAssetTypeName/${typeName}`);
  }

  getAssetsByUserId(userId: number): Observable<any[]> {
    return this.httpclient.get<any[]>(`${this.baseUrl}/by-user/${userId}`);
  }

}
