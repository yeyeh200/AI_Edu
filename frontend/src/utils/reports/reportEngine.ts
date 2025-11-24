import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { LineChart, BarChart, PieChart } from '@/components/Charts';

// AutoTable types for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ReportData {
  id?: string;
  [key: string]: any;
}

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  config?: any;
}

interface ReportSection {
  id: string;
  type: 'header' | 'summary' | 'chart' | 'table' | 'text' | 'footer';
  title?: string;
  content?: React.ReactNode;
  data?: any;
  config?: any;
}

interface ReportGenerationOptions {
  format: 'pdf' | 'html' | 'excel' | 'json';
  template?: {
    layout: 'single-column' | 'two-column' | 'three-column';
    theme: 'default' | 'professional' | 'modern' | 'minimal';
    pageSize: 'A4' | 'A3' | 'Letter';
    orientation: 'portrait' | 'landscape';
    margins: { top: number; right: number; bottom: number; left: number };
  };
  filters?: Record<string, any>;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeTimestamp?: boolean;
  includePageNumbers?: boolean;
  watermark?: string;
  title?: string;
  subtitle?: string;
}

export class ReportEngine {
  private static defaultOptions: ReportGenerationOptions = {
    format: 'pdf',
    template: {
      layout: 'single-column',
      theme: 'professional',
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
    },
    includeTimestamp: true,
    includePageNumbers: true,
  };

  // Generate report from template and data
  static async generateReport(
    sections: ReportSection[],
    data: ReportData,
    options: Partial<ReportGenerationOptions> = {}
  ): Promise<Blob | string> {
    const opts = { ...this.defaultOptions, ...options };

    switch (opts.format) {
      case 'pdf':
        return this.generatePDFReport(sections, data, opts);
      case 'html':
        return this.generateHTMLReport(sections, data, opts);
      case 'excel':
        return this.generateExcelReport(sections, data, opts);
      case 'json':
        return this.generateJSONReport(sections, data, opts);
      default:
        throw new Error(`Unsupported format: ${opts.format}`);
    }
  }

  // Generate PDF report
  private static async generatePDFReport(
    sections: ReportSection[],
    data: ReportData,
    options: ReportGenerationOptions
  ): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: options.template?.orientation || 'portrait',
      unit: 'mm',
      format: options.template?.pageSize || 'a4',
    });

    const margins = options.template?.margins || { top: 20, right: 20, bottom: 20, left: 20 };
    let currentY = margins.top;

    // Add title
    if (options.title) {
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(options.title, margins.left, currentY);
      currentY += 10;

      if (options.subtitle) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.text(options.subtitle, margins.left, currentY);
        currentY += 8;
      }

      currentY += 5;
    }

    // Add timestamp
    if (options.includeTimestamp) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`生成时间: ${new Date().toLocaleString()}`, margins.left, currentY);
      currentY += 8;
    }

    // Process sections
    for (const section of sections.filter(s => s.visible !== false)) {
      if (currentY > pdf.internal.pageSize.height - margins.bottom - 50) {
        pdf.addPage();
        currentY = margins.top;
        this.addPageHeader(pdf, options);
      }

      currentY = await this.processPDFSection(pdf, section, data, {
        ...options,
        currentY,
        margins,
      });
    }

    // Add footer and page numbers
    if (options.includePageNumbers) {
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          `第 ${i} 页，共 ${totalPages} 页`,
          pdf.internal.pageSize.width - margins.right - 30,
          pdf.internal.pageSize.height - 10
        );
      }
    }

    // Add watermark if specified
    if (options.watermark) {
      this.addWatermark(pdf, options.watermark);
    }

    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  // Process individual section for PDF
  private static async processPDFSection(
    pdf: jsPDF,
    section: ReportSection,
    data: ReportData,
    options: any
  ): Promise<number> {
    const { currentY, margins } = options;
    let newY = currentY;

    // Add section title
    if (section.title) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.title, margins.left, newY);
      newY += 8;
    }

    switch (section.type) {
      case 'summary':
        newY = await this.processSummarySection(pdf, section, data, options);
        break;
      case 'chart':
        newY = await this.processChartSection(pdf, section, data, options);
        break;
      case 'table':
        newY = await this.processTableSection(pdf, section, data, options);
        break;
      case 'text':
        newY = await this.processTextSection(pdf, section, data, options);
        break;
      case 'header':
        // Header already processed
        break;
      case 'footer':
        newY = await this.processFooterSection(pdf, section, data, options);
        break;
    }

    return newY + 10; // Add spacing between sections
  }

  // Process summary section
  private static async processSummarySection(
    pdf: jsPDF,
    section: ReportSection,
    data: ReportData,
    options: any
  ): Promise<number> {
    const { currentY, margins } = options;
    const metrics = section.data?.metrics || [];

    // Create metrics grid
    const columns = 4;
    const columnWidth = (pdf.internal.pageSize.width - margins.left - margins.right) / columns;
    let y = currentY + 5;

    metrics.forEach((metric: any, index: number) => {
      const column = index % columns;
      const row = Math.floor(index / columns);

      if (column === 0 && row > 0) {
        y += 25; // Move to next row
      }

      const x = margins.left + (column * columnWidth) + 5;

      // Metric box
      pdf.setFillColor(245, 245, 245);
      pdf.rect(x - 3, y - 3, columnWidth - 10, 20, 'F');

      // Metric value
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(metric.value), x + 5, y + 5);

      // Metric label
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(metric.label, x + 5, y + 12);
    });

    return y + 30;
  }

  // Process chart section
  private static async processChartSection(
    pdf: jsPDF,
    section: ReportSection,
    data: ReportData,
    options: any
  ): Promise<number> {
    const { currentY, margins } = options;

    // Create a temporary DOM element for the chart
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '400px';
    chartContainer.style.height = '200px';
    chartContainer.style.position = 'absolute';
    chartContainer.style.left = '-9999px';

    document.body.appendChild(chartContainer);

    try {
      // Render chart based on type
      const chartData = section.data || data[section.config?.dataSource] || [];
      let chartElement: React.ReactElement;

      switch (section.config?.type) {
        case 'bar':
          chartElement = React.createElement(BarChart, {
            data: chartData,
            width: 400,
            height: 200,
          });
          break;
        case 'pie':
          chartElement = React.createElement(PieChart, {
            data: chartData,
            width: 400,
            height: 200,
          });
          break;
        default:
          chartElement = React.createElement(LineChart, {
            data: chartData,
            width: 400,
            height: 200,
          });
      }

      // In a real implementation, you would need to render the React component
      // For now, create a placeholder
      const placeholder = document.createElement('div');
      placeholder.innerHTML = `
        <div style="width: 400px; height: 200px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; background: #f9f9f9;">
          <div style="text-align: center;">
            <div style="font-size: 14px; color: #666;">图表区域</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">${section.config?.type || 'chart'}</div>
          </div>
        </div>
      `;

      chartContainer.appendChild(placeholder);

      // Convert to image
      const canvas = await html2canvas(chartContainer);
      const imgData = canvas.toDataURL('image/png');

      // Add to PDF
      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margins.left, currentY + 5, imgWidth, imgHeight);

    } finally {
      // Clean up
      document.body.removeChild(chartContainer);
    }

    return currentY + 110;
  }

  // Process table section
  private static async processTableSection(
    pdf: jsPDF,
    section: ReportSection,
    data: ReportData,
    options: any
  ): Promise<number> {
    const { currentY, margins } = options;
    const tableData = section.data || data[section.config?.dataSource] || [];

    if (!tableData.length) return currentY;

    // Prepare headers and rows
    const headers = Object.keys(tableData[0]);
    const rows = tableData.map((item: any) => headers.map(header => String(item[header] || '')));

    // Add table using autoTable
    (pdf as any).autoTable({
      head: [headers],
      body: rows,
      startY: currentY + 5,
      margin: { left: margins.left, right: margins.right },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    return (pdf as any).lastAutoTable.finalY + 10;
  }

  // Process text section
  private static async processTextSection(
    pdf: jsPDF,
    section: ReportSection,
    data: ReportData,
    options: any
  ): Promise<number> {
    const { currentY, margins } = options;
    const content = section.content || section.config?.content || '';

    if (!content) return currentY;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    // Simple text wrapping
    const lines = pdf.splitTextToSize(content, pdf.internal.pageSize.width - margins.left - margins.right);
    let y = currentY + 5;

    lines.forEach((line: string) => {
      if (y > pdf.internal.pageSize.height - options.margins.bottom - 10) {
        pdf.addPage();
        y = options.margins.top;
      }
      pdf.text(line, margins.left, y);
      y += 6;
    });

    return y + 10;
  }

  // Process footer section
  private static async processFooterSection(
    pdf: jsPDF,
    section: ReportSection,
    data: ReportData,
    options: any
  ): Promise<number> {
    const { margins } = options;
    const pageHeight = pdf.internal.pageSize.height;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('© 2024 AI教学评价系统', margins.left, pageHeight - 15);

    return pageHeight - 20;
  }

  // Generate HTML report
  private static async generateHTMLReport(
    sections: ReportSection[],
    data: ReportData,
    options: ReportGenerationOptions
  ): Promise<string> {
    const { template } = options;
    const theme = this.getThemeStyles(template?.theme || 'professional');

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${options.title || 'Report'}</title>
        <style>
          ${theme}
          body { font-family: Arial, sans-serif; margin: 20px; }
          .section { margin-bottom: 30px; }
          .chart-container { width: 100%; height: 400px; }
        </style>
      </head>
      <body>
    `;

    // Add header
    if (options.title) {
      html += `
        <header class="report-header">
          <h1>${options.title}</h1>
          ${options.subtitle ? `<h2>${options.subtitle}</h2>` : ''}
          ${options.includeTimestamp ? `<p>生成时间: ${new Date().toLocaleString()}</p>` : ''}
        </header>
      `;
    }

    // Process sections
    for (const section of sections.filter(s => s.visible !== false)) {
      html += `<section class="section" data-type="${section.type}">`;

      if (section.title) {
        html += `<h3>${section.title}</h3>`;
      }

      switch (section.type) {
        case 'summary':
          html += this.generateSummaryHTML(section, data);
          break;
        case 'chart':
          html += this.generateChartHTML(section, data);
          break;
        case 'table':
          html += this.generateTableHTML(section, data);
          break;
        case 'text':
          html += `<div class="text-content">${section.content || section.config?.content || ''}</div>`;
          break;
      }

      html += `</section>`;
    }

    html += `
      </body>
      </html>
    `;

    return html;
  }

  // Generate Excel report (simplified - using CSV format)
  private static async generateExcelReport(
    sections: ReportSection[],
    data: ReportData,
    options: ReportGenerationOptions
  ): Promise<Blob> {
    let csvContent = '';

    // Add title
    if (options.title) {
      csvContent += `${options.title}\n\n`;
    }

    // Process sections and extract table data
    for (const section of sections.filter(s => s.visible !== false)) {
      if (section.type === 'table') {
        const tableData = section.data || data[section.config?.dataSource] || [];
        if (tableData.length > 0) {
          if (section.title) {
            csvContent += `${section.title}\n`;
          }

          const headers = Object.keys(tableData[0]);
          csvContent += headers.join(',') + '\n';

          tableData.forEach((row: any) => {
            csvContent += headers.map(header => {
              const value = row[header];
              return typeof value === 'string' && value.includes(',')
                ? `"${value}"`
                : String(value || '');
            }).join(',') + '\n';
          });

          csvContent += '\n';
        }
      }
    }

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  // Generate JSON report
  private static async generateJSONReport(
    sections: ReportSection[],
    data: ReportData,
    options: ReportGenerationOptions
  ): Promise<string> {
    const reportData = {
      metadata: {
        title: options.title,
        subtitle: options.subtitle,
        generatedAt: new Date().toISOString(),
        template: options.template,
      },
      sections: sections.map(section => ({
        ...section,
        data: section.data || data[section.config?.dataSource] || null,
      })),
    };

    return JSON.stringify(reportData, null, 2);
  }

  // Helper methods
  private static getThemeStyles(theme: string): string {
    const themes = {
      professional: `
        .report-header { border-bottom: 2px solid #1e40af; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { color: #1e40af; font-size: 28px; margin: 0; }
        h2 { color: #64748b; font-size: 18px; margin: 5px 0; }
        h3 { color: #1e293b; font-size: 20px; margin-bottom: 15px; }
      `,
      modern: `
        .report-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
        h1 { font-size: 32px; margin: 0; }
        h2 { font-size: 16px; opacity: 0.9; margin: 5px 0; }
        h3 { color: #1a202c; font-size: 22px; margin-bottom: 20px; }
      `,
      minimal: `
        .report-header { border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; }
        h1 { color: #2d3748; font-size: 24px; font-weight: 300; margin: 0; }
        h2 { color: #718096; font-size: 14px; margin: 5px 0; }
        h3 { color: #2d3748; font-size: 18px; margin-bottom: 12px; }
      `,
      default: `
        .report-header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { color: #3b82f6; font-size: 26px; margin: 0; }
        h2 { color: #6b7280; font-size: 16px; margin: 5px 0; }
        h3 { color: #1f2937; font-size: 20px; margin-bottom: 15px; }
      `,
    };

    return themes[theme as keyof typeof themes] || themes.default;
  }

  private static addPageHeader(pdf: jsPDF, options: ReportGenerationOptions): void {
    const margins = options.template?.margins || { top: 20, right: 20, bottom: 20, left: 20 };

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(options.title || 'Report', margins.left, margins.top);

    if (options.subtitle) {
      pdf.setFontSize(10);
      pdf.text(options.subtitle, margins.left, margins.top + 8);
    }
  }

  private static addWatermark(pdf: jsPDF, text: string): void {
    const pageCount = pdf.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(60);
      pdf.setTextColor(200, 200, 200);
      pdf.text(text, pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height / 2, {
        align: 'center',
        angle: 45,
      });
    }
  }

  private static generateSummaryHTML(section: ReportSection, data: ReportData): string {
    const metrics = section.data?.metrics || [];

    return `
      <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        ${metrics.map((metric: any) => `
          <div class="metric-card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; background: #f8fafc;">
            <div class="metric-value" style="font-size: 24px; font-weight: bold; color: #2d3748;">${metric.value}</div>
            <div class="metric-label" style="font-size: 14px; color: #6b7280; margin-top: 5px;">${metric.label}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private static generateChartHTML(section: ReportSection, data: ReportData): string {
    const chartData = section.data || data[section.config?.dataSource] || [];

    return `
      <div class="chart-container">
        <p style="text-align: center; padding: 50px; color: #6b7280;">
          图表区域 (${section.config?.type || 'chart'})
        </p>
      </div>
    `;
  }

  private static generateTableHTML(section: ReportSection, data: ReportData): string {
    const tableData = section.data || data[section.config?.dataSource] || [];

    if (!tableData.length) {
      return '<p>暂无数据</p>';
    }

    const headers = Object.keys(tableData[0]);

    return `
      <table class="data-table" style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background: #f1f5f9;">
            ${headers.map(header => `<th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0;">${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableData.map((row: any) => `
            <tr>
              ${headers.map(header => `<td style="padding: 12px; border: 1px solid #e2e8f0;">${row[header] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Batch report generation
  static async generateBatchReports(
    reports: Array<{
      sections: ReportSection[];
      data: ReportData;
      options?: Partial<ReportGenerationOptions>;
    }>
  ): Promise<Blob[]> {
    const promises = reports.map(report =>
      this.generateReport(report.sections, report.data, report.options)
    );

    return Promise.all(promises);
  }

  // Schedule report generation (template method - would need backend support)
  static async scheduleReport(
    templateId: string,
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly';
      time: string;
      recipients: string[];
      options?: Partial<ReportGenerationOptions>;
    }
  ): Promise<string> {
    // This would typically make an API call to schedule the report on the server
    const scheduleData = {
      templateId,
      schedule,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch('/api/reports/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error('Failed to schedule report');
    }

    return response.json();
  }
}

export default ReportEngine;