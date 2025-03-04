import { Injectable, Logger } from '@nestjs/common';
import { CryptoTickerService } from '../crypto/crypto-ticker.service';

@Injectable()
export class CurrencyConverterService {
  private readonly logger = new Logger(CurrencyConverterService.name);
  
  constructor(private readonly cryptoTickerService: CryptoTickerService) {}
  
  /**
   * Converts a cryptocurrency amount to EUR
   * @param amount The amount of cryptocurrency
   * @param cryptoSymbol The cryptocurrency symbol (e.g., 'BTC', 'ETH')
   * @returns Promise with the amount converted to EUR
   */
  async convertCryptoToEur(amount: number, cryptoSymbol: string): Promise<number> {
    try {
      // Append USDT to get the trading pair (most common pairing)
      const tradingPair = `${cryptoSymbol.toUpperCase()}USDT`;
      
      // Get the current price in USDT
      const tickerData = await this.cryptoTickerService.getCurrentPrice(tradingPair);
      
      // Get the USDT/EUR conversion rate
      const usdtEurData = await this.cryptoTickerService.getCurrentPrice('EURUSDT');
      const eurToUsdtRate = 1 / usdtEurData.price;
      
      // Calculate the EUR value
      const eurValue = amount * tickerData.price * eurToUsdtRate;
      
      return eurValue;
    } catch (error) {
      this.logger.error(`Failed to convert ${cryptoSymbol} to EUR: ${error.message}`);
      throw new Error(`Currency conversion failed: ${error.message}`);
    }
  }
} 