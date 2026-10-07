"use client";

import { useMemo, useState } from "react";
import "./resource-guide.css";

const categories = ["All", "Food", "Housing", "Healthcare", "Legal services", "Nonprofits"] as const;
type Category = (typeof categories)[number];
type Region = {
  county: string;
  places: string[];
  directory: string;
  source: string;
  phone: string;
  phoneHref: string;
  text?: string;
  government?: string;
  note: string;
};

const regions: Region[] = [
  { county: "Alameda County", places: ["Oakland", "Hayward", "Castro Valley", "Fremont", "Livermore", "Berkeley", "San Leandro", "Alameda", "Pleasanton", "Union City", "Newark", "Dublin"], directory: "https://211alamedacounty.org/2-1-1-alameda-county-resource-finder/", source: "211 Alameda County", phone: "Dial 211", phoneHref: "tel:211", text: "Text ZIP code to 898211", government: "https://health.alamedacountyca.gov/department/housing-homelessness-services/", note: "Countywide food, housing, healthcare, legal, crisis, employment, and community-service directory." },
  { county: "Contra Costa County", places: ["Richmond", "Concord", "Antioch", "Pittsburg", "San Pablo", "Martinez", "Walnut Creek", "Brentwood", "San Ramon"], directory: "https://cccc.myresourcedirectory.com/index.php/en/", source: "211 Contra Costa / Contra Costa Crisis Center", phone: "211 or 800-830-5380", phoneHref: "tel:18008305380", text: "Text ZIP code to 898211", government: "https://www.contracosta.ca.gov/6106/211-Contra-Costa", note: "Live database of local health and social services, including shelter, food, health, legal, and family support." },
  { county: "San Francisco County", places: ["San Francisco"], directory: "https://211bayarea.org/counties/san-francisco-county/", source: "211 Bay Area / United Way Bay Area", phone: "211 or 800-273-6222", phoneHref: "tel:18002736222", text: "Text ZIP code to 898211", government: "https://www.sf.gov/departments--human-services-agency", note: "Free, confidential, multilingual connection to health, housing, food, legal, crisis, and nonprofit services." },
  { county: "San Mateo County", places: ["Redwood City", "San Mateo", "Daly City", "South San Francisco", "East Palo Alto", "Menlo Park", "Pacifica", "Half Moon Bay"], directory: "https://www.smcgov.org/hsa/community-information-handbook", source: "San Mateo County 2026 Community Information Handbook", phone: "211 or 800-273-6222", phoneHref: "tel:18002736222", text: "Text ZIP code to 898211", government: "https://www.smcgov.org/hsa/public-assistance-programs", note: "County-maintained guide plus live assistance for healthcare, shelter, food, legal aid, and community organizations." },
  { county: "Marin County", places: ["San Rafael", "Novato", "Mill Valley", "Sausalito", "Marin City", "West Marin"], directory: "https://hhs.marincounty.gov/node/10326", source: "Marin Health and Human Services Resource Guide", phone: "211 or 800-273-6222", phoneHref: "tel:18002736222", text: "Text ZIP code to 898211", government: "https://www.marincounty.gov/departments/cda/housing-and-grants/housing-help", note: "County guide for food, housing, healthcare, legal assistance, crisis help, and nonprofit services." },
  { county: "Santa Clara County", places: ["San Jose", "Santa Clara", "Sunnyvale", "Mountain View", "Palo Alto", "Milpitas", "Gilroy", "Morgan Hill", "Cupertino"], directory: "https://211bayarea.org/counties/santa-clara/", source: "211 Bay Area / United Way Bay Area", phone: "211 or 800-273-6222", phoneHref: "tel:18002736222", text: "Text ZIP code to 898211", government: "https://dcss.santaclaracounty.gov/resources/community-resources", note: "Countywide live search for housing, food, healthcare, legal assistance, crisis services, and nonprofits." },
  { county: "San Joaquin County", places: ["Stockton", "Tracy", "Manteca", "Lodi", "Lathrop", "Ripon", "Escalon"], directory: "https://211sj.org/", source: "211 San Joaquin", phone: "211 or 800-436-9997", phoneHref: "tel:18004369997", text: "Text ZIP code to 898211", government: "https://www.sjchsa.org/Portals/0/resources/forms-and-application-packets/Resource%20Directory%202026-2027.pdf", note: "More than 4,000 health and human-service resources, with guided search by need and location." },
  { county: "Solano County", places: ["Vallejo", "Fairfield", "Vacaville", "Suisun City", "Benicia", "Dixon"], directory: "https://211bayarea.org/", source: "211 Bay Area / United Way Bay Area", phone: "211 or 800-273-6222", phoneHref: "tel:18002736222", text: "Text ZIP code to 898211", note: "Free, confidential directory and navigator assistance for essential services across Solano County." },
  { county: "Napa County", places: ["Napa", "American Canyon", "St. Helena", "Calistoga", "Yountville"], directory: "https://211bayarea.org/", source: "211 Bay Area / United Way Bay Area", phone: "211 or 800-273-6222", phoneHref: "tel:18002736222", text: "Text ZIP code to 898211", note: "Free, confidential directory and navigator assistance for essential services across Napa County." },
];

export default function ResourceGuide({ onExit }: { onExit: () => void }) {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const shown = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return regions;
    return regions.filter((region) => [region.county, ...region.places].some((place) => place.toLowerCase().includes(value)));
  }, [query]);
  const searchTerm = category === "All" ? "community services" : category;
  return <main className="resource-shell">
    <header className="resource-top">
      <button className="brand" onClick={onExit}><span className="brand-mark"><i/><i/><i/></span><span><b>NeighborWell</b><small>Regional resource guide</small></span></button>
      <span>Independent directory · no application or eligibility decision</span>
      <button onClick={onExit}>Return to participant home ↗</button>
    </header>
    <section className="resource-main">
      <div className="resource-heading">
        <p className="eyebrow">BAY AREA & NEARBY COUNTY RESOURCE GUIDE</p>
        <h1>Find local help from a current, trusted directory.</h1>
        <p>NeighborWell helps you locate resources. The organization you contact decides availability, eligibility, documentation, and enrollment.</p>
      </div>
      <div className="resource-safety"><b>Need immediate help?</b><span>Call 911 for immediate danger. Call 988 for suicide or mental-health crisis support. Dial 211 for local services.</span><a href="tel:211">Call 211</a></div>
      <section className="resource-search" aria-label="Resource filters">
        <label><span>City, county, or ZIP-area name</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: Hayward, Redwood City, Marin" /></label>
        <div><span>Type of support</span><nav>{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</nav></div>
      </section>
      <div className="resource-result-head"><b>{shown.length} regional director{shown.length === 1 ? "y" : "ies"}</b><span>Showing: {searchTerm}</span></div>
      <section className="region-grid">
        {shown.map((region) => <article key={region.county}>
          <header><span>⌖</span><div><h2>{region.county}</h2><small>Verified source · August 12, 2026</small></div></header>
          <p>{region.note}</p>
          <div className="place-list">{region.places.map((place) => <span key={place}>{place}</span>)}</div>
          <dl><div><dt>Directory steward</dt><dd>{region.source}</dd></div><div><dt>Phone</dt><dd>{region.phone}</dd></div>{region.text && <div><dt>Text</dt><dd>{region.text}</dd></div>}</dl>
          <div className="region-actions"><a href={region.directory} target="_blank" rel="noreferrer">Search {searchTerm} ↗</a><a href={region.phoneHref}>Call for help</a>{region.government && <a href={region.government} target="_blank" rel="noreferrer">County source ↗</a>}</div>
        </article>)}
        {!shown.length && <div className="resource-empty"><b>No listed region matches that search.</b><p>Dial 211 or text your ZIP code to 898211 for resources anywhere in California.</p><a href="tel:211">Call 211</a></div>}
      </section>
      <footer className="resource-disclaimer"><b>Before you go</b><p>Programs, hours, funding, eligibility, and availability can change. Call or use the linked live directory before traveling. NeighborWell does not endorse a provider, promise services, or send your information when you open a link.</p></footer>
    </section>
  </main>;
}
