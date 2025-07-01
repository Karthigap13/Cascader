export interface Option {
    value: string;
    label: string;
    children?: Option[];
    disabled?: boolean;
    isLeaf?: boolean;
    loading?: boolean;
    code?: number;
   }

   export interface CascaderConfig {
    allowClear?: boolean;
    disabled?: boolean;
    placeholder?: string;
    defaultValue?: string[]; 
    expandTrigger?: 'click' | 'hover';
    changeOnSelect?: boolean;
    size?: 'small' | 'middle' | 'large';
    variant?: 'borderless' | 'filled' | 'outlined' | 'underlined';
    status?: 'error' | 'warning' | null;
    multiple?: boolean;
    panelOnly?: boolean;
    placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
    showPlacementRadios?: boolean;
    showSearch?: boolean | { filter?: (inputValue: string, path: Option[]) => boolean };
    prefixIcon?: string;
    suffixIcon?: string;
    expandIcon?: string;
    displayRender?: (labels: string[], selectedOptions: Option[]) => string;
  }
  
  export interface CascaderEvent<T> {
    type: 'change' | 'load' | 'search';
    payload: T;
  }
  
  