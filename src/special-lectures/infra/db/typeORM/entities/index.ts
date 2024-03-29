import { SpecialLecturesApplicationsTypeORM } from './special-lectures-applications.entity';
import { SpecialLecturesStudentsTypeORM } from './special-lectures-students.entity';
import { SpecialLecturesUsersTypeORM } from './special-lectures-users.entity';
import { SpecialLecturesTypeORM } from './special-lectures.entity';

const SpecialLecturesEntitiesTypeORM = [
  SpecialLecturesTypeORM,
  SpecialLecturesUsersTypeORM,
  SpecialLecturesApplicationsTypeORM,
  SpecialLecturesStudentsTypeORM,
];
export default SpecialLecturesEntitiesTypeORM;
