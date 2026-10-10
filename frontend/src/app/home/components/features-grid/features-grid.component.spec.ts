import { FeaturesGridComponent } from './features-grid.component';
import { HomeModule } from '../../home.module';
import { RouterTestingModule } from '@angular/router/testing';
import { createBasicComponentTest } from '../../../shared/testing/test-helpers';

describe('FeaturesGridComponent', () => {
  const { beforeEach: setupTest, createTest, getComponent } = createBasicComponentTest(
    FeaturesGridComponent,
    [HomeModule, RouterTestingModule]
  );

  beforeEach(setupTest);

  beforeEach(() => {
    getComponent().features = [];
  });

  it('should create', createTest());
});
