export enum WorkerNames {
  'BULK_SAVE_PRODUCTS',
}

class QueueService {
  push(workerName: WorkerNames, data: object) {}
}

export default QueueService;
