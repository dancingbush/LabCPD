import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfMakePage } from './pdf-make.page';

describe('PdfMakePage', () => {
  let component: PdfMakePage;
  let fixture: ComponentFixture<PdfMakePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PdfMakePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
