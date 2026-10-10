import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Lucide icons explicitly
import { 
  LucideAngularModule, 
  LogIn, UserPlus, ShoppingCart, ArrowLeft, Image as ImageIcon, Minus, Plus, Trash2, Trash, 
  ShoppingBag, Check, CreditCard, Lock, Truck, Undo2, MapPin, Globe, Smartphone, 
  CheckCircle, Activity, XCircle, Download, Package, Inbox, RotateCcw, Star, Eye, 
  MessageSquare, ThumbsUp, ShoppingBasket, Home, Store, Sun, Moon, User, LogOut, 
  X, Loader2, AlertTriangle, RefreshCw, AlertCircle, Filter, SearchX, ArrowRight, 
  ChevronLeft, ChevronRight, ChevronDown, Search, Mail, Info, Calendar, List, 
  HelpCircle, Sliders
} from 'lucide-angular';

const icons = {
  LogIn, UserPlus, ShoppingCart, ArrowLeft, Image: ImageIcon, Minus, Plus, Trash2, Trash, 
  ShoppingBag, Check, CreditCard, Lock, Truck, Undo2, MapPin, Globe, Smartphone, 
  CheckCircle, Activity, XCircle, Download, Package, Inbox, RotateCcw, Star, Eye, 
  MessageSquare, ThumbsUp, ShoppingBasket, Home, Store, Sun, Moon, User, LogOut, 
  X, Loader2, AlertTriangle, RefreshCw, AlertCircle, Filter, SearchX, ArrowRight, 
  ChevronLeft, ChevronRight, ChevronDown, Search, Mail, Info, Calendar, List, 
  HelpCircle, Sliders
};

import { UiButtonComponent } from './components/button/button.component';
import { UiCardComponent } from './components/card/card.component';
import { UiInputComponent } from './components/input/input.component';
import { UiBadgeComponent } from './components/badge/badge.component';
import { UiTableComponent } from './components/table/table.component';
import { UiToastComponent } from './components/toast/toast.component';
import { UiConfirmationComponent } from './components/confirmation/confirmation.component';
import { UiSkeletonComponent, UiSkeletonGroupComponent } from './components/skeleton/skeleton.component';
import { UiErrorComponent, UiErrorBoundaryComponent } from './components/error/error.component';
import { UiNotFoundComponent } from './components/not-found/not-found.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SortDropdownComponent } from './components/sort-dropdown/sort-dropdown.component';
import { UiDrawerComponent } from './components/drawer/drawer.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

const UI_COMPONENTS = [
  UiButtonComponent,
  UiCardComponent,
  UiInputComponent,
  UiBadgeComponent,
  UiTableComponent,
  UiToastComponent,
  UiConfirmationComponent,
  UiSkeletonComponent,
  UiSkeletonGroupComponent,
  UiErrorComponent,
  UiErrorBoundaryComponent,
  UiNotFoundComponent,
  SearchBarComponent,
  FilterPanelComponent,
  PaginationComponent,
  SortDropdownComponent,
  UiDrawerComponent,
  SelectComponent,
  SpinnerComponent
];

@NgModule({
  declarations: [...UI_COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule.pick(icons)
  ],
  exports: [
    ...UI_COMPONENTS,
    LucideAngularModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class UiModule { }
