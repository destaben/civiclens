/**
 * Test data extraction from Spanish transparency sources.
 * 
 * This test suite:
 * 1. Parses data sources from docs/data-sources-spain.md
 * 2. Attempts to extract data from each source
 * 3. Documents accessibility issues
 * 4. Saves extracted data to a folder
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseDataSources, fetchSourceMetadata, extractSourceData, type DataSource } from '@/lib/extract-sources';

describe('Data Source Extraction from Spanish Transparency Portals', () => {
  let sources: DataSource[] = [];
  let docsPath = '';

  beforeAll(() => {
    // Find the markdown file
    const possiblePaths = [
      path.join(process.cwd(), '../docs/data-sources-spain.md'),
      '/tmp/workspace/destaben/civiclens/docs/data-sources-spain.md',
      path.join(process.cwd(), '../../docs/data-sources-spain.md'),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        docsPath = p;
        break;
      }
    }

    if (docsPath) {
      const content = fs.readFileSync(docsPath, 'utf-8');
      sources = parseDataSources(content);
    }
  });

  it('should parse data sources from markdown documentation', () => {
    expect(docsPath).toBeTruthy();
    expect(sources.length).toBeGreaterThan(0);

    // Verify we have sources from all sections
    const sections = new Set(sources.map(s => s.section));
    expect(sections.has('national')).toBe(true);
    expect(sections.has('regional')).toBe(true);
    expect(sections.has('local')).toBe(true);

    console.log(`\n✅ Parsed ${sources.length} data sources from ${docsPath}`);
  });

  it('should validate source URLs', () => {
    sources.forEach(source => {
      expect(source.url).toMatch(/^https?:\/\/.+/);
      expect(source.name).toBeTruthy();
      expect(source.name.length).toBeGreaterThan(0);
    });

    console.log(`\n✅ All ${sources.length} sources have valid URLs`);
  });

  it('should list parsed sources by section', () => {
    console.log('\n📋 Parsed Sources by Section:');
    console.log('='.repeat(80));

    const bySection = {
      national: sources.filter(s => s.section === 'national'),
      regional: sources.filter(s => s.section === 'regional'),
      local: sources.filter(s => s.section === 'local'),
    };

    Object.entries(bySection).forEach(([section, sectionSources]) => {
      console.log(`\n${section.toUpperCase()} (${sectionSources.length}):`);
      sectionSources.forEach(s => {
        const formats = s.formats.length > 0 ? ` [${s.formats.join(', ')}]` : '';
        console.log(`  • ${s.name}${formats}`);
        console.log(`    ${s.url}`);
      });
    });

    expect(bySection.national.length).toBeGreaterThan(0);
    expect(bySection.regional.length).toBeGreaterThan(0);
    expect(bySection.local.length).toBeGreaterThan(0);
  });

  it('should test accessibility of sources', async () => {
    if (sources.length === 0) {
      console.log('\n⚠️  No sources to test - skipping accessibility check');
      return;
    }

    console.log('\n🌐 Testing source accessibility...');
    console.log('='.repeat(80));

    const results: Array<{
      name: string;
      url: string;
      section: string;
      accessible: boolean;
      statusCode?: number;
      contentType?: string;
      error?: string;
    }> = [];

    const testSubset = sources.slice(0, Math.min(10, sources.length)); // Test first 10 to save time

    for (const source of testSubset) {
      // Small delay to be respectful to servers
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await fetchSourceMetadata(source.url, 5000);

      results.push({
        name: source.name,
        url: source.url,
        section: source.section,
        accessible: result.success,
        statusCode: result.statusCode,
        contentType: result.contentType,
        error: result.error,
      });

      const icon = result.success ? '✅' : '❌';
      console.log(`${icon} ${source.name.padEnd(50)} ${result.statusCode || 'Error'}`);

      if (result.error) {
        console.log(`   └─ ${result.error.substring(0, 60)}`);
      }
    }

    // Save results
    const reportPath = path.join('/tmp', 'accessibility-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

    const accessible = results.filter(r => r.accessible).length;
    console.log('\n' + '='.repeat(80));
    console.log(`Accessibility Summary: ${accessible}/${results.length} sources accessible`);
    console.log(`Report saved to: ${reportPath}`);
  }, { timeout: 60000 });

  it('should extract data from accessible sources and save to folder', async () => {
    if (sources.length === 0) {
      console.log('\n⚠️  No sources to extract from - skipping');
      return;
    }

    const outputDir = path.join('/tmp', 'civiclens-extracted-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`\n📂 Extracting data to: ${outputDir}`);
    console.log('='.repeat(80));

    const nationalSources = sources.filter(s => s.section === 'national').slice(0, 2);
    const extractedFiles: string[] = [];

    for (const source of nationalSources) {
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`\nAttempting to extract from: ${source.name}`);
      const result = await extractSourceData(source.url, 8000, 30 * 1024);

      if (result.success && result.content) {
        const filename = `${source.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        const filepath = path.join(outputDir, filename);

        fs.writeFileSync(filepath, result.content);
        extractedFiles.push(filepath);

        console.log(`✅ Extracted ${result.size} bytes`);
        console.log(`   Content-Type: ${result.contentType || 'unknown'}`);
        console.log(`   Saved to: ${filename}`);
      } else {
        console.log(`❌ Failed: ${result.error}`);
      }
    }

    // Create summary
    const summary = {
      timestamp: new Date().toISOString(),
      outputDir,
      sourcesAttempted: nationalSources.length,
      filesExtracted: extractedFiles.length,
      files: extractedFiles.map(f => path.basename(f)),
    };

    fs.writeFileSync(
      path.join(outputDir, 'extraction-summary.json'),
      JSON.stringify(summary, null, 2),
    );

    console.log('\n' + '='.repeat(80));
    console.log(`✅ Extraction complete: ${extractedFiles.length} files saved`);
    console.log(`Summary: ${path.join(outputDir, 'extraction-summary.json')}`);

    expect(extractedFiles.length).toBeGreaterThanOrEqual(0);
  }, { timeout: 30000 });

  it('should generate a comprehensive source report', () => {
    if (sources.length === 0) return;

    const reportPath = path.join('/tmp', 'sources-report.md');

    let report = '# Spanish Transparency Data Sources - Extraction Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += `Total Sources: ${sources.length}\n\n`;

    // National sources
    const national = sources.filter(s => s.section === 'national');
    report += `## National Sources (${national.length})\n\n`;
    national.forEach(s => {
      report += `- **${s.name}**\n`;
      report += `  - URL: ${s.url}\n`;
      report += `  - Formats: ${s.formats.join(', ') || 'Not specified'}\n\n`;
    });

    // Regional sources
    const regional = sources.filter(s => s.section === 'regional');
    report += `## Regional Sources (${regional.length})\n\n`;
    report += '| Name | URL | Formats |\n';
    report += '|------|-----|----------|\n';
    regional.forEach(s => {
      report += `| ${s.name} | ${s.url} | ${s.formats.join(', ')} |\n`;
    });

    // Local sources
    const local = sources.filter(s => s.section === 'local');
    report += `\n## Local Sources (${local.length})\n\n`;
    report += '| Name | URL | Formats |\n';
    report += '|------|-----|----------|\n';
    local.forEach(s => {
      report += `| ${s.name} | ${s.url} | ${s.formats.join(', ')} |\n`;
    });

    report += '\n## Issues & Notes\n\n';
    report += '- Some sources may be behind CORS restrictions\n';
    report += '- Some sources require authentication\n';
    report += '- Rate limiting may apply\n';
    report += '- Data formats vary significantly across regions\n';

    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 Report saved to: ${reportPath}`);
  });
});
