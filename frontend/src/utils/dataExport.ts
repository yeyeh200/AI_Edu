import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// AutoTable types for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  includeTimestamp?: boolean;
  includeHeaders?: boolean;
  dateFormat?: string;
  numberFormat?: Intl.NumberFormatOptions;
}

interface ColumnConfig {
  key: string;
  title: string;
  width?: number;
  format?: (value: any) => string;
  exportHidden?: boolean;
}

interface ShareConfig {
  title: string;
  description?: string;
  expiryDays?: number;
  allowDownload?: boolean;
  password?: string;
}

export class DataExporter {
  private static defaultOptions: ExportOptions = {
    includeTimestamp: true,
    includeHeaders: true,
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    numberFormat: { maximumFractionDigits: 2 },
  };

  // CSV Export
  static async exportToCSV<T extends Record<string, any>>(
    data: T[],
    columns?: ColumnConfig[],
    options: ExportOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };
    const filename = opts.filename || `export-${Date.now()}.csv`;

    const headers = columns ? columns.map(col => col.title) : Object.keys(data[0] || {});
    const rows = data.map(item => {
      if (columns) {
        return columns.map(col => {
          const value = item[col.key];
          return col.format ? col.format(value) : this.formatValue(value, opts);
        });
      }
      return Object.values(item).map(value => this.formatValue(value, opts));
    });

    const csvContent = [
      opts.includeHeaders ? headers.join(',') : '',
      ...rows.map(row => row.join(','))
    ].filter(line => line).join('\n');

    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  }

  // Excel Export (using CSV format for simplicity - in production, use xlsx library)
  static async exportToExcel<T extends Record<string, any>>(
    data: T[],
    columns?: ColumnConfig[],
    options: ExportOptions = {}
  ): Promise<void> {
    // For now, export as CSV with .xlsx extension
    // In production, integrate with libraries like xlsx or exceljs
    const filename = options.filename || `export-${Date.now()}.xlsx`;
    await this.exportToCSV(data, columns, { ...options, filename });
  }

  // JSON Export
  static async exportToJSON<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };
    const filename = opts.filename || `export-${Date.now()}.json`;

    const exportData = {
      metadata: {
        title: opts.title,
        subtitle: opts.subtitle,
        exportedAt: new Date().toISOString(),
        recordCount: data.length,
      },
      data,
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
  }

  // PDF Export
  static async exportToPDF<T extends Record<string, any>>(
    data: T[],
    columns?: ColumnConfig[],
    options: ExportOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };
    const filename = opts.filename || `export-${Date.now()}.pdf`;

    const pdf = new jsPDF();

    // Add title
    if (opts.title) {
      pdf.setFontSize(16);
      pdf.text(opts.title, 14, 15);
    }

    // Add subtitle
    if (opts.subtitle) {
      pdf.setFontSize(12);
      pdf.text(opts.subtitle, 14, 25);
    }

    // Add timestamp
    if (opts.includeTimestamp) {
      pdf.setFontSize(10);
      pdf.text(`导出时间: ${new Date().toLocaleString()}`, 14, 35);
    }

    // Prepare table data
    const headers = columns ? columns.map(col => col.title) : Object.keys(data[0] || {});
    const rows = data.map(item => {
      if (columns) {
        return columns.map(col => {
          const value = item[col.key];
          return col.format ? col.format(value) : this.formatValue(value, opts);
        });
      }
      return Object.values(item).map(value => this.formatValue(value, opts));
    });

    // Add table
    (pdf as any).autoTable({
      head: opts.includeHeaders ? [headers] : [],
      body: rows,
      startY: opts.title ? 45 : 20,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Save PDF
    pdf.save(filename);
  }

  // Image Export (from DOM element)
  static async exportToPNG(
    elementId: string,
    options: ExportOptions = {}
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const opts = { ...this.defaultOptions, ...options };
    const filename = opts.filename || `export-${Date.now()}.png`;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
      throw new Error('导出图片失败');
    }
  }

  // Print functionality
  static async printData<T extends Record<string, any>>(
    data: T[],
    columns?: ColumnConfig[],
    options: ExportOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };

    // Create print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('无法打开打印窗口');
    }

    // Generate HTML content
    const headers = columns ? columns.map(col => col.title) : Object.keys(data[0] || {});
    const rows = data.map(item => {
      if (columns) {
        return columns.map(col => {
          const value = item[col.key];
          return col.format ? col.format(value) : this.formatValue(value, opts);
        });
      }
      return Object.values(item).map(value => this.formatValue(value, opts));
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${opts.title || '数据打印'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          h2 { color: #666; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .timestamp { color: #666; font-size: 14px; margin-top: 10px; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${opts.title ? `<h1>${opts.title}</h1>` : ''}
        ${opts.subtitle ? `<h2>${opts.subtitle}</h2>` : ''}
        ${opts.includeTimestamp ? `<div class="timestamp">导出时间: ${new Date().toLocaleString()}</div>` : ''}
        <table>
          ${opts.includeHeaders ? `
            <thead>
              <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
            </thead>
          ` : ''}
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        <div class="no-print">
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            打印
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
  }

  // Generate shareable link
  static async generateShareLink<T extends Record<string, any>>(
    data: T[],
    config: ShareConfig,
    options: ExportOptions = {}
  ): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };

    const shareData = {
      title: config.title,
      description: config.description,
      data: data.slice(0, 1000), // Limit shared data size
      config: {
        includeHeaders: opts.includeHeaders,
        columns: options,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        expiresAt: config.expiryDays ? new Date(Date.now() + config.expiryDays * 24 * 60 * 60 * 1000).toISOString() : null,
        allowDownload: config.allowDownload ?? true,
      },
      // Add checksum for data integrity
      checksum: this.generateChecksum(data),
    };

    // Encrypt data if password is provided
    if (config.password) {
      shareData.data = await this.encryptData(JSON.stringify(shareData.data), config.password);
    }

    // Encode data for URL
    const encodedData = encodeURIComponent(JSON.stringify(shareData));
    const shareUrl = `${window.location.origin}/shared-data?data=${encodedData}`;

    // In production, this would be stored on the server
    // For now, return a client-side shareable URL
    return shareUrl;
  }

  // Send data via email
  static async sendViaEmail<T extends Record<string, any>>(
    data: T[],
    email: string,
    subject: string,
    options: ExportOptions = {}
  ): Promise<void> {
    const opts = { ...this.defaultOptions, ...options };

    // Create CSV content for email attachment
    const filename = opts.filename || `data-${Date.now()}.csv`;
    const headers = Object.keys(data[0] || {});
    const rows = data.map(item => Object.values(item).map(value => this.formatValue(value, opts)));
    const csvContent = [
      opts.includeHeaders ? headers.join(',') : '',
      ...rows.map(row => row.join(','))
    ].filter(line => line).join('\n');

    // In production, this would call an email service API
    // For now, create mailto link
    const subjectEncoded = encodeURIComponent(subject);
    const bodyEncoded = encodeURIComponent(`请查收附件中的数据文件。\n\n导出时间: ${new Date().toLocaleString()}`);

    // Note: Email attachments can't be included in mailto links
    // This would require a backend service
    window.open(`mailto:${email}?subject=${subjectEncoded}&body=${bodyEncoded}`);

    // For demonstration, show alert
    alert(`邮件客户端已打开。在实际应用中，附件 ${filename} 将通过服务器发送。`);
  }

  // Helper methods
  private static formatValue(value: any, options: ExportOptions): string {
    if (value === null || value === undefined) return '';

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    if (typeof value === 'number' && options.numberFormat) {
      return value.toLocaleString('zh-CN', options.numberFormat);
    }

    return String(value);
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static generateChecksum(data: any[]): string {
    // Simple checksum implementation
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private static async encryptData(data: string, password: string): Promise<string> {
    // Simple encryption for demonstration
    // In production, use proper encryption libraries like crypto-js
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ password.charCodeAt(i % password.length));
    }
    return btoa(encrypted); // Base64 encode
  }

  // Utility function to prepare data for export
  static prepareDataForExport<T extends Record<string, any>>(
    data: T[],
    columns: ColumnConfig[]
  ): T[] {
    return data.map(item => {
      const filtered: any = {};
      columns.forEach(col => {
        if (!col.exportHidden) {
          filtered[col.key] = item[col.key];
        }
      });
      return filtered;
    });
  }

  // Validate export data
  static validateExportData(data: any[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('数据必须是数组格式');
      return { isValid: false, errors };
    }

    if (data.length === 0) {
      errors.push('数据数组为空');
      return { isValid: false, errors };
    }

    // Check for circular references
    try {
      JSON.stringify(data);
    } catch (error) {
      errors.push('数据包含循环引用，无法序列化');
    }

    return { isValid: errors.length === 0, errors };
  }
}

export default DataExporter;