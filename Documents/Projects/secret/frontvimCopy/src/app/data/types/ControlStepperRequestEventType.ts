export interface ControlStepperRequestEventType {
  isNext: boolean;
  step_action: number;
  data: {
    name: string;
    value: any;
    is_greater_than?: boolean;
  };
}
