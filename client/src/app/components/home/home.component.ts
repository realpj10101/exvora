import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { LoggedInUser } from '../../models/logged-in-user.model';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, MatIconModule, ReactiveFormsModule, FormsModule, RouterModule, RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  accountService = inject(AccountService);
  loggedInUserSig: Signal<LoggedInUser | null> | undefined;

  ngOnInit(): void {
    console.log(this.loggedInUserSig);
    
    this.loggedInUserSig = this.accountService.loggedInUserSig;
  }

  cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: '$45,230', change: '+2.5%' },
    { symbol: 'ETH', name: 'Ethereum', price: '$3,180', change: '-1.2%' },
    { symbol: 'ADA', name: 'Cardano', price: '$0.85', change: '+5.8%' }
  ];

  stats = [
    {
      icon: '💼', // You can replace this with a component or SVG/icon name
      value: '1M+',
      label: 'Trades Executed'
    },
    {
      icon: '🌍',
      value: '100+',
      label: 'Countries Supported'
    },
    {
      icon: '🔐',
      value: '99.99%',
      label: 'Uptime Guarantee'
    },
    {
      icon: '🚀',
      value: '0.01s',
      label: 'Order Speed'
    }
  ];

  features = [
    {
      icon: '🔒',
      bgColor: 'bg-blue-100',
      color: 'text-blue-600',
      title: 'Secure Transactions',
      description: 'We use industry-leading security protocols to keep your assets safe.'
    },
    {
      icon: '⚡',
      bgColor: 'bg-purple-100',
      color: 'text-purple-600',
      title: 'Lightning Fast',
      description: 'Our platform executes orders in milliseconds.'
    },
    {
      icon: '📈',
      bgColor: 'bg-green-100',
      color: 'text-green-600',
      title: 'Real-time Analytics',
      description: 'Get live insights and data-driven tools.'
    },
    {
      icon: '🧩',
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600',
      title: 'Customizable API',
      description: 'Integrate easily with your own systems and bots.'
    }
  ];

  testimonials = [
    {
      name: 'Alice Johnson',
      role: 'Pro Trader',
      rating: 5,
      content: 'ExchangePro is a game changer. Fast, secure, and incredibly user-friendly.',
      avatar: 'https://i.pravatar.cc/100?img=1'
    },
    {
      name: 'Mohamed Aziz',
      role: 'Exchange Owner',
      rating: 4,
      content: 'Managing my own exchange has never been this easy. Highly recommended!',
      avatar: 'https://i.pravatar.cc/100?img=2'
    },
    {
      name: 'Lucia Chen',
      role: 'Crypto Enthusiast',
      rating: 5,
      content: 'The tools and support provided by ExchangePro are unmatched.',
      avatar: 'https://i.pravatar.cc/100?img=4'
    }
  ];

  generateArray(n: number): number[] {
    return Array(n).fill(0);
  }
}
