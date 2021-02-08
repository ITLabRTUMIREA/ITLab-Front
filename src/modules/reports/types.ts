// actions
export const REPORTS_FETCH_ALL = 'REPORT_FETCH_ALL';
export const REPORT_FETCH_ONE = 'REPORT_FETCH_ONE';
export const REPORT_COMMIT = 'REPORT_COMMIT';
export const REPORT_FILE_FETCH_ALL = 'REPORT_FILE_FETCH_ALL';
export const REPORT_FILE_COMMIT = 'REPORT_FILE_COMMIT';
export const REPORT_FILE_DELETE = 'REPORT_FILE_DELETE';

// setters
export const REPORTS_SET_ALL = 'REPORTS_SET_ALL';
export const REPORTS_SET_ONE = 'REPORTS_SET_ONE';
export const REPORT_FILES_SET_ALL = 'REPORT_FILES_SET_ALL';
export const REPORT_FILE_SET_ONE = 'REPORT_FILE_SET_ONE';
export const REPORT_FILE_REMOVE = 'REPORT_FILE_REMOVE';

// getters
export const REPORTS_GET_ALL = 'REPORTS_GET_ALL';
export const REPORT_FILES_GET_ALL = 'REPORT_FILES_GET_ALL';

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

// ReportFile //
///////////////

export class ReportFile extends ReportType {
  public chunkSize: number = 261120;
  public filename: string = '';
  public id: string = '';
  public length: number = 790963;
  public metadata: {
    fileSender: string,
    fileDescription: string
  } = {
    fileSender: '',
    fileDescription: ''
  };
  public fileDescription: string = '';
  public fileSender: string = '';
  public uploadDate: string = '';
}

export interface IReportFile extends ReportFile { }

// State //
//////////

export interface IReportState {
  reports: IReportTypeDefault[];
  files: IReportFile[];
}
