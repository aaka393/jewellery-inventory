import BaseService from './baseService';
import { ApiResponse } from '../types/api';

interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class SEOService extends BaseService {
  async generateSitemap(): Promise<ApiResponse<SitemapEntry[]>> {
    return this.get<SitemapEntry[]>('/sitemap.xml');
  }

  async getRobotsConfig(): Promise<ApiResponse<string>> {
    return this.get<string>('/robots.txt');
  }

  async getMetaTags(path: string): Promise<ApiResponse<MetaTag[]>> {
    return this.get<MetaTag[]>(`/seo/meta-tags?path=${encodeURIComponent(path)}`);
  }

  async getStructuredData(type: string, id?: string): Promise<ApiResponse<StructuredData>> {
    const endpoint = id ? `/seo/structured-data/${type}/${id}` : `/seo/structured-data/${type}`;
    return this.get<StructuredData>(endpoint);
  }

  async updateMetaTags(path: string, metaTags: MetaTag[]): Promise<ApiResponse<void>> {
    return this.put<void>('/seo/meta-tags', { path, metaTags }, true);
  }

  async createRedirect(from: string, to: string, permanent: boolean = true): Promise<ApiResponse<void>> {
    return this.post<void>('/seo/redirects', { from, to, permanent }, true);
  }

  async getRedirects(): Promise<ApiResponse<{ from: string; to: string; permanent: boolean }[]>> {
    return this.get<{ from: string; to: string; permanent: boolean }[]>('/seo/redirects');
  }
}

export const seoService = new SEOService();