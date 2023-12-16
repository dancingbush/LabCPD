import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiaplyEventModalPage } from './diaply-event-modal.page';

describe('DiaplyEventModalPage', () => {
  let component: DiaplyEventModalPage;
  let fixture: ComponentFixture<DiaplyEventModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DiaplyEventModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
