import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/account/register/register.component';
import { LoginComponent } from './components/account/login/login.component';
import { UserComponent } from './components/user/user.component';
import { ExchangeCardComponent } from './components/cards/exchange-card/exchange-card.component';
import { CurrencyComponent } from './components/currency/currency.component';
import { AdminComponent } from './components/admin/admin.component';
import { ExchangesComponent } from './components/exchanges/exchanges.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'account/register', component: RegisterComponent },
    { path: 'account/login', component: LoginComponent },
    { path: 'user', component: UserComponent },
    { path: 'currencies/:exchangeName', component: CurrencyComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'admin/exchanges', component: ExchangesComponent}
];
