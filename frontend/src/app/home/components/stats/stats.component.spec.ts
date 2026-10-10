import { StatsComponent } from './stats.component';
import { HomeModule } from '../../home.module';
import { RouterTestingModule } from '@angular/router/testing';
import { createBasicComponentTest } from '../../../shared/testing/test-helpers';

describe('StatsComponent', () => {
  const { beforeEach: setupTest, createTest } = createBasicComponentTest(
    StatsComponent,
    [HomeModule, RouterTestingModule]
  );

  beforeEach(setupTest);

  it('should create', createTest());
});
