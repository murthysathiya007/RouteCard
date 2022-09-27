export interface IRouteCard {
  id?:string;
  name?:string | null;
  process?:string;
  outbom?:boolean;
  inbom?:boolean;
  type?:string;
  start_date?:string | Date;
  end_date?:string | Date;
  assignee?:string;
  status?:string;
}

