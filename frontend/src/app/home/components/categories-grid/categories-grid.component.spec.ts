import { CategoriesGridComponent } from './categories-grid.component';
import { HomeModule } from '../../home.module';
import { RouterTestingModule } from '@angular/router/testing';
import { createBasicComponentTest } from '../../../shared/testing/test-helpers';

describe('CategoriesGridComponent', () => {
  const { beforeEach: setupTest, createTest, getComponent } = createBasicComponentTest(
    CategoriesGridComponent,
    [HomeModule, RouterTestingModule]
  );

  beforeEach(setupTest);

  beforeEach(() => {
    getComponent().categories = [];
  });

  it('should create', createTest());
});
