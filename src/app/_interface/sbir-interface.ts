export interface SbirBaseRequest {
  action: string;
  source: string;
  token: string;
}

export interface SbirBaseResponse {
  isSucccess: boolean;
  action: string;
  reason: string;
}

export interface PassengerInfo {
  PassengerOrderID: string;
  Rotue: string;
  StratStationName: string;
  EndStationName: string;
  PQ: number;
  PassengerName: string;
  State: string;
  Taxifare: number;
}

export interface EntityRoute {
  RoutesName: string;
  EntityRouteItemsList: EntityRouteItems[];
}

export interface EntityRouteItems {
  RoutesStation: string;
  RoutesStationAddress: string;
  SortStation: number;
  TimeSpan: number;
  DriverSize: number;
  PassengerSize: number;
  Lat: number;
  Lng: number;
}


// 新登入
export type NewLoginRequest = SbirBaseRequest;
export type NewLoginResponse = SbirBaseResponse;



// 讀取站
export type EntityClassRequest = SbirBaseRequest;
export interface EntityClassResponse extends SbirBaseResponse {
  EntityRoutes: EntityRoute[];
}



// 搜尋乘客
export interface SearchPassengerRequest extends SbirBaseRequest {
  RouteName: string;
}
export interface SearchPassengerResponse extends SbirBaseResponse {
  listPassenger: string[];
}



// 排班
export interface LineUpRequest extends SbirBaseRequest {
  LineUpRoute: string;
  LineUpStation: string;
}
export interface LineUpResponse extends SbirBaseResponse {
  DriverOrderID: number;
}



// 取消排班
export type CancelLineUpRequest = SbirBaseRequest;
export type CancelLineUpResponse = SbirBaseResponse;



// 出車訂單
export interface TaskOrderRequest extends SbirBaseRequest {
  List_OrderPID: string[];
  DriverOrderID: string;
}
export type TaskOrderResponse = SbirBaseResponse;


// 司機到達中繼站
export interface ArriveRequest extends SbirBaseRequest {
  List_OrderPID: string[];
  CallNo: string;
}
export type ArriveResponse = SbirBaseResponse;



// 司機選擇乘客未到
export interface NotArrivedPassengerRequest extends SbirBaseRequest {
  PassengerOrderID: string;
}
export type NotArrivedPassengerResponse = SbirBaseResponse;



// 司機點選指定乘客下車
export interface DriverTapGetOffRequset extends SbirBaseRequest {
  DriverOrderID: string;
  PassengerOrderID: string;
}
export interface DriverTapGetOffResponse extends SbirBaseResponse {
  TaxiFare: number;
}



// 司機旅程結束
export interface DriverEndTripRequset extends SbirBaseRequest {
  DriverOrderID: string;
  // 初始丟false，如果車上有未下車乘客會跳出提示框，如按確定丟true
  isCheck: boolean;
}
export type DriverEndTripResponse = SbirBaseResponse;



// 查詢歷史
export interface DriverSearchHistoryRequest extends SbirBaseRequest {
  Page: number;
}
export interface DriverSearchHistoryResponse extends SbirBaseResponse {
  DriverHistorys: any[];
}
