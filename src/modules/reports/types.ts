// actions
export const REPORTS_FETCH_ALL = 'REPORT_FETCH_ALL';
export const REPORT_COMMIT = 'REPORT_COMMIT';

// setters
export const REPORTS_SET_ALL = 'REPORTS_SET_ALL';
export const REPORTS_SET_ONE = 'REPORTS_SET_ONE';

// getters
export const REPORTS_GET_ALL = 'REPORTS_GET_ALL';

// ReportType //
///////////////

export class ReportType {
  public id: string = '';
  public name?: string = '';
  public text: string = '';
}

export interface IReportType extends ReportType { }

// ReportTypeDefault //
//////////////////////

export class ReportTypeDefault extends ReportType {
  public assignees: {reporter: string, implementer: string} = {
    reporter: '',
    implementer: ''
  };
  public date?: string = '';
  public archived?: boolean = false;
}

export interface IReportTypeDefault extends ReportTypeDefault { }

// State //
//////////

export interface IReportState {
  reports: IReportTypeDefault[];
}
