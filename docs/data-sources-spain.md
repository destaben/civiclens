# Spanish Transparency Data Sources

This document catalogues the public data sources available for CivicLens across Spain's three levels of government — national (Estado / Ministerios), regional (Comunidades Autónomas), and local (Localidades) — and summarises the legal framework that governs their access and reuse.

---

## Table of Contents

1. [National Sources — Estado / Ministerios](#1-national-sources--estado--ministerios)
2. [Regional Sources — Comunidades Autónomas](#2-regional-sources--comunidades-autónomas)
3. [Local Sources — Localidades](#3-local-sources--localidades)
4. [Legal Framework](#4-legal-framework)
5. [Open Data Licences](#5-open-data-licences)
6. [Data Privacy Considerations](#6-data-privacy-considerations)
7. [Integration Notes for CivicLens](#7-integration-notes-for-civiclens)

---

## 1. National Sources — Estado / Ministerios

### 1.1 Plataforma de Contratación del Sector Público (PLACSP)

| Attribute | Detail |
|-----------|--------|
| **URL** | https://contrataciondelestado.es |
| **Operator** | Ministerio de Hacienda |
| **Coverage** | All contracting authorities that are legally required to publish; voluntary for sub-state bodies |
| **Data types** | Tender notices, award notices, contract modifications, cancellations, framework agreements |
| **Formats** | Atom/XML feeds (eSPD, CODICE 2.x), bulk CSV/XLSX downloads, REST API (beta) |
| **Update frequency** | Near real-time (Atom feeds updated within minutes of publication) |
| **Historical depth** | Full archive from 2012 onwards; older records available in XML dumps |
| **Licence** | Licencia de uso abierto — reutilización sin restricciones (see §5) |

PLACSP is the authoritative national procurement register and the primary CivicLens data source. Key Atom feed endpoints:

```
# All published procurement documents (paginated)
https://contrataciondelestado.es/sindicacion/sindicacion_1044/licitacionesPerfilesContratanteCompleto3.atom

# Award notices only
https://contrataciondelestado.es/sindicacion/sindicacion_1045/contratosSuministros3.atom
```

Bulk XML dumps are updated weekly and downloadable from:
`https://contrataciondelestado.es/wps/portal/plataforma/datosPropios`

### 1.2 Portal de la Transparencia

| Attribute | Detail |
|-----------|--------|
| **URL** | https://transparencia.gob.es |
| **Operator** | Ministerio de la Presidencia, Relaciones con las Cortes y Memoria Democrática |
| **Coverage** | All bodies of the Administración General del Estado (AGE) |
| **Data types** | Contracts >18 000 € (minor) / >20 000 € (major), grants, subsidies, budgets, real-estate inventory, remuneration |
| **Formats** | CSV, XLSX, JSON (via API), RDF |
| **Update frequency** | Quarterly for most datasets; real-time for some indicators |
| **Licence** | Licencia de uso abierto |

API base URL: `https://transparencia.gob.es/servicios-buscador/api/`

### 1.3 datos.gob.es — National Open Data Portal

| Attribute | Detail |
|-----------|--------|
| **URL** | https://datos.gob.es |
| **Operator** | Ministerio de Asuntos Económicos y Transformación Digital |
| **Coverage** | Aggregates datasets from all administrative levels (nacional, autonómico, local) |
| **Data types** | Metadata catalogue; links to procurement, budget, subsidy and infrastructure datasets |
| **Formats** | DCAT-AP metadata; underlying datasets in CSV, JSON, XML, RDF |
| **API** | CKAN-compatible API: `https://datos.gob.es/apidata/` |
| **Licence** | Varies per dataset; most public-sector data is Licencia de uso abierto |

datos.gob.es is the best starting point for **discovering** datasets across all government levels.

### 1.4 Intervención General de la Administración del Estado (IGAE)

| Attribute | Detail |
|-----------|--------|
| **URL** | https://www.igae.pap.hacienda.gob.es |
| **Coverage** | Central government budget execution, grants, public debt |
| **Data types** | Expenditure by programme and economic classification, subsidy beneficiaries |
| **Formats** | CSV, XLSX; some via datos.gob.es |
| **Licence** | Licencia de uso abierto |

Relevant for correlating procurement spending against budget execution data.

### 1.5 Registro de Contratos del Sector Público (RCSP)

The RCSP (managed by the Junta Consultiva de Contratación Pública del Estado under LCSP Arts. 346–347) registers contracts awarded by all public entities. Data is published on PLACSP and the Portal de la Transparencia. Entities must notify the RCSP within 30 days of formalising a contract.

---

## 2. Regional Sources — Comunidades Autónomas

Each autonomous community operates its own transparency portal and/or procurement platform. Many also federate data into PLACSP. Below are the primary portals for each community.

### 2.1 Andalucía

| Source | URL | Formats |
|--------|-----|---------|
| Plataforma de Contratación (PSCP-Andalucía) | https://contratacion.andalucia.gov.es | Atom/XML, CSV |
| Portal de la Transparencia de Andalucía | https://www.juntadeandalucia.es/transparencia | CSV, XLSX |
| Open Data Junta de Andalucía | https://www.juntadeandalucia.es/datosabiertos | CKAN API |

### 2.2 Aragón

| Source | URL | Formats |
|--------|-----|---------|
| Contratación Pública Aragón | https://contratacionpublica.aragon.es | Atom/XML |
| Open Data Aragón | https://opendata.aragon.es | CKAN API, CSV, JSON |
| Portal de Transparencia Aragón | https://www.transparencia.aragon.es | CSV |

### 2.3 Asturias (Principado)

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación del Principado | https://sede.asturias.es/contratacion | XML |
| Portal de Transparencia Asturias | https://transparencia.asturias.es | CSV |

### 2.4 Canarias

| Source | URL | Formats |
|--------|-----|---------|
| Plataforma de Contratación Canarias | https://www.gobiernodecanarias.org/contratacion | Atom/XML |
| Datos Abiertos Canarias | https://datos.canarias.es | CKAN API |

### 2.5 Cantabria

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación Cantabria | https://contratacion.cantabria.es | XML |
| Portal de Transparencia Cantabria | https://transparencia.cantabria.es | CSV |

### 2.6 Castilla-La Mancha

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación CLM | https://www.castillalamancha.es/gobierno/contratacion | Atom/XML |
| Portal de Transparencia CLM | https://transparencia.castillalamancha.es | CSV |

### 2.7 Castilla y León

| Source | URL | Formats |
|--------|-----|---------|
| ContrataclM (Plataforma CyL) | https://www.contratacion.jcyl.es | Atom/XML |
| Portal de Transparencia CyL | https://transparencia.jcyl.es | CSV, XLSX |
| Open Data CyL | https://datosabiertos.jcyl.es | CKAN API |

### 2.8 Cataluña (Catalunya)

| Source | URL | Formats |
|--------|-----|---------|
| PSCP — Plataforma de Serveis de Contractació Pública | https://contractaciopublica.gencat.cat | Atom/XML, CSV |
| Portal de Transparència Catalunya | https://transparencia.gencat.cat | CSV, JSON |
| Open Data Catalunya | https://analisi.transparenciacatalunya.cat | CKAN/Socrata API, CSV, JSON |

Cataluña's PSCP provides one of the richer APIs, with full OCDS (Open Contracting Data Standard) exports available at `https://contractaciopublica.gencat.cat/perfil/GENCAT/ocds`.

### 2.9 Comunitat Valenciana

| Source | URL | Formats |
|--------|-----|---------|
| PCSP — Plataforma Contratació Pública GVA | https://contratacionpublica.gva.es | Atom/XML |
| Portal de Transparència GVA | https://www.transparencia.gva.es | CSV |
| Dades Obertes GVA | https://dadesobertes.gva.es | CKAN API |

### 2.10 Extremadura

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación Extremadura | https://contratacion.gobex.es | Atom/XML |
| Portal de Transparencia Extremadura | https://gobiernoabierto.extremadura.es/transparencia | CSV |

### 2.11 Galicia

| Source | URL | Formats |
|--------|-----|---------|
| Licitaciones e Contratos (Xunta) | https://www.conselleriadefacenda.es/licitaciones-e-contratos | XML |
| Portal de Transparencia Galicia | https://transparencia.xunta.gal | CSV |
| Open Data Galicia | https://abertos.xunta.gal | CKAN API |

### 2.12 Islas Baleares

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación IB | https://www.caib.es/govern/licitaciones | XML |
| Portal de Transparència IB | https://transparencia.caib.es | CSV |
| Open Data IB | https://www.caib.es/caibdatafront | CSV |

### 2.13 La Rioja

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación La Rioja | https://www.larioja.org/contratacion | XML |
| Portal de Transparencia La Rioja | https://www.transparenciarioja.larioja.org | CSV |

### 2.14 Madrid (Comunidad)

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación CM | https://www.comunidad.madrid/contratacionpublica | Atom/XML |
| Portal de Transparencia CM | https://www.comunidad.madrid/transparencia | CSV, XLSX |
| Open Data CM | https://datos.comunidad.madrid | CKAN API |

### 2.15 Murcia (Región)

| Source | URL | Formats |
|--------|-----|---------|
| Portal de Contratación Murcia | https://www.carm.es/web/pagina?IDCONTENIDO=1&IDTIPO=100&RASTRO=c$m | XML |
| Portal de Transparencia Murcia | https://transparencia.carm.es | CSV |

### 2.16 Navarra (Comunidad Foral)

| Source | URL | Formats |
|--------|-----|---------|
| Contratación Navarra | https://www.navarra.es/es/contratos-y-subvenciones | XML |
| Portal de Transparencia Navarra | https://www.navarra.es/es/gobierno/transparencia | CSV |
| Open Data Navarra | https://gobiernoabierto.navarra.es | CKAN API |

### 2.17 País Vasco / Euskadi

| Source | URL | Formats |
|--------|-----|---------|
| Contratación Pública Euskadi | https://www.contratacion.euskadi.eus | Atom/XML, OCDS |
| Irekia — Open Government Euskadi | https://www.irekia.euskadi.eus | CSV, JSON |
| Open Data Euskadi | https://www.euskadi.eus/gobierno-vasco/datos-abiertos | CKAN API |

País Vasco publishes contracts in OCDS format, making it one of the most developer-friendly sources.

### 2.18 Ceuta y Melilla (Ciudades Autónomas)

Both cities publish through PLACSP. Ceuta also maintains a portal at `https://www.ceuta.es/ceuta/transparencia`.

---

## 3. Local Sources — Localidades

Local entities (municipios, diputaciones, cabildos, mancomunidades) are required under LCSP Art. 347 to register contracts in the RCSP and, above the relevant thresholds, publish in PLACSP. Additional portals:

### 3.1 Major City Open Data Portals

| City | URL | Notes |
|------|-----|-------|
| Madrid (Ayuntamiento) | https://datos.madrid.es | Socrata API; contracts, budgets, grants |
| Barcelona (Ajuntament) | https://opendata-ajuntament.barcelona.cat | CKAN API; rich procurement dataset |
| Valencia (Ajuntament) | https://www.valencia.es/dadesobertes | CSV, JSON |
| Sevilla (Ayuntamiento) | https://datosabiertos.sevilla.org | CKAN API |
| Zaragoza (Ayuntamiento) | https://www.zaragoza.es/sede/portal/datos-abiertos | CKAN API |
| Bilbao (Ayuntamiento) | https://www.bilbao.eus/bilbaodatos | CSV |
| Málaga (Ayuntamiento) | https://datosabiertos.malaga.eu | CKAN API |

### 3.2 Diputaciones (Provincial Councils)

Diputaciones publish their own contracts on PLACSP and some maintain open data portals. Notable examples:

| Diputación | URL |
|------------|-----|
| Diputación de Barcelona (Diba) | https://www.diba.cat/web/dades-obertes |
| Diputación Foral de Bizkaia | https://www.bizkaia.eus/opendata |
| Diputación Provincial de Málaga | https://www.malaga.es/datosabiertos |

### 3.3 FEMP — Federación Española de Municipios y Provincias

The FEMP provides guidance and aggregated statistics on local government contracting: https://www.femp.es/

---

## 4. Legal Framework

### 4.1 Ley 9/2017 — Ley de Contratos del Sector Público (LCSP)

The **LCSP 9/2017** (in force from 9 March 2018) is the cornerstone of Spanish public procurement law. It transposes EU Directives 2014/23/EU (concessions), 2014/24/EU (public sector procurement), and 2014/25/EU (utilities procurement).

Key provisions for CivicLens:

| Article range | Subject |
|---------------|---------|
| Arts. 63–65 | Perfiles de contratante (buyer profiles): mandatory publication on PLACSP |
| Art. 135 | Minimum publication deadlines for open procedure (15–35 days, reduced for urgency) |
| Arts. 154–157 | Prior information notices; transparency obligations before award |
| Art. 207 | Modifications to contracts: must be published and justified |
| Arts. 221–222 | Formalisation of contracts and publication within 15 days |
| Arts. 346–352 | Registro de Contratos del Sector Público (RCSP); statistical reporting; PLACE |
| Art. 159 | Simplified open procedure (up to €2 M works, €100 k services/supplies) |
| Art. 118 | Minor contracts (≤18 000 € services, ≤50 000 € works): lighter transparency obligations |

**Anomaly indicators in LCSP:**
- Repeated use of minor contracts to avoid thresholds (Art. 118 abuse)
- Emergency procedures without justification
- Contract modifications exceeding 20 % of original value or 3 years duration (Art. 205)
- Lack of competition (direct award without adequate justification)
- Award to parties with apparent conflicts of interest (Art. 71, prohibitions on contracting)

### 4.2 Ley 19/2013 — Ley de Transparencia, Acceso a la Información Pública y Buen Gobierno

**Active publicity** obligations (Art. 8) require all public bodies to proactively publish:
- All contracts above €18 000 (minor) and above the LCSP thresholds
- Subsidies and grants above €18 000
- Annual budgets and budget execution
- Financial statements
- Real estate inventory
- Remuneration of senior officials

The **Portal de la Transparencia** (Art. 10) is the central point of access for AGE data.

CivicLens can reference this law when flagging entities that appear to be below-threshold to avoid disclosure. Ley 19/2013 also establishes a right of access to public information (Art. 12); all data published by CivicLens is within scope of that right.

### 4.3 Ley 37/2007 — Reutilización de la Información del Sector Público (RISP)

Implements EU PSI Directive 2003/98/EC (updated by Directive 2013/37/EU, and most recently by Directive (EU) 2019/1024 on Open Data and Re-use of Public Sector Information). Key points:

- Public bodies **must** allow reuse of their information unless an exception applies (Art. 3)
- Reuse may be subject to conditions set in **licences** (Art. 8), but conditions must be non-discriminatory and proportionate
- Real Decreto 1495/2011 implements the law, defines the **"Licencia de uso abierto"** as the default for Spanish public sector data

Updated in 2021 by **Real Decreto-ley 24/2021** (transposing Directive 2019/1024), which:
- Mandates machine-readable, open formats (DCAT-AP, CSV/JSON/XML preferred over PDF)
- Requires APIs for high-value datasets (defined by Commission Implementing Regulation (EU) 2023/138)
- Procurement contracts are explicitly listed as a **high-value dataset category** under the 2023/138 regulation

### 4.4 EU Directives and Regulations

| Instrument | Subject | Transposition |
|------------|---------|---------------|
| Directive 2014/23/EU | Award of concession contracts | LCSP 9/2017 |
| Directive 2014/24/EU | Public procurement (public sector) | LCSP 9/2017 |
| Directive 2014/25/EU | Procurement by utilities | LCSP 9/2017 |
| Directive 2019/1024/EU | Open data & re-use of PSI | Real Decreto-ley 24/2021 |
| Regulation (EU) 2023/138 | High-value datasets (implementing Directive 2019/1024) | Directly applicable in Spain |
| Regulation (EU) 2016/679 (GDPR) | Personal data protection | LOPDGDD 3/2018 |

### 4.5 Ley Orgánica 3/2018 — Protección de Datos Personales y Garantía de Derechos Digitales (LOPDGDD)

Spain's GDPR implementation. Relevant considerations:

- Contract data published by public bodies is **public information** and may be reproduced and displayed (recital 4 GDPR: processing of personal data by competent authorities for official purposes is outside the GDPR's general scope where covered by specific law)
- Contractor names: legal entities — freely reusable; natural persons acting as sole traders — treat as personal data (Art. 4(1) GDPR); display with caution
- Beneficial ownership and UBO data in contracts may constitute personal data
- CivicLens must **not** combine procurement data with external data sources in ways that identify private individuals beyond what is published by the contracting authority

---

## 5. Open Data Licences

### 5.1 Licencia de uso abierto (Spanish Government default)

Defined in **Real Decreto 1495/2011, Annex** and updated by the Norma Técnica de Interoperabilidad de Reutilización de Recursos de la Información (NTI-RISP, BOE 2013). Permissions:
- ✅ Copy, distribute, and transmit the data
- ✅ Adapt the data (transform, merge, build applications)
- ✅ Commercial use
- ✅ No registration required

Conditions:
- Attribution: cite the source ("Fuente: [organismo], [año]")
- Do not imply official endorsement of derived works
- Preserve the original licence notice

This licence is **compatible with Creative Commons CC-BY 4.0**.

### 5.2 Community and Local Variations

| Body | Licence used |
|------|-------------|
| Generalitat de Catalunya | Creative Commons CC-BY 4.0 |
| Govern de les Illes Balears | Licencia de uso abierto |
| Ajuntament de Barcelona | Creative Commons CC-BY 4.0 |
| Ayuntamiento de Madrid | Creative Commons CC-BY 4.0 |
| Gobierno del País Vasco | Creative Commons CC-BY 4.0 |
| Most other bodies | Licencia de uso abierto (equivalent to CC-BY) |

### 5.3 Consequences for CivicLens

- All datasets listed in §§1–3 are reusable for CivicLens under their respective licences
- Proper attribution must be displayed on data provenance pages and in API responses
- No licence requires pre-authorisation or registration for reuse
- **Derived works** (e.g., risk scores, AI summaries) are permitted and do not require sharing under an open licence

---

## 6. Data Privacy Considerations

### 6.1 Legal entities vs. natural persons

| Data element | Status | Notes |
|--------------|--------|-------|
| Company name, CIF | Public | Freely reusable |
| NIF of a company's legal representative | Personal data | Display only if officially published by contracting authority |
| Sole trader (autónomo) acting as contractor | Personal data (name + NIF) | Minimise display; refer to official source |
| Contract amount | Public | Freely reusable |
| Award criteria scores | Public | Freely reusable |
| Employee names in contract documents | Personal data | Do not extract or index |

### 6.2 Sensitive categories

Procurement data does not typically contain special categories of personal data (Art. 9 GDPR). However, contracts in healthcare, social services, or religious/educational contexts may indirectly reveal affiliations. Handle with care.

### 6.3 Right to erasure

GDPR Art. 17 right to erasure does **not** apply to processing carried out in the exercise of official authority (Recital 65) or to data lawfully made public. CivicLens reproduces data originally published by official bodies; erasure requests should be directed to the source contracting authority.

### 6.4 Data minimisation

CivicLens should ingest the minimum personal data required for its transparency mission. Do not store document attachments (tender specifications, evaluation reports) unless necessary; link to source URLs instead.

---

## 7. Integration Notes for CivicLens

### 7.1 Recommended ingestion priority

1. **PLACSP Atom feeds** — highest coverage, near real-time, structured XML (CODICE 2.x schema)
2. **datos.gob.es CKAN API** — discovery layer for regional/local datasets not in PLACSP
3. **Portal de la Transparencia API** — supplementary AGE-level data (grants, subsidies)
4. **OCDS feeds** (Cataluña, País Vasco) — richest structured format where available
5. **Individual CCAA portals** — for high-priority regions not fully covered by PLACSP

### 7.2 PLACSP XML / CODICE 2.x parsing

CODICE 2.x is the Spanish UBL-based schema for procurement notices. Key elements for CivicLens:

```xml
<cac:TenderingProcess>                     <!-- Procedure type -->
<cac:TenderingTerms>                       <!-- Award criteria -->
<cac:ProcurementProject>                   <!-- Subject, CPV code, estimated value -->
<cac:WinningParty>                         <!-- Contractor name, NIF, amount -->
<cac:ProcurementProjectLot>                <!-- Lots -->
```

Python library to consider: `lxml` for XML parsing; `xmltodict` for quick prototyping.

### 7.3 OCDS (Open Contracting Data Standard)

Cataluña and País Vasco export data in OCDS 1.1 format. OCDS is a JSON-based international open standard with Python tooling available via `ocdskit`:

```bash
pip install ocdskit
ocdskit compile releases.json > compiled-contracts.json
```

OCDS maps cleanly to CivicLens contract fields and is preferred where available.

### 7.4 Attribution requirements

CivicLens must display attribution in the UI and API responses. Suggested approach:

```python
# In contract model / API response
source_attribution = {
    "provider": "Plataforma de Contratación del Sector Público",
    "provider_url": "https://contrataciondelestado.es",
    "licence": "Licencia de uso abierto",
    "licence_url": "https://datos.gob.es/es/licencia",
    "retrieved_at": "2024-01-15T10:30:00Z"
}
```

### 7.5 Rate limits and terms of use

| Source | Rate limit | Notes |
|--------|------------|-------|
| PLACSP Atom | No formal limit | Respect robots.txt; cache locally |
| Portal de la Transparencia API | 60 req/min | API key required for higher limits |
| datos.gob.es CKAN API | 100 req/min | No key required |
| City open data portals | Varies | Check individual portal terms |

### 7.6 Anomaly detection alignment with LCSP thresholds

Use the following LCSP 2024 thresholds (indexed periodically; verify against current BOE) to flag potential threshold-splitting:

| Contract type | Minor contract | Simplified procedure | Open procedure (below EU) |
|---------------|---------------|---------------------|--------------------------|
| Works | ≤ 50 000 € | ≤ 2 000 000 € | 2 M – EU threshold |
| Services / Supplies | ≤ 18 000 € | ≤ 100 000 € | 100 k – EU threshold |
| EU thresholds (2024–2025) | | Works: 5 538 000 € | Services/Supplies (central): 143 000 € |

Patterns to flag:
- Multiple minor contracts to the same contractor within a 12-month window approaching the threshold
- Sudden award of simplified procedure contracts just below the €100 k / €2 M thresholds
- Lack of open competition for contracts above the minor-contract threshold

---

## References

- [LCSP 9/2017 (BOE-A-2017-12902)](https://www.boe.es/buscar/act.php?id=BOE-A-2017-12902)
- [Ley 19/2013 de Transparencia (BOE-A-2013-12887)](https://www.boe.es/buscar/act.php?id=BOE-A-2013-12887)
- [Ley 37/2007 RISP (BOE-A-2007-19814)](https://www.boe.es/buscar/act.php?id=BOE-A-2007-19814)
- [Real Decreto 1495/2011 — RISP implementation (BOE-A-2011-17560)](https://www.boe.es/buscar/act.php?id=BOE-A-2011-17560)
- [Real Decreto-ley 24/2021 — Open Data transposition (BOE-A-2021-20923)](https://www.boe.es/buscar/act.php?id=BOE-A-2021-20923)
- [EU Directive 2019/1024 (Open Data)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L1024)
- [Commission Regulation (EU) 2023/138 — High-value datasets](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R0138)
- [LOPDGDD 3/2018 (BOE-A-2018-16673)](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673)
- [OCDS Documentation](https://standard.open-contracting.org/)
- [datos.gob.es Licencia de uso abierto](https://datos.gob.es/es/licencia)
- [NTI-RISP — Reutilización de Recursos de la Información (BOE-A-2013-2380)](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2013-2380)
