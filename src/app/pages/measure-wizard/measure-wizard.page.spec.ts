import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeasureWizardPage } from './measure-wizard.page';

describe('MeasureWizardPage', () => {
  let component: MeasureWizardPage;
  let fixture: ComponentFixture<MeasureWizardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureWizardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
