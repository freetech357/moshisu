import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  // @Input() currentStep!: number;

  // steps = [
  //   { label: 'Step 1', link: '/portal/registration/form-ab' },
  //   { label: 'Step 2', link: '/portal/registration/form-c/:draftId' },
  //   { label: 'Step 3', link: '/portal/registration/form-d/:draftId' },
  //   { label: 'Step 4', link: '/portal/registration/form-ef/:draftId' },
  //   { label: 'Step 5', link: '/portal/registration/form-ghijklmn/:draftId' }
  // ];

  currentStep = 0;
 
  steps = [
    { label: 'Step 1', content: 'Content for Step 1' },
    { label: 'Step 2', content: 'Content for Step 2' },
    { label: 'Step 3', content: 'Content for Step 3' },
    { label: 'Step 4', content: 'Content for Step 4' }
  ];
 
  goToStep(index: number) {
    this.currentStep = index;
  }
 
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
 
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

}
