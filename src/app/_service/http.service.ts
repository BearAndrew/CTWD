import { ExecuteDRTSShiftRequest, ExecuteDRTSShiftResponse, MyDRTSShiftCountRequest, MyDRTSShiftCountResponse,
         MyDRTSShiftListRequest, MyDRTSShiftListResponse, ReportDRTSShiftActionRequest, ReportDRTSShiftActionResponse,
         DRTSStop, CreateDRTSOrderRequest, CreateDRTSOrderResponse, CloseDRTSOrderRequest, CloseDRTSOrderResponse,
         DeleteDRTSOrderResponse, DeleteDRTSOrderRequest, ReportDRTSIssueResponse, ReportDRTSIssueRequest, LoadDRTSShiftRecordRequest,
         LoadDRTSShiftRecordResponse, ReportDRTSMaintRequest, ReportDRTSMaintResponse, ReportDRTSPhysExamRequest,
         ReportDRTSPhysExamResponse, LoadReportRecordRequest, LoadReportRecordResponse, LoadDDRTSPhotoRequest, LoadDDRTSPhotoResponse,
         DRTSShiftActionType, LoadDRTSDBulletinRequest, LoadDRTSDBulletinResponse, LoadDRTSPhotoType, RsvDRTSOrderPickupResponse, RsvDRTSOrderPickupRequest, RsvDRTSOrderNoShowResponse, RsvDRTSOrderNoShowRequest
        } from './../_interface/drts-interface';
import { environment } from './../../environments/environment';
import { AvailableROrderRequest, BaseResponse, AvailableROrderResponse, TryTakenROrderResponse, TryTakenROrderRequest,
         ITakenROrder, ReportROrderStatusRequest, ReportROrderTrackRequest, ITrack, DROrderHistoryRecordResponse, DMessagesResponse,
         ReportROrderStatusResponse, ReportROrderTrackResponse, IssueReportRequest} from '../_interface/interface';
import { Observable } from 'rxjs';
import { IPreferenceData } from '../views/preference/preference-form-interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseRequest, DDashboardInfoRequest, DDashboardInfoResponse, DPreferenceResponse, UpdateDPreferenceRequest } from '../_interface/interface';
import { environment } from 'src/environments/environment.prod';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
};

const baseUrl =  environment.url;

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  //#region Url

  public dTokenLoginUrl = baseUrl + 'DTokenLogin';
  public dLoginUrl = baseUrl + 'DLogin';
  private dDashboardInfoUrl = baseUrl + 'DDashboardInfo';
  private dPreferenceUrl = baseUrl + 'DPreference';
  private updateDPreferenceUrl = baseUrl + 'UpdateDPreference';
  private availableROrderUrl = baseUrl + 'AvailableROrder';
  private tryTakenROrderUrl = baseUrl + 'TryTakenROrder';
  private reportROrderStatusUrl = baseUrl + 'ReportROrderStatus';
  private reportROrderTrackUrl = baseUrl + 'ReportROrderTrack';
  private dROrderHistoryRecordUrl = baseUrl + 'DROrderHistoryRecords';
  private dMessagesUrl = baseUrl + 'DMessages';
  private dMessageReadedUrl = baseUrl + 'DMessageReaded';
  private issueReportUrl = baseUrl + 'IssueReport';
  private myDRTSShiftCountUrl = baseUrl + 'MyDRTSShiftCount';
  private myDRTSShiftListUrl = baseUrl + 'MyDRTSShiftList';
  private executeDRTSShiftUrl = baseUrl + 'ExecuteDRTSShift';
  private reportDRTSShiftActionUrl = baseUrl + 'ReportDRTSShiftAction';
  private createDRTSOrderUrl = baseUrl + 'CreateDRTSOrder';
  private closeDRTSOrderUrl = baseUrl + 'CloseDRTSOrder';
  private deleteDRTSOrderUrl = baseUrl + 'DeleteDRTSOrder';
  private reportDRTSIssueUrl = baseUrl + 'ReportDRTSIssue';

  //#endregion

  token: string;

  constructor(private http: HttpClient) {

  }


  //#region CWTD

  // 主頁資訊更新
  dDashboardInfo(): Observable<DDashboardInfoResponse> {
    const request: DDashboardInfoRequest = {Token: this.token, RefreshROrder: true};
    this.devModeLog('dDashboardInfo', request, true);
    return this.http.post<DDashboardInfoResponse>(this.dDashboardInfoUrl, request, httpOptions);
  }



  // 取得司機偏好設定
  dPreference(): Observable<DPreferenceResponse> {
    const request: BaseRequest = { Token: this.token };
    this.devModeLog('dPreference', request, true);
    return this.http.post<DPreferenceResponse>(this.dPreferenceUrl, request, httpOptions);
  }



  // 更新司機偏好設定
  updatePreference(dp: IPreferenceData): Observable<BaseResponse> {
    const request: UpdateDPreferenceRequest = {Token: this.token, DP: dp};
    this.devModeLog('updateDPreference', request, true);
    return this.http.post<BaseResponse>(this.updateDPreferenceUrl, request, httpOptions);
  }



  // 取得可承接預約訂單
  availableROrder(considerPreference: boolean, queryDate: string): Observable<AvailableROrderResponse> {
    const request: AvailableROrderRequest = {Token: this.token, ConsiderPreference: considerPreference, QueryDate: queryDate};
    this.devModeLog('availableROrder', request, true);
    return this.http.post<AvailableROrderResponse>(this.availableROrderUrl, request, httpOptions);
  }



  // 要求承接訂單
  tryTakenROrder(tryTakenROrders: ITakenROrder[]): Observable<TryTakenROrderResponse> {
    const request: TryTakenROrderRequest = {Token: this.token, TryTakenROrders: tryTakenROrders};
    this.devModeLog('tryTakenROrder', request, true);
    return this.http.post<TryTakenROrderResponse>(this.tryTakenROrderUrl, request, httpOptions);
  }



  // 執行訂單/回報到達/回報上車/回報完成
  reportROrderStatus(ID: number, StatusCode: number, TaxiFee: number, Lat: number, Lng: number): Observable<ReportROrderStatusResponse> {
    const request: ReportROrderStatusRequest = {Token: this.token, ID: ID, StatusCode: StatusCode, TaxiFee: TaxiFee, Lat: Lat, Lng: Lng};
    this.devModeLog('reportROrderStatus', request, true);
    return this.http.post<ReportROrderStatusResponse>(this.reportROrderStatusUrl, request, httpOptions);
  }



  // 軌跡回報
  reportROrderTrack(ID: number, Track: ITrack): Observable<ReportROrderTrackResponse> {
    const request: ReportROrderTrackRequest  = {Token: this.token, ID: ID, Track: Track};
    this.devModeLog('reportROrderTrack', request, true);
    return this.http.post<ReportROrderTrackResponse>(this.reportROrderTrackUrl, request, httpOptions);
  }



  // 訂單歷史記錄
  dROrderHistoryRecord(): Observable<DROrderHistoryRecordResponse> {
    const request: BaseRequest = {Token: this.token};
    this.devModeLog('dROrderHistoryRecord', request, true);
    return this.http.post<DROrderHistoryRecordResponse>(this.dROrderHistoryRecordUrl, request, httpOptions);
  }



  // 取得訊息列表
  dMessages(): Observable<DMessagesResponse> {
    const request: BaseRequest = {Token: this.token};
    this.devModeLog('dMessages', request, true);
    return this.http.post<DMessagesResponse>(this.dMessagesUrl, request, httpOptions);
  }



  // 訊息已讀
  dMessageReaded(): Observable<BaseResponse> {
    const request: BaseRequest = {Token: this.token};
    this.devModeLog('dMessageReaded', request, true);
    return this.http.post<BaseResponse>(this.dMessageReadedUrl, request, httpOptions);
  }



  // 異常回報
  issueReport(issueType: string, memo: string, oid: number): Observable<BaseResponse> {
    const request: IssueReportRequest = {Token: this.token, IssureType: issueType, Memo: memo , OID: oid};
    this.devModeLog('issueReport', request, true);
    return this.http.post<BaseResponse>(this.issueReportUrl, request, httpOptions);
  }


  //#endregion



  //#region DRTS

  // 取得未執行班次數量
  myDRTSShiftCount(): Observable<MyDRTSShiftCountResponse> {
    const request: MyDRTSShiftCountRequest = {Token: this.token};
    this.devModeLog('myDRTSShiftCount', request, true);
    return this.http.post<MyDRTSShiftCountResponse>(this.myDRTSShiftCountUrl, request, httpOptions);
  }



  // 取得今日須執行班次
  myDRTSShiftList(dateTimeString: string): Observable<MyDRTSShiftListResponse> {
    const request: MyDRTSShiftListRequest = {Token: this.token, DT: dateTimeString};
    this.devModeLog('myDRTSShiftList', request, true);
    return this.http.post<MyDRTSShiftListResponse>(this.myDRTSShiftListUrl, request, httpOptions);
  }



  // 取得執行班次詳細資料
  executeDRTSShift(sid: number): Observable<ExecuteDRTSShiftResponse> {
    const request: ExecuteDRTSShiftRequest = {Token: this.token, SID: sid};
    this.devModeLog('executeDRTSShift', request, true);
    return this.http.post<ExecuteDRTSShiftResponse>(this.executeDRTSShiftUrl, request, httpOptions);
  }



  // 回報離站
  reportDRTSShiftAction(sid: number, action: DRTSShiftActionType, stop: DRTSStop): Observable<ReportDRTSShiftActionResponse> {
    const request: ReportDRTSShiftActionRequest = {Token: this.token, SID: sid, Action: action, Stop: stop};
    this.devModeLog('reportDRTSShiftAction', request, true);
    return this.http.post<ExecuteDRTSShiftResponse>(this.reportDRTSShiftActionUrl, request, httpOptions);
  }



  // 乘客上車建立訂單
  createDRTSOrder(sid: number, pickupMaleCount: number,pickupfemaleCount: number, stop: DRTSStop): Observable<CreateDRTSOrderResponse> {
    const request: CreateDRTSOrderRequest = {Token: this.token, SID: sid,
      PickupMaleCount: pickupMaleCount, PickupFemaleCount: pickupfemaleCount, Stop: stop};
    this.devModeLog('createDRTSOrder', request, true);
    return this.http.post<CreateDRTSOrderResponse>(this.createDRTSOrderUrl, request, httpOptions);
  }



  // 乘客下車完成訂單
  closeDRTSOrder(sid: number, oid: number, payType: string, amount: number,
    cardType: string, stop: DRTSStop): Observable<CloseDRTSOrderResponse> {
    const request: CloseDRTSOrderRequest = {
      Token: this.token, SID: sid, OID: oid, PayType: payType, Amount: amount, CardType: cardType, Stop: stop};
    this.devModeLog('closeDRTSOrder', request, true);
    return this.http.post<CloseDRTSOrderResponse>(this.closeDRTSOrderUrl, request, httpOptions);
  }



  // 建立錯誤刪除訂單
  deleteDRTSOrder(oid: number): Observable<DeleteDRTSOrderResponse> {
    const request: DeleteDRTSOrderRequest = {Token: this.token, OID: oid};
    this.devModeLog('deleteDRTSOrder', request, true);
    return this.http.post<DeleteDRTSOrderResponse>(this.deleteDRTSOrderUrl, request, httpOptions);
  }



  // 班次記錄查詢
  loadDRTSShiftRecord(beforeToday: boolean): Observable<LoadDRTSShiftRecordResponse> {
    const request: LoadDRTSShiftRecordRequest = {Token: this.token, BeforeToday: beforeToday};
    this.devModeLog('LoadDRTSShiftRecord', request, true);
    return this.http.post<LoadDRTSShiftRecordResponse>(baseUrl + 'LoadDRTSShiftRecord', request, httpOptions);
  }



  // 狀況回報
  reportDRTSIssue(issueReportRequest: ReportDRTSIssueRequest): Observable<ReportDRTSIssueResponse> {
    const request = Object.assign({Token: this.token}, issueReportRequest);
    this.devModeLog('ReportDRTSIssue', issueReportRequest, true);
    return this.http.post<ReportDRTSIssueResponse>(baseUrl + 'ReportDRTSIssue', request, httpOptions);
  }



  // 汽車維修回報
  reportDRTSMaint(base64PhotoList: string[], maintDate: string, memo: string): Observable<ReportDRTSMaintResponse> {
    const request: ReportDRTSMaintRequest = {Token: this.token, Base64PhotoList: base64PhotoList
      , MaintDate: maintDate, Memo: memo};
    this.devModeLog('ReportDRTSMaint', request, true);
    return this.http.post<ReportDRTSMaintResponse>(baseUrl + 'ReportDRTSMaint', request, httpOptions);
  }



  // 體檢記錄回報
  reportDRTSPhysExam(base64PhotoList: string[], year: number, memo: string): Observable<ReportDRTSPhysExamResponse> {
    const request: ReportDRTSPhysExamRequest = {Token: this.token, Base64PhotoList: base64PhotoList
      , Year: year, Memo: memo};
    this.devModeLog('ReportDRTSPhysExam', request, true);
    return this.http.post<ReportDRTSPhysExamResponse>(baseUrl + 'ReportDRTSPhysExam', request, httpOptions);
  }



  // 回報記錄查詢
  loadReportRecord(): Observable<LoadReportRecordResponse> {
    const request: LoadReportRecordRequest = {Token: this.token};
    this.devModeLog('LoadReportRecord', request, true);
    return this.http.post<LoadReportRecordResponse>(baseUrl + 'LoadReportRecord', request, httpOptions);
  }



  // 取得回報照片 // Type: 維修 體檢 狀況 司機公告
  loadDDRTSPhoto(id: number, type: LoadDRTSPhotoType): Observable<LoadDDRTSPhotoResponse> {
    const request: LoadDDRTSPhotoRequest = {Token: this.token, ID: id, Type: type};
    this.devModeLog('LoadDDRTSPhoto', request, true);
    return this.http.post<LoadDDRTSPhotoResponse>(baseUrl + 'LoadDDRTSPhoto', request, httpOptions);
  }



  // 司機公告查詢
  loadDRTSDBulletin(): Observable<LoadDRTSDBulletinResponse> {
    const request: LoadDRTSDBulletinRequest = {Token: this.token};
    this.devModeLog('LoadDRTSDBulletin', request, true);
    return this.http.post<LoadDRTSDBulletinResponse>(baseUrl + 'LoadDRTSDBulletin', request, httpOptions);
  }



  // 預約乘客上車
  rsvDRTSOrderPickup(oid: number, stop: DRTSStop): Observable<RsvDRTSOrderPickupResponse> {
    const request: RsvDRTSOrderPickupRequest = {Token: this.token, OID: oid, Stop: stop};
    this.devModeLog('RsvDRTSOrderPickup', request, true);
    return this.http.post<RsvDRTSOrderPickupResponse>(baseUrl + 'RsvDRTSOrderPickup', request, httpOptions);
  }



  // 預約乘客未到
  rsvDRTSOrderNoShow(oid: number, stop: DRTSStop): Observable<RsvDRTSOrderNoShowResponse> {
    const request: RsvDRTSOrderNoShowRequest = {Token: this.token, OID: oid, Stop: stop};
    this.devModeLog('RsvDRTSOrderNoShow', request, true);
    return this.http.post<RsvDRTSOrderNoShowResponse>(baseUrl + 'RsvDRTSOrderNoShow', request, httpOptions);
  }


  //#endregion

  devModeLog(callerName: string, data: object, isRequset: boolean) {
    if (!environment.production) {
      if (isRequset) {
        console.log(callerName + ' request: ' + JSON.stringify(data));
      } else {
        console.log(callerName + ' response: ' + JSON.stringify(data));
      }
    }
  }

}
