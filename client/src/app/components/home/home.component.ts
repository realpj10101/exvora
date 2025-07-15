import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule, MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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
}
