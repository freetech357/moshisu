import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-department-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css','../../../../common.css']
})
export class HeaderComponent {
  constructor(
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.mobileSidebar(); 
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mobileSidebar();
  }
  toggleSidebar() {
    const sidebarElement = document.querySelector('#superadmin-sidebar-component') as HTMLElement;
    sidebarElement.classList.toggle('hide');
    const mainElement = document.querySelector('main') as HTMLElement;
    mainElement.classList.toggle('sidebar-on');
    const footerElement = document.querySelector('#superadmin-sidebar-footer') as HTMLElement;
    footerElement.classList.toggle('sidebar-on');
  }
  mobileSidebar(){
    const mainElement = document.querySelector('main') as HTMLElement;
    const sidebarElement = document.querySelector('#superadmin-sidebar-component') as HTMLElement;
  const isMobile = window.innerWidth <= 766;
  if (isMobile) {
    sidebarElement.classList.add('hide');
    mainElement.classList.remove('sidebar-on');
  }else{
    sidebarElement.classList.remove('hide');
    mainElement.classList.add('sidebar-on');
  }
}
}
function ngOnInit(): (target: HeaderComponent, propertyKey: "") => void {
  throw new Error('Function not implemented.');
}
