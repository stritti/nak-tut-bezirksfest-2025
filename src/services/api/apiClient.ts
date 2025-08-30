import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

/**
 * Konfiguration für den API-Client
 */
export interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number;
}

/**
 * Basis-API-Client für HTTP-Anfragen an die NocoDB-API
 */
export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'xc-auth': config.apiKey
      }
    });
  }

  /**
   * GET-Anfrage an die API
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * POST-Anfrage an die API
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * PUT-Anfrage an die API
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * DELETE-Anfrage an die API
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Fehlerbehandlung für API-Anfragen
   */
  private handleError(error: any): void {
    if (error.response) {
      // Der Server hat mit einem Statuscode außerhalb des 2xx-Bereichs geantwortet
      console.error('API-Fehler:', error.response.status, error.response.data);
    } else if (error.request) {
      // Die Anfrage wurde gestellt, aber keine Antwort erhalten
      console.error('Keine Antwort vom Server:', error.request);
    } else {
      // Etwas ist bei der Anfrageerstellung schiefgegangen
      console.error('Anfragefehler:', error.message);
    }
  }
}

export default ApiClient;
