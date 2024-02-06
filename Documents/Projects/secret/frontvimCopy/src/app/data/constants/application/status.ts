import PendingStatus from './pending-status';
import ApprovedStatus from './approved-status';

const ApplicationStatus: Map<
  string,
  Map<
    string,
    {
      dbName: string;
      toShow: string;
      class: string;
    }
  >
> = new Map();

ApplicationStatus.set('pending', PendingStatus);
ApplicationStatus.set('approved', ApprovedStatus);

export default ApplicationStatus;
