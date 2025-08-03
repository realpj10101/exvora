import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'

@Component({
  selector: 'app-no-access',
  imports: [
    MatButtonModule, MatIconModule, MatCardModule
  ],
  templateUrl: './no-access.component.html',
  styleUrl: './no-access.component.scss'
})
export class NoAccessComponent {

}
