import { IPreferenceData } from '../views/preference/preference-form-interface';

export enum MissionType {
  NULL = '',
  CWTD = 'cwtd',
  DRTS = 'drts',
  SBIR = 'sbir'
}

export interface BaseRequest {
  Token: string;
}
export interface BaseResponse {
  IsSuccess: boolean;
  Reason: string;
  IsTokenExpired: boolean;
}

export interface LoginResponse extends BaseResponse {
  CallNo: string;
  Config: {
    TestProperty: string
    MaxQueryDay: number
  };
  Name: string;
  Token: string;
}

export interface DDashboardInfoRequest extends BaseRequest {
  RefreshROrder: boolean;
}
export interface DDashboardInfoResponse extends BaseResponse {
  ROrderList: any[];
  UnreadMessagesCount: number;
}


export interface UpdateDPreferenceRequest extends BaseRequest {
  DP: IPreferenceData;
}
export interface DPreferenceResponse extends BaseResponse {
  DP: IPreferenceData;
}


export interface AvailableROrderRequest extends BaseRequest {
  ConsiderPreference: boolean;
  QueryDate: string;
}
export interface AvailableROrderResponse extends BaseResponse {
  ROrderList: IROrder[];
}


export interface TryTakenROrderRequest extends BaseRequest {
  TryTakenROrders: ITakenROrder[];
}
export interface TryTakenROrderResponse extends BaseResponse {
  ConfirmTakenROrders: ITakenROrder[];
}


export interface ReportROrderStatusRequest extends BaseRequest {
  ID: number;
  StatusCode: number; // 執行訂單1 /回報到達2 /回報上車3 /回報完成0
  TaxiFee: number;
  Lat: number;
  Lng: number;
}
export interface ReportROrderStatusResponse extends BaseResponse {
  IsCancel: boolean;
}


export interface ReportROrderTrackRequest extends BaseRequest {
  ID: number;
  Track: ITrack;
}
export interface ReportROrderTrackResponse extends BaseResponse {
  IsCancel: boolean;
}


export interface DROrderHistoryRecordResponse extends BaseResponse {
  ROrderList: IROrder[];
}

export interface DMessagesResponse extends BaseResponse {
  Messages: IMessage[];
}

export interface IssueReportRequest extends BaseRequest {
  IssureType: string;
  Memo: string;
  OID: number;
}





export interface IROrder {
  AcceptTime: string;
  ActDistance: number;
  ActDuration: number;
  ActTaxiFee: number;
  ArriveTime: string;
  CID: string;
  CancelNotifyType: string;
  CancelTime: string;
  CompanyName: string;
  CreateTime: string;
  DPAddress: string;
  DPCounty: string;
  DPLat: number;
  DPLng: number;
  DPMemo: string;
  DPRegion: string;
  DUID: string;
  Demand: string;
  DriverName: string;
  DropTime: string;
  Email: string;
  EstDistance: number;
  EstDuration: number;
  EstTaxiFee: number;
  ExecutionTime: string;
  FirstName: string;
  Fleet: string;
  Gender: string;
  GuestUID: string;
  ID: number;
  IsCompleted: boolean;
  IsNegotiatedTaxiFee: boolean;
  LastEditTime: string;
  LastName: string;
  NegotiatedTaxiFee: number;
  NotifyTime: string;
  NotifyType: string;
  OID: string;
  PUAddress: string;
  PUCounty: string;
  PULat: number;
  PULng: number;
  PUMemo: string;
  PURegion: string;
  Phone: string;
  PickupTime: string;
  ReceiptLink: string;
  ReleaseTime: string;
  ReserveTime: string;
  Role: string;
  Status: string;
  TripType: string;
  VID: string;
  CarColor: string; // 車輛顏色
  SeatRequired: number; // 乘客數
  CarYearRequired: number; // 車輛年份要求
  CarModelRequired: string; // 車型要求
  HideEST: boolean; // 不顯示預估車資
  OP: string; // 建檔人員
  IsAssignDriver: boolean; // 是否為指定駕駛
}

export interface ITakenROrder {
  ID: number;
  LastEditTime: string;
}

export interface ITrack {
  Acc: number;
  Hdg: number;
  Lat: number;
  Lng: number;
  Spd: number;
  Tim: number;
}

export interface IMessage {
  Body: string;
  Category: string;
  Creator: string;
  DT: string;
  DTString: string;
  ExtendData: string;
  IsNew: boolean;
  LinkOpenNewWindow: boolean;
  LinkUrl: string;
  MID: number;
  Pinned: boolean;
  Title: string;
}

export interface IOrder extends IROrder {
  DemandObject: IDemand;
  ReservationTime: Date;
  ReservationTimeString: string;
  StatusCode: number;
  pick: boolean;
}

export interface IDemand {
  class: string;            // 用車類型: 一般 , 通用 , 長照
  accompanyNeed: boolean;   // 是否需要醫療陪伴
  accompany: number;        // 陪伴時間(小時)
  machineNeed: boolean;     // 是否需要爬梯機
  machineUserName: string;  // 爬梯機使用人姓名
  gender: string;           // 爬梯機使用人性別
  machineUserkg: number;    // 爬梯機使用人公斤
  machineUsermove: string;  // 爬梯機使用人是否需要身體移動 (床到輪椅,無)
  machineUserfit: string;   // 爬梯機使用人身體狀態 (意識不清楚,失智,虛弱)
  stairs: number;           // 需使用爬梯機樓層(1~7樓)
  stairW: string;           // 樓梯最窄的寬度是否有95公分以上 (有,無)
  memo: string;             // 其他備註
  caseID: string;           // 個案身份證字號(長照用車專用)
  caseBelong: string;       // 服務個案的交通單位
}


export interface SearchYearMonth {
  value: string;
}
export class Search {
  puAddress: string;
  dPAddress: string;
  date: SearchYearMonth;

  constructor() {
    this.puAddress = '';
    this.dPAddress = '';
    this.date = { value: '' };
  }
}
