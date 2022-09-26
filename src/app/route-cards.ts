export interface IRouteCard {
  id?:string;
  name?:string | null;
  process?:string;
  outbom?:boolean;
  inbom?:boolean;
  type?:string;
  start_date?:string;
  end_date?:string;
  assignee?:string;
  status?:string;
}

