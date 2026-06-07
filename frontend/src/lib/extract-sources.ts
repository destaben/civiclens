/**
 * Utility to extract and parse data sources from docs/data-sources-spain.md
 */

export interface DataSource {
  name: string;
  url: string;
  formats: string[];
  section: 'national' | 'regional' | 'local';
}

/**
 * Parse the markdown content and extract data sources.
 * Looks for URLs in markdown tables and extracts source information.
 */
export function parseDataSources(markdownContent: string): DataSource[] {
  const sources: DataSource[] = [];
  let currentSection: 'national' | 'regional' | 'local' = 'national';
  let lastSubsection = '';

  const lines = markdownContent.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section headers - look for ## 1., ## 2., ## 3.
    if (line.startsWith('## 1.')) {
      currentSection = 'national';
    } else if (line.startsWith('## 2.')) {
      currentSection = 'regional';
    } else if (line.startsWith('## 3.')) {
      currentSection = 'local';
    } else if (line.startsWith('## 4.') || line.startsWith('## 5.') || line.startsWith('## 6.') || line.startsWith('## 7.')) {
      // We've moved past data sources
      break;
    }

    // Track subsections (### headers)
    if (line.startsWith('### ')) {
      lastSubsection = line.replace(/^###\s+/, '').trim();
    }

    // Look for URLs in table rows (but not in markdown header rows)
    if (line.includes('|') && line.includes('http') && !line.includes('---')) {
      const urlMatches = line.match(/https?:\/\/[^\s|`]+/g);
      if (!urlMatches) continue;

      // Extract format types mentioned in this line
      const formatMatches = line.match(/(?:Atom\/XML|CSV|JSON|XLSX|CKAN|XML|RDF|API|Socrata|OCDS)/gi);
      const formats = formatMatches ? [...new Set(formatMatches)] : [];

      // Parse the row cells
      const cells = line.split('|').map(c => c.trim()).filter(c => c && !c.includes('---'));

      // Find the name - usually the first non-URL cell that isn't **URL** or **API**
      let name = '';
      for (const cell of cells) {
        const cleaned = cell.replace(/^\*+/, '').replace(/\*+$/, '').trim();
        if (
          !cleaned.startsWith('http') &&
          cleaned.length > 2 &&
          !['URL', 'API', 'Source', 'Attribute', 'Detail', 'Formats', 'Operator', 'Coverage', 'Data types', 'Update frequency', 'Historical depth', 'Licence'].includes(cleaned)
        ) {
          name = cleaned;
          break;
        }
      }

      // If we still don't have a name, use the subsection
      if (!name) {
        name = lastSubsection;
      }

      // Only add if we have a proper name
      if (name && name.length > 2) {
        sources.push({
          name,
          url: urlMatches[0],
          formats,
          section: currentSection,
        });
      }
    }
  }

  return sources;
}

/**
 * Fetch a URL with a timeout and return response metadata
 */
export async function fetchSourceMetadata(
  url: string,
  timeout: number = 5000,
): Promise<{
  success: boolean;
  statusCode?: number;
  contentType?: string;
  size?: number;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeoutHandle);

      return {
        success: response.ok,
        statusCode: response.status,
        contentType: response.headers.get('content-type') || undefined,
        size: parseInt(response.headers.get('content-length') || '0') || undefined,
      };
    } catch (e) {
      clearTimeout(timeoutHandle);
      throw e;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Fetch and extract content from a source URL
 */
export async function extractSourceData(
  url: string,
  timeout: number = 10000,
  maxSize: number = 1024 * 50, // 50KB
): Promise<{
  success: boolean;
  content?: string;
  contentType?: string;
  size?: number;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });

      clearTimeout(timeoutHandle);

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const contentType = response.headers.get('content-type') || undefined;
      const text = await response.text();

      if (text.length > maxSize) {
        return {
          success: true,
          content: text.substring(0, maxSize),
          contentType,
          size: text.length,
          error: `Truncated to ${maxSize} bytes`,
        };
      }

      return {
        success: true,
        content: text,
        contentType,
        size: text.length,
      };
    } catch (e) {
      clearTimeout(timeoutHandle);
      throw e;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
