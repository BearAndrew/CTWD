import * as Interface from './interface';

// 取得未執行班次數量
export type MyDRTSShiftCountRequest = Interface.BaseRequest;
export interface MyDRTSShiftCountResponse extends Interface.BaseResponse {
  Count: number;
}



// 取得今日須執行班次
export interface MyDRTSShiftListRequest extends Interface.BaseRequest {
  DT: string;
}
export interface MyDRTSShiftListResponse extends Interface.BaseResponse {
  ShiftList: DRTSShift[];
  TodayCount: number;
  CompleteCount: number;
  UnfinishedCount: number;
}



// 取得執行班次詳細資料
export interface ExecuteDRTSShiftRequest extends Interface.BaseRequest {
  SID: number;
}
export interface ExecuteDRTSShiftResponse extends Interface.BaseResponse {
  Shift: DRTSShift;
  PayTypeList: DRTSPayType[]; // 路線付款方式
  IssueCanMsgList: string[]; // 罐頭訊息
}



// 回報到站離站
export interface ReportDRTSShiftActionRequest extends Interface.BaseRequest {
  SID: number;
  Action: DRTSShiftActionType; // 發車 到站 離站 完成
  Stop: DRTSStop;
}
export type ReportDRTSShiftActionResponse = Interface.BaseResponse;
export enum DRTSShiftActionType {
  START = '發車',
  ARRIVED = '到站',
  LEAVE = '離站',
  COMPLETE = '完成'
}



// 乘客上車建立訂單
export interface CreateDRTSOrderRequest extends Interface.BaseRequest {
  SID: number;
  PickupMaleCount: number;
  PickupFemaleCount: number;
  Stop: DRTSStop;
}
export interface CreateDRTSOrderResponse extends Interface.BaseResponse {
  OrderList: DRTSOrder[];
}



// 乘客下車完成訂單
export interface CloseDRTSOrderRequest extends Interface.BaseRequest {
  SID: number;
  OID: number;
  PayType: string;
  Amount: number;
  CardType: string;
  Stop: DRTSStop;
}
export type CloseDRTSOrderResponse = Interface.BaseResponse;



// 建立錯誤刪除訂單
export interface DeleteDRTSOrderRequest extends Interface.BaseRequest {
  OID: number;
}
export type DeleteDRTSOrderResponse = Interface.BaseResponse;



// 班次記錄查詢 LoadDRTSShiftRecord
export interface LoadDRTSShiftRecordRequest extends Interface.BaseRequest {
  BeforeToday: boolean;
}
export interface LoadDRTSShiftRecordResponse extends Interface.BaseResponse {
  RecordList: DRTSShiftRecord[];
}



// 狀況回報
export interface ReportDRTSIssueRequest extends Interface.BaseRequest {
  Base64PhotoList: string[];
  Description: string;
  NextStopName: string;
  RID?: number;
  RouteName: string;
  RouteType: string;
  SID?: number;
  StopName: string;
}
export type ReportDRTSIssueResponse = Interface.BaseResponse;
export class ReportDRTSIssueRequest {
  constructor() {
    this.Base64PhotoList = [];
    this.Description = '';
    this.NextStopName = '';
    this.RouteName = '';
    this.RouteType = '';
    this.StopName = '';
  }
}



// 汽車維修回報
export interface ReportDRTSMaintRequest extends Interface.BaseRequest, MaintRequest {}
export type ReportDRTSMaintResponse = Interface.BaseResponse;
export interface MaintRequest {
  Base64PhotoList: string[];
  MaintDate: string;
  Memo: string;
}
export class MaintRequest {
  constructor() {
    this.Base64PhotoList = [];
    this.MaintDate = '';
    this.Memo = '';
  }
}



// 體檢記錄回報
export interface ReportDRTSPhysExamRequest extends Interface.BaseRequest, PhysExamRequest {}
export type ReportDRTSPhysExamResponse = Interface.BaseResponse;
export interface PhysExamRequest {
  Base64PhotoList: string[];
  Year: number;
  Memo: string;
}
export class PhysExamRequest {
  constructor() {
    this.Base64PhotoList = [];
    this.Year = null;
    this.Memo = '';
  }
}


// 回報記錄查詢
export type LoadReportRecordRequest = Interface.BaseRequest;
export interface LoadReportRecordResponse extends Interface.BaseResponse {
  ReportRecordList: DRTSReportRecord[];
}



// 取得回報照片  // Type: 維修 體檢 狀況 司機公告
export interface LoadDDRTSPhotoRequest extends Interface.BaseRequest {
  ID: number;
  Type: LoadDRTSPhotoType;
}
export interface LoadDDRTSPhotoResponse extends Interface.BaseResponse {
  Base64PhotoList: string[];
}
export enum LoadDRTSPhotoType {
  MAINT = '維修',
  PHYSEXAM = '體檢',
  ISSUE = '狀況',
  BULLETIN = '司機公告'
}



// 司機公告查詢
export type LoadDRTSDBulletinRequest = Interface.BaseRequest;
export interface LoadDRTSDBulletinResponse extends Interface.BaseResponse {
  BulletinList: DRTSDBulletin[];
}




// 預約乘客上車
export interface RsvDRTSOrderPickupRequest extends Interface.BaseRequest {
  OID: number;
  Stop: DRTSStop;
}
export interface RsvDRTSOrderPickupResponse extends Interface.BaseResponse {
  RsvStatus: string;
  PickupTime: string;
}




// 預約乘客未到
export interface RsvDRTSOrderNoShowRequest extends Interface.BaseRequest {
  OID: number;
  Stop: DRTSStop;
}
export type RsvDRTSOrderNoShowResponse = Interface.BaseResponse;










export interface DRTSRoute {
  ID: number; // 序號
  Name: string; // 名稱
  RouteDetails: DRTSRouteDetails; // 去程站點資料
  RoundRouteDetails: DRTSRouteDetails; // 回程站點資料
  Payable: number; // 金額
  OPDriverUUIDList: string[];
  Type: string; // 種類 去返程/僅去程
  StopType: string; // 站點種類 每天相同 平常日假日 每天不同
  ErrorNotice: string; // 須注意事項
}

// 路線資訊
export interface DRTSRouteInfo {
  ID: number;
  Name: string;
  RouteTypeOptions: string[];
  StopTypeOptions: string[];
}

// 路線周站點詳細
export interface DRTSRouteDetails {

  RouteType: string; // 種類 去返程/僅去程
  StopType: string; // 站點分類屬性 每天相同 平常日假日 每天不同

  // 去程 周一~周日站點
  MonStopList: DRTSStop[];
  MonOverviewPolyline: string;
  TueStopList: DRTSStop[];
  TueOverviewPolyline: string;
  WedStopList: DRTSStop[];
  WedOverviewPolyline: string;
  ThuStopList: DRTSStop[];
  ThuOverviewPolyline: string;
  FriStopList: DRTSStop[];
  FriOverviewPolyline: string;
  SatStopList: DRTSStop[];
  SatOverviewPolyline: string;
  SunStopList: DRTSStop[];
  SunOverviewPolyline: string;
}

// 站點
export interface DRTSStop {
  UUID: string; // 站點識別碼
  RID: number; // 路線序號
  Sequence: number; // 站序
  Name: string; // 站名
  EnName: string; // 英文站名
  DistanceToNext: number; // 到下站公里數
  MinToNext: number; // 到下站分鐘數
  Lat: number; // 緯度
  Lng: number; // 經度
  Address: string; // 站牌地址
  Attribute: number; // 營運屬性
  OverviewPolyline: string; // OverviewPolyline
  RouteType: string; // 種類 去返程/僅去程
}

// 班次
export interface DRTSShift {
  ID: number; // 序號
  RID: number; // 路線序號
  RouteName: string; // 路線名稱
  RouteType: string; // 去返程
  StopType: string; // 站點種類
  DepartTime: string; // 發車時間
  DatePart: string; // 發車時間 日期部分
  TimePart: string; // 發車時間 時間部分
  CompleteTime: string; // 完成時間
  ExcuteTime: string; // 執行時間
  DepartSequence: number; // 發車站序(預設1)
  DriverUID: string; // 司機唯一碼
  DriverName: string; // 司機姓名
  DriverVID: string; // 司機車牌
  Status: string; // 狀態
  VehicleStatus: string; // 車輛狀態
  CurrentSequence: number; // 目前站序
  StopList: DRTSStop[]; // 站點列表
  LastSequence: number; // 最後一站站序
  OrderList: DRTSOrder[]; // 目前乘客訂單
}

// 付款方式
export interface DRTSPayType {
  Name: string;
  IsCard: boolean;
  CardTypeList: DRTSCardType[];
  AmountList: number[];
}
// 卡種
export interface DRTSCardType {
  Name: string;
  AmountList: number[];
}

// 班次執行
export interface DRTSShiftAction {
  ID: number;
  SID: number; // 班次序號
  RID: number; // 路線序號
  ActionTime: string;
  Action: string; // 發車 到站 離站 完成
  StopName: string;
  StopSequence: number;
  StopUID: string;
  StopInfo: string;
  Lat: number;
  Lng: number;
}

// 乘客訂單
export interface DRTSOrder {
  ID: number;
  SID: number;
  RID: number;
  PickupTime: string;
  PickupStopName: string;
  PickupStopSequence: number;
  PickupStopUID: string;
  PickupStopInfo: string;
  DropTime: string;
  DropStopName: string;
  DropStopSequence: number;
  DropStopUID: string;
  DropStopInfo: string;
  PayType: string;
  Amount: number;
  CardType: string;
  IsClosed: boolean;
  // 預約相關
  OrderType: string;  // 訂單種類( 即時 / 預約)
  RsvAccount: string; // 預約帳號
  RsvAccountMode: string; // 預約帳號身分
  RsvStatus: string; //預約狀態 ( 訂單成立 / 未搭乘 / 搭乘中 / 完成 / 已取消 )
  Name: string;
  Gender: string;
  Phone: number;
  Number: number; // 預約人數
  RouteName: string;
}

// 狀況回報
export interface DRTSIssue {
  ID: number;
  SID?: number;
  CreateTime: string;
  Content: string;
  DriverName: string;
  DriverUID: string;
  DriverVID: string;
  RID?: number;
  RouteName: string;
  FromStopName: string;
  ToStopName: string;
  RouteType: string;
  HasPhoto: boolean;
  AdminMemo: string;
  IsHandle: boolean;
  HandleTime: string;
  HandleBy: string;
}

// 汽車維修記錄
export interface DRTSMaint {
  ID: number;
  MaintTime: string;
  Year: number;
  Month: number;
  CreateTime: string;
  DriverName: string;
  DriverUID: string;
  DriverVID: string;
  HasPhoto: boolean;
  DriverMemo: string;
  AdminMemo: string;
  IsHandle: boolean;
  HandleTime: string;
  HandleBy: string;
}

// 體檢記錄
export interface DRTSPhysExam {
  ID: number;
  CreateTime: string;
  Year: number;
  DriverName: string;
  DriverUID: string;
  DriverVID: string;
  HasPhoto: boolean;
  DriverMemo: string;
  AdminMemo: string;
  IsHandle: boolean;
  HandleTime: string;
  HandleBy: string;
}

// 各種回報記錄
export interface DRTSReportRecord {
  ID: number; // 回報序號
  Type: string; // 回報種類
  ReportTime: string; // 回報時間
  HasPhoto: boolean; // 是否有照片
  PhotoCount: number; // 照片數量
  Description: string; // 描述
  DriverMemo: string; // 司機備註
  AdminMemo: string; // 管理備註
  IsHandle: boolean; // 已處理
}


// 公告
export interface  DRTSDBulletin {
  ID: number;
  Category: string;
  Title: string;
  Content: string;
  SDT: string;
  EDT: string;
  CreateTime: string;
  HasPhoto: boolean;
}

// 記錄清單
export interface DRTSShiftRecord {
  ActionList: DRTSShiftAction[];
  OrderList: DRTSOrder[];
  Shift: DRTSShift;
}
