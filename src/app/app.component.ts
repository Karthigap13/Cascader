import { Component , OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CASCADER_OPTIONS, CUSTOM_TRIGGER, DISABLED_EXAMPLE, LAZY_LOAD, CUSTOM_RENDER } from './config/cascader-config';
import { CascaderComponent } from './cascader/cascader.component';
import { Option , CascaderConfig } from './config/option.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CascaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
 customTriggerOptions = CUSTOM_TRIGGER;
  cascaderOptions = CASCADER_OPTIONS;
  disabledOptions = DISABLED_EXAMPLE;
  lazyOptions = LAZY_LOAD;
  customRender = CUSTOM_RENDER;
  selectedValue = 'Unselect';
  options: any[] = [];
  private loadDataTimeout: any;

  onChange(event: { value: string[]; selectedOptions: any[] }) {
    this.selectedValue = event.selectedOptions.map(o => o.label).join(', ');
  }

  
  loadData(option: Option): Promise<Option[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { label: `${option.label} Dynamic 1`, value: 'dynamic1' },
          { label: `${option.label} Dynamic 2`, value: 'dynamic2' }
        ]);
      }, 1000);
    });
  }
  
  ngOnDestroy(): void {
    if (this.loadDataTimeout) {
      clearTimeout(this.loadDataTimeout);
    }
  }
 
 renderDisplay = (labels: string[]) => {
    return labels.join(' > ');
  };

  displayRender = (labels: string[], selectedOptions: Option[]) => {
    const lastOption = selectedOptions[selectedOptions.length - 1];
    const code = lastOption ? ` (${lastOption.code})` : '';
    return labels.join(' / ') + code;
  };

  myCascaderConfig: CascaderConfig = {
    allowClear: true,
    expandTrigger: 'click',
    placeholder: 'Please select',
    changeOnSelect: false,
    displayRender: this.renderDisplay.bind(this)
  };

  defaultValue: CascaderConfig = {
    allowClear: true,
    expandTrigger: 'click',
    placeholder: 'Please select',
    changeOnSelect: false,
    defaultValue:['zhejiang','hangzhou','xihu'] ,
    displayRender: this.renderDisplay.bind(this)
  };

 customTrigger : CascaderConfig = {
    expandTrigger: 'click',
    placeholder: 'Please select',
    changeOnSelect: false,
    displayRender: this.renderDisplay.bind(this)
  };

  hover : CascaderConfig = {
    allowClear: true,
    expandTrigger: 'hover',
    placeholder: 'Please select',
    changeOnSelect: false,
    displayRender: this.renderDisplay.bind(this)
  };

  changeOnSelect : CascaderConfig = {
    allowClear: true,
    expandTrigger: 'click',
    placeholder: 'Please select',
    changeOnSelect: true,
    displayRender: this.renderDisplay.bind(this)
  };
  
  lazyLoadConfig: CascaderConfig = {
    allowClear: true,
    expandTrigger: 'click',
    placeholder: 'Please select',
    changeOnSelect: true,
    displayRender: this.renderDisplay.bind(this)
  };

  variantBorderless: CascaderConfig = {
    variant: 'borderless',
    placeholder: 'Please select'
  };

  variantFilled: CascaderConfig = {
    variant: 'filled',
    placeholder: 'Please select'
  };

  variantOutlined: CascaderConfig = {
    variant: 'outlined',
    placeholder: 'Please select'
  };

  variantUnderlined: CascaderConfig = {
    variant: 'underlined',
    placeholder: 'Please select'
  };

  statusError: CascaderConfig = {
    status: 'error',
    placeholder: 'Error'
  };

  statusWarning: CascaderConfig = {
    status: 'warning',
    placeholder: 'Warning Multiple'
  };

  prefixSuffixConfig1: CascaderConfig = {
    allowClear: true,
    placeholder: 'Please select',
    suffixIcon: 'bi bi-emoji-smile'
  };

  prefixSuffixConfig2: CascaderConfig = {
    allowClear: true,
    placeholder: 'Please select',
    suffixIcon: 'ab'
  };

  prefixSuffixConfig3: CascaderConfig = {
    allowClear: true,
    placeholder: 'Please select',
    expandIcon: 'ab'
  };

  prefixSuffixConfig4: CascaderConfig = {
    allowClear: true,
    placeholder: 'Please select',
    expandIcon: 'bi bi-emoji-smile'
  };

  prefixSuffixConfig5: CascaderConfig = {
    allowClear: true,
    placeholder: 'Please select',
    prefixIcon: 'bi bi-emoji-smile'
  };
 

 smallSize: CascaderConfig = {
    allowClear: true,
    expandTrigger: 'click',
    placeholder: 'Please select',
    changeOnSelect: false,
    size: 'small',
    displayRender: this.renderDisplay.bind(this)
  };

  largeSize: CascaderConfig = {
    allowClear: true,
    expandTrigger: 'click',
    placeholder: 'Please select',
    changeOnSelect: false,
    size: 'large',
    displayRender: this.renderDisplay.bind(this)
  };

 
}
