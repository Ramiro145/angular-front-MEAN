import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {

  private authService = inject(AuthService);

  public user = computed(()=> this.authService.currentUser());

  //igual que con los signals
  // get user(){
  //   return this.authService.currentUser();
  // }

  logout(){
    this.authService.logout();
  }

}
