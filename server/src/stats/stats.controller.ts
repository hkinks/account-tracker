import { Controller, Get } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { BalanceRecordsService } from '../balance-records/balance-records.service';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly balanceRecordsService: BalanceRecordsService,
  ) {}

  @Get()
  async getStats() {
    const accounts = await this.accountsService.findAll();
    const balanceRecords = await this.balanceRecordsService.findAll();

    // Group accounts by currency
    const accountsByCurrency = accounts.reduce((acc, account) => {
      if (!acc[account.currency]) {
        acc[account.currency] = [];
      }
      acc[account.currency].push(account);
      return acc;
    }, {} as Record<string, typeof accounts>);

    // Calculate total balance per currency
    const totalBalanceByCurrency = Object.entries(accountsByCurrency).reduce(
      (acc, [currency, currencyAccounts]) => {
        acc[currency] = Number(
          currencyAccounts
            .reduce((sum, account) => sum + account.balance, 0)
            .toFixed(2),
        );
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter((acc) => acc.isActive).length;
    const totalBalanceRecords = balanceRecords.length;

    return {
      totalBalanceByCurrency,
      totalAccounts,
      activeAccounts,
      totalBalanceRecords,
      accountsByType: accounts.reduce((acc, account) => {
        acc[account.accountType] = (acc[account.accountType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
