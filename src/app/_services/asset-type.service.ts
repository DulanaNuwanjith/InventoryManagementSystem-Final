import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AssetTypeService {

  baseUrl
  Url

  constructor(private httpclient: HttpClient) {
    this.baseUrl = environment.backendbaseUrl + "/asset-types";
    this.Url = environment.backendbaseUrl + "/assets";
  }

  getAllAssetTypes(): Observable<any[]> {
    return this.httpclient.get<any[]>(this.baseUrl + "/all");
  }

  addAssetType(assetTypeData: any) {
    return this.httpclient.post(this.baseUrl + "/add", assetTypeData)
  }

  searchAssetTypes(searchText: string): Observable<any[]> {
    return this.httpclient.get<any[]>(this.baseUrl + "/all");
  }

  deleteAssetTypeByTypeId(typeId: number): Observable<any> {
    return this.httpclient.delete(`${this.baseUrl}/${typeId}`);
  }

  getAssetsByAssetTypeName(typeName: string): Observable<any[]> {
    return this.httpclient.get<any[]>(`${this.Url}/byAssetTypeName/${typeName}`);
  }

}
