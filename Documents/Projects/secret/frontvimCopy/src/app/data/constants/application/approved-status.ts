const ApprovedStatus: Map<string,{
    dbName: string;
    toShow: string;
    class: string;
  }> = new Map();

ApprovedStatus.set('validated', {
  dbName: 'validada',
  toShow: 'Validada',
  class: 'validate-status',
})
.set('dictamination', {
  dbName: 'dictaminacion',
  toShow: 'Dictaminacion',
  class: 'dictamination-status',
})
.set('aproved', {
  dbName: 'aprobada',
  toShow: 'Aprobada',
  class: 'aproved-status',
});

export default ApprovedStatus;
