import { NewsletterComponent } from './newsletter.component';
import { HomeModule } from '../../home.module';
import { RouterTestingModule } from '@angular/router/testing';
import { createBasicComponentTest } from '../../../shared/testing/test-helpers';

describe('NewsletterComponent', () => {
  const { beforeEach: setupTest, createTest } = createBasicComponentTest(
    NewsletterComponent,
    [HomeModule, RouterTestingModule]
  );

  beforeEach(setupTest);

  it('should create', createTest());
});
