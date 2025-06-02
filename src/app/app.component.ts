import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CASCADER_OPTIONS  ,CUSTOM_TRIGGER ,DISABLED_EXAMPLE, LAZY_LOAD } from './config/cascader-config';
import { CascaderComponent } from './cascader/cascader.component';
import { Option } from './config/option.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CascaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
 customTriggerOptions = CUSTOM_TRIGGER;
 cascaderOptions = CASCADER_OPTIONS;
 disabledOptions = DISABLED_EXAMPLE;
 lazyOptions = LAZY_LOAD;
 selectedValue = 'Unselect';
  options: any[] =[] ;

 
  onChange(event: { value: string[]; selectedOptions: any[] }) {
    this.selectedValue = event.selectedOptions.map(o => o.label).join(', ');
  }

  loadData(targetOption: Option): void {
    console.log('loadData called for', targetOption);
    targetOption.loading = true;
    this.lazyOptions = [...this.lazyOptions];  // trigger change detection
  
    setTimeout(() => {
      targetOption.children = [
        { label: `${targetOption.label} Dynamic 1`, value: 'dynamic1' },
        { label: `${targetOption.label} Dynamic 2`, value: 'dynamic2' }
      ];
      targetOption.loading = false;
      this.lazyOptions = [...this.lazyOptions];  // trigger change detection again
      console.log('loadData finished for:', targetOption);
    }, 1000);
  }
  
  
  

  openDropdown(): void {
    console.log('Dropdown toggled');
  }

  lastLabelRender = (labels: string[]) => labels[labels.length - 1] || '';

  renderDisplay = (labels: string[]) => {
    return labels.join(' > ');
  };
}
