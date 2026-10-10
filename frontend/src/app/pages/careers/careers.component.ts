import { Component } from '@angular/core';
import { CAREER_JOBS, CAREER_BENEFITS, JobPosition, Benefit } from './data';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent {
  jobs: JobPosition[] = CAREER_JOBS;
  benefits: Benefit[] = CAREER_BENEFITS;
  selectedJob: JobPosition | null = null;
}
