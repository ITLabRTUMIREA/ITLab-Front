// import 'globals';
import store from '@/store';
import { PROFILE_HAS_ROLE } from '@/modules/profile';
import { UserRoleName } from './modules/users';

export class Globals {
  public SYSTEM_NAME: string = 'ITLab';

  public DATETIME_FORMAT: string = 'DD.MM.YYYY HH:mm';
  public DATETIME_WEEKDAY_FORMAT: string = 'ddd, DD.MM.YYYY HH:mm';
  public DATE_FORMAT: string = 'DD.MM.YYYY';
  public TIME_FORMAT: string = 'HH:mm';
  public FRONT_POSTFIX: string = '/front/front/';

  public hasRole(userRole: UserRoleName): boolean {
    return store.getters[PROFILE_HAS_ROLE](userRole);
  }
}

const globals: Globals = new Globals();
export default globals;
