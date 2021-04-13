// actions
export const EVENT_SALARY_FETCH_ALL = 'EVENT_SALARY_FETCH_ALL';
export const EVENT_SALARY_FETCH_ONE = 'EVENT_SALARY_FETCH_ONE';
export const EVENT_SALARY_COMMIT = 'EVENT_SALARY_COMMIT';
export const EVENT_SALARY_DELETE = 'EVENT_SALARY_DELETE';
export const REPORT_SALARY_FETCH_ALL = 'REPORT_SALARY_FETCH_ALL';
export const REPORT_SALARY_COMMIT = 'REPORT_SALARY_COMMIT';

// mutations
export const REPORT_SALARY_SET_ALL = 'REPORT_SALARY_SET_ALL';

// getters
export const REPORT_SALARY_GET_ALL = 'REPORT_SALARY_GET_ALL';
export const REPORT_SALARY_GET_ONE = 'REPORT_SALARY_GET_ONE';

// Shift Salary//

export class ShiftSalaryDefault {
    public clientId?: number;
    public shiftId: string = '';
    public count: number | null = null;
    public description: string = '';

    public isNew?: boolean = true;
}

export interface IShiftSalary extends ShiftSalaryDefault {}

// Place Salary//

export class PlaceSalaryDefault {
    public clientId?: number;
    public placeId: string = '';
    public count: number | null = null;
    public description: string = '';
    public isNew?: boolean = true;
}

export interface IPlaceSalary extends PlaceSalaryDefault {}

// Event Salary//

export class EventSalaryDefault {
    public eventId?: string = '';
    public count: number | null = null;
    public shiftSalaries?: IShiftSalary[];
    public placeSalaries?: IPlaceSalary[];
    public description: string = '';
    public isNew?: boolean = true;
}

export interface IEventSalary extends EventSalaryDefault {}

// Report Salary //
//////////////////

export class ReportSalary {
    public reportId: string = '';
    public approved: string = '';
    public approverId: string = '';
    public count: string = '';
    public description: string = '';
}

export interface IReportSalary extends ReportSalary {}

// State //
//////////

export class SalaryState {
    public eventSalaries: IEventSalary[] = [];
    public reportsSalaries: IReportSalary[] = [];
}

export interface ISalaryState extends SalaryState {}
