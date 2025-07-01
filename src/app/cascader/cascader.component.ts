import { Component, Input , OnInit , ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import {ContentChild, TemplateRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementRef, HostListener } from '@angular/core';
import { Option  , CascaderConfig, CascaderEvent} from '../config/option.interface';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-cascader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, 
  imports: [CommonModule , FormsModule],
  templateUrl: './cascader.component.html',
  styleUrl: './cascader.component.css'
})
export class CascaderComponent {
  @Input() options: Option[] = [];
  @Input() config: CascaderConfig = {};
  @Input() useInternalTrigger: boolean = false;
  @Input() loadDataFn?: (option: Option) => Promise<Option[]>;   // clean async handler
  @Output() onChange = new EventEmitter<{ value: string[]; selectedOptions: Option[] }>();
 // @Output() onChange = new EventEmitter<{ value: string[]; selectedOptions: Option[] }>();
 //@Output() onChange = new EventEmitter<CascaderEvent<{ value: string[]; selectedOptions: Option[] }>>();

  @Input() displayRender: (labels: string[], selectedOptions: Option[]) => string = 
  (labels, _) => labels.join(' / ');
  @ContentChild(TemplateRef) customTrigger!: TemplateRef<any>;

  hasCustomTrigger = false;
  showDropdown = false;
  selectedPath: Option[] = [];
  finalValue = '';
  hovering = false;  
  selectionComplete: boolean= false;
  
  private _dropdownLevels: number[] = [];
  private _lastSelectedPathSnapshot: string = '';
  constructor(private elementRef: ElementRef) {}
   private _columnOptionsCache: { [level: number]: Option[] } = {};


  @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  // If dropdown is open, and click is outside this component, close it
  if (this.showDropdown && !this.elementRef.nativeElement.contains(event.target)) {
    this.showDropdown = false;
  }
}

  ngOnInit() {
    
    if (!Array.isArray(this.options)) {
      console.warn('[Cascader] options input is not an array.');
      return;
    }
  
    if (this.config.defaultValue && this.config.defaultValue.length) {
      this.selectedPath = [];
      let options = this.options;
  
      for (const val of this.config.defaultValue) {
        if (!Array.isArray(options)) {
          console.warn(`[Cascader] Invalid options structure while resolving value "${val}".`);
          break;
        }
  
        const found = options.find(o => o.value === val);
        if (found) {
          this.selectedPath.push(found);
          options = found.children || [];
        } else {
          console.warn(`[Cascader] Value "${val}" not found in options.`);
          break;
        }
      }
  
      if (this.selectedPath.length > 0) {
        this.finalValue = this.displayRender(
          this.selectedPath.map(o => o.label),
          this.selectedPath
        );
      } else {
        console.warn('[Cascader] Default value path could not be resolved.');
      }
    }
  }
  
  ngAfterContentInit() {
    this.hasCustomTrigger = !!this.customTrigger;
  }

  openDropdown() {
    if (this.config.disabled) return;
    this.showDropdown = !this.showDropdown;
  }

  clearSelection() {
    this._columnOptionsCache = {};  
    this.selectedPath = [];
    this.finalValue = '';
    this.showDropdown = false;
   
  }

  toggleOrClear() {
    if (this.config.allowClear && this.hovering && this.finalValue) {
      console.log('allowClear:', this.config.allowClear);
      this.clearSelection();
    } else {
      this.openDropdown();
    }
  }
  
 selectOption(option: Option, level: number) {   // Called when an option is selected in the dropdown panel
  this._columnOptionsCache = {};  // clear cache on clear
  this.selectedPath = [
    ...this.selectedPath.slice(0, level),
    option
  ];  // Keep selected options up to the current level and remove any deeper levels
    this.selectedPath[level] = option;  // Add the newly selected option at the current level
    const isLeaf = option.isLeaf ?? (!option.children || option.children.length === 0);   // Check if the selected option is a leaf node (no children)
    
     //  async lazy load if needed
     if (!isLeaf && !option.children && this.loadDataFn) {
      option.loading = true;
      this.loadDataFn(option).then(children => {
        option.children = children;
        option.loading = false;
        this._lastSelectedPathSnapshot = '';
      }).catch(() => {
        option.loading = false;
        console.error('Failed to load children for option', option);
      });
    }
  
    if (this.config.changeOnSelect || isLeaf) {
      this.finalValue = this.displayRender(  // Use displayRender function to convert selected labels into display string
        this.selectedPath.map(o => o.label),
        this.selectedPath  // Full selected option objects path
      );
      if (isLeaf) {
        this.showDropdown = false;
      }
      // Emit onChange event to parent component with selected values and options
      this.onChange.emit({
        value: this.selectedPath.map(o => o.value),
          selectedOptions: this.selectedPath
      });

      if (this.config.changeOnSelect) {
        this.selectionComplete = true;
      }
    }
  }
 
  

getColumnOptions(level: number) {
  if (this._columnOptionsCache[level]) {
    return this._columnOptionsCache[level];
  }

  const options = level === 0
    ? this.options
    : this.selectedPath[level - 1]?.children || [];

  this._columnOptionsCache[level] = options;
  return options;
}

  getInputColorClass() {
    if (!this.config.changeOnSelect) {
      return 'input-default';
    }
    return this.selectionComplete ? 'input-default' : 'input-placeholder';
  }
  
  
  get dropdownLevels() {
    const currentSnapshot = JSON.stringify(this.selectedPath.map(o => o.value));
    if (currentSnapshot !== this._lastSelectedPathSnapshot) {
      this._lastSelectedPathSnapshot = currentSnapshot;
      this._dropdownLevels = this.computeDropdownLevels();
    }
  return this._dropdownLevels;
  }
  
  private computeDropdownLevels(): number[] {
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
  }

  
  shouldSelectOnClick(option: Option): boolean {
    if (option.disabled) {
      return false;
    }
    return this.config.expandTrigger === 'click' || !option.children;
  }
  
  
  onOptionHover(option: Option, level: number) {
    if (this.config.expandTrigger === 'hover' && option.children && option.children.length > 0) {
      this.selectOption(option, level);
    }
  }

  isIconClass(value: string): boolean {
    if (!value) return false;
    return value.includes(' ') || value.startsWith('bi');
  }
  
  
  trackByValue(index: number, option: Option): any {
    return option.value;
  }
  
}
