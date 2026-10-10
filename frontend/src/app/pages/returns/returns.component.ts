import { Component } from '@angular/core';
import { RETURN_WINDOW, FREE_RETURN_CONDITIONS, RETURN_PROCESS_STEPS, ProcessStep } from './data';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.scss']
})
export class ReturnsComponent {
  returnWindow = RETURN_WINDOW;
  freeReturnConditions = FREE_RETURN_CONDITIONS;
  processSteps: ProcessStep[] = RETURN_PROCESS_STEPS;
}
