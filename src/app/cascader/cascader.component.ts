import { Component, Input , OnInit , ChangeDetectorRef } from '@angular/core';
import {ContentChild, TemplateRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Option } from '../config/option.interface';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-cascader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cascader.component.html',
  styleUrl: './cascader.component.css'
})
export class CascaderComponent {
  @Input() options: Option[] = [];
  @Input() allowClear : boolean = true;
  @Input() disabled = false;
  @Input() placeholder : string = 'Select option';
  @Input() expandTrigger: 'click' | 'hover' = 'click';
  @Input() changeOnSelect : boolean = false;
  @Input() defaultValue: string[] = [];
  @Input() useInternalTrigger: boolean = false;
  @Input() size: 'small' | 'middle' | 'large' = 'middle';
  @Output() loadData = new EventEmitter<Option>();




  @Output() onChange = new EventEmitter<{ value: string[]; selectedOptions: Option[] }>();
  @Input() displayRender: (labels: string[]) => string = (labels) => labels.join(' / ');
  @ContentChild(TemplateRef) customTrigger!: TemplateRef<any>;

  hasCustomTrigger = false;
  showDropdown = false;
  selectedPath: Option[] = [];
  finalValue = '';
  hovering = false;  
  selectionComplete: boolean= false;
  
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.defaultValue && this.defaultValue.length) {
      this.selectedPath = [];
      let options = this.options;
      for (const val of this.defaultValue) {
        const found = options.find(o => o.value === val);
        if (found) {
          this.selectedPath.push(found);
          options = found.children || [];
        } else {
          break; 
        }
      }
      this.finalValue = this.displayRender(this.selectedPath.map(o => o.label));
    }
  }

  ngAfterContentInit() {
    this.hasCustomTrigger = !!this.customTrigger;
  }

  openDropdown() {
    if (this.disabled) return;
    this.showDropdown = !this.showDropdown;
  }

  clearSelection() {
    this.selectedPath = [];
    this.finalValue = '';
    this.showDropdown = false;
  }

  toggleOrClear() {
    if (this.allowClear && this.hovering && this.finalValue) {
      console.log('allowClear:', this.allowClear);
      this.clearSelection();
    } else {
      this.openDropdown();
    }
  }
  
  logClick() {
    console.log('Icon clicked');
  }
  
  // selectOption(option: Option, level: number) {
  //   this.selectedPath = this.selectedPath.slice(0, level);   // Trim the selectedPath array up to this level
  //   this.selectedPath[level] = option;

  //   if (this.changeOnSelect || !option.children || option.children.length === 0) {
  //     this.finalValue = this.displayRender(this.selectedPath.map(o => o.label));
  //     if (!option.children || option.children.length === 0) {
  //       this.showDropdown = false;
  //       //this.selectedPath = [];

  //       if (this.changeOnSelect) {
  //         this.selectionComplete = true;  // <-- only set if changeOnSelect true
  //       }

  //       if (option.isLeaf === false && !option.children) {
  //         option.loading = true;
  //         this.loadData.emit(option);
  //         return;
  //       }
  //       // Emit onChange event here
  // this.onChange.emit({
  //   value: this.selectedPath.map(o => o.value),
  //   selectedOptions: this.selectedPath
  // });
  //     }
  //   }
  // }


  selectOption(option: Option, level: number) {
    this.selectedPath = this.selectedPath.slice(0, level);
    this.selectedPath[level] = option;
  
    const isLeaf = option.isLeaf ?? (!option.children || option.children.length === 0);
  
    // Lazy load if needed
    if (option.isLeaf === false && !option.children) {
      option.loading = true;
      this.loadData.emit(option);
    }
  
    if (this.changeOnSelect || isLeaf) {
      this.finalValue = this.displayRender(this.selectedPath.map(o => o.label));
  
      if (isLeaf) {
        this.showDropdown = false;
      }
  
      this.onChange.emit({
        value: this.selectedPath.map(o => o.value),
        selectedOptions: this.selectedPath
      });
  
      if (this.changeOnSelect) {
        this.selectionComplete = true;
      }
    }
  }
  



  getColumnOptions(level: number) {
    if (level === 0) {
      return this.options;
    }
    const parent = this.selectedPath[level - 1];
    return parent && parent.children ? parent.children : [];
  }

  get inputTextColor() {
    if (!this.changeOnSelect) {
      return '#000'; // always black if not using changeOnSelect
    }
    return this.selectionComplete ? '#000' : '#888';
  }
  
 get dropdownLevels() {
  const levels = [];
  let level = 0;
  let options = this.options;

  while (true) {
    levels.push(level);
    const selected = this.selectedPath[level];
    if (selected && selected.children && selected.children.length > 0) {
      options = selected.children;
      level++;
    } else {
      break;
    }
  }

  return levels;
}

  get displayValue() {
    return this.finalValue;
    console.log(this.finalValue)
  }

  
  shouldSelectOnClick(option: Option): boolean {
    if (option.disabled) {
      return false;
    }
    return this.expandTrigger === 'click' || !option.children;
  }
  
  
  onOptionHover(option: Option, level: number) {
    if (this.expandTrigger === 'hover' && option.children && option.children.length > 0) {
      this.selectOption(option, level);
    }
  }
}
