import { Injectable, Logger, Optional } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

export interface CryptoTickerData {
  symbol: string;
  price: number;
  timestamp: number;
  volume?: number;
  high24h?: number;
  low24h?: number;
  priceChangePercent24h?: number;
}

@Injectable()
export class CryptoTickerService {
  private readonly logger = new Logger(CryptoTickerService.name);
  private readonly binanceApiUrl: string;
  
  constructor(@Optional() private configService: ConfigService) {
    // Use config service if available, otherwise use default URL
    this.binanceApiUrl = this.configService?.get('BINANCE_API_URL') || 'https://api.binance.com/api/v3';
  }

  /**
   * Fetches current price for a specific cryptocurrency
   * @param symbol Trading pair symbol (e.g., 'BTCUSDT', 'ETHUSDT')
   * @returns Promise with the ticker data
   */
  async getCurrentPrice(symbol: string): Promise<CryptoTickerData> {
    try {
      const response = await axios.get(`${this.binanceApiUrl}/ticker/price`, {
        params: { symbol: symbol.toUpperCase() }
      });
      
      return {
        symbol: response.data.symbol,
        price: parseFloat(response.data.price),
        timestamp: Date.now()
      };
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${symbol}: ${error.message}`);
      throw new Error(`Failed to fetch cryptocurrency price: ${error.message}`);
    }
  }

  /**
   * Fetches detailed 24hr ticker information for a cryptocurrency
   * @param symbol Trading pair symbol (e.g., 'BTCUSDT', 'ETHUSDT')
   * @returns Promise with detailed ticker data
   */
  async get24hrStats(symbol: string): Promise<CryptoTickerData> {
    try {
      const response = await axios.get(`${this.binanceApiUrl}/ticker/24hr`, {
        params: { symbol: symbol.toUpperCase() }
      });
      
      return {
        symbol: response.data.symbol,
        price: parseFloat(response.data.lastPrice),
        timestamp: Date.now(),
        volume: parseFloat(response.data.volume),
        high24h: parseFloat(response.data.highPrice),
        low24h: parseFloat(response.data.lowPrice),
        priceChangePercent24h: parseFloat(response.data.priceChangePercent)
      };
    } catch (error) {
      this.logger.error(`Failed to fetch 24hr stats for ${symbol}: ${error.message}`);
      throw new Error(`Failed to fetch cryptocurrency statistics: ${error.message}`);
    }
  }

  /**
   * Fetches prices for multiple cryptocurrencies at once
   * @param symbols Array of trading pair symbols (e.g., ['BTCUSDT', 'ETHUSDT'])
   * @returns Promise with an array of ticker data
   */
  async getMultiplePrices(symbols: string[]): Promise<CryptoTickerData[]> {
    try {
      const requests = symbols.map(symbol => 
        this.getCurrentPrice(symbol)
      );
      
      return await Promise.all(requests);
    } catch (error) {
      this.logger.error(`Failed to fetch multiple prices: ${error.message}`);
      throw new Error(`Failed to fetch multiple cryptocurrency prices: ${error.message}`);
    }
  }
} 