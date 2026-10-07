# Appliance Energy Consumption Website

A small multi-page demonstration website built for Exercise 0.2. It shows a
consistent HTML/CSS structure, a shared top navigation bar, an accordion-style
FAQ, and an optional vanilla-JavaScript appliance energy calculator.

## Folder structure

```
/
├── index.html          Home page (hero, FAQ, energy calculator)
├── televisions.html    Sample television models and specs
├── about.html          About page + Generative AI acknowledgement
├── assets/
│   ├── css/
│   │   └── style.css   Single shared stylesheet for all pages
│   ├── js/
│   │   └── script.js   FAQ accordion, footer year, energy calculator
│   └── img/
│       └── PowerIcon.png   Provided logo, used in the top-left nav
└── README.md
```

## Pages

- **Home** — placeholder content on Australian appliance energy use, a live
  appliance energy calculator, and an FAQ accordion.
- **Televisions** — a small set of placeholder television models with a
  comparison table of typical wattage.
- **About Us** — project background and the Generative AI acknowledgement.

## Navigation

- The logo in the top-left of every page links back to `index.html`.
- The current page is indicated with `aria-current="page"`, which the
  stylesheet uses to highlight the active link.
- All nav links have a hover effect implemented in CSS.

## Styling

All styling lives in `assets/css/style.css` and is shared across every page —
no inline styles or per-page `<style>` blocks. The colour palette (cream,
gold, brown) is taken directly from `PowerIcon.png`.

## JavaScript

`assets/js/script.js` is loaded on every page and handles three things:

1. **Footer year** — writes the current year into the footer automatically.
2. **FAQ accordion** (Home page) — hidden-by-default answers that expand and
   collapse when their question is clicked.
3. **Appliance energy calculator** (optional extension, Home page) — takes
   wattage (or a preset appliance), hours of use per day, and an electricity
   price, validates the input, and calculates/updates daily, monthly and
   yearly energy use plus an estimated yearly cost. Values are kept in
   `sessionStorage` so the calculator still shows a result after a refresh.

## Generative AI use

Generative AI was used to help draft the HTML, CSS and JavaScript in this
repository. See the acknowledgement on the About Us page — fill in the
bracketed placeholders there (tool name, what it was used for, who reviewed
it) with your own details before submitting.

## To personalise before submission

- Replace "Your Name Here" in each page's footer.
- Fill in the Generative AI acknowledgement details on `about.html`.
- Replace placeholder text/data with real content if your unit requires it.
- Commit regularly with meaningful messages as you make changes.

# COS30045 Exercise 3.0 - Communicating Data Insights

## Dataset Overview
- **Dataset:** TV Market Pricing & Specifications (`tv_2026_02_15.csv`)
- **Attributes Analyzed:** Brand, Price, Screen Size, Resolution, and Display Technology.
- **Data Preparation:** Cleaned and processed using KNIME Analytics Platform (handling missing attributes, string normalization, numeric rounding, and aggregations).

## Key Insights
1. **Brand Concentration:** A small group of key manufacturers dominates total listing share.
2. **Screen Size Sweet Spot:** Price increases linearly up to 55 inches; panels 65 inches and above experience non-linear premium price jumps.
3. **Value Recommendation:** Mid-range 55-inch models offer the highest screen real estate per dollar spent.

## Generative AI Declaration
Generative AI was used to assist in structuring the analytical storyboard, refining narrative flow, and drafting HTML/Markdown documentation. All KNIME node configurations, data transformations, and final interpretations were verified manually.

## Analytical Storyboard

The following storyboard maps our analytical narrative to the data processing pipeline executed in KNIME:

## 1. Data Ingestion & Preparation
* **Objective:** Clean and prepare the TV Market Pricing & Specifications dataset (`tv_2026_02_15.csv`)[cite: 1].
* **Workflow Steps:** The `CSV Reader` ingests the raw data. The workflow splits to handle different data types: the top branch handles categorical string normalization using `String Cleaner` and `String Replacer` nodes, while the bottom branch handles numeric processing using `Expression` and `Number Rounder` nodes[cite: 1]. Missing or irrelevant attributes are isolated and removed via `Column Filter` and `Nominal Value Row Filter` nodes.

## 2. Insight 1: Brand Concentration
* **Objective:** Identify the market listing share among manufacturers[cite: 1].
* **Workflow Steps:** The cleaned string data flows into a `GroupBy` node to aggregate TV listings by brand. 
* **Visualizations:** A `Pie Chart` and a sorted `Bar Chart` display the distribution, revealing that a small group of key manufacturers dominates the total listing share[cite: 1].

## 3. Insight 2: The Screen Size Sweet Spot
* **Objective:** Analyze the correlation between screen size and price[cite: 1].
* **Workflow Steps:** Numeric attributes like Price and Screen Size[cite: 1] are passed through the bottom workflow branch. Initial data distributions are validated using a `Histogram`.
* **Visualizations:** A `Scatter Plot` graphs price against screen size. This visualization illustrates the insight that price increases linearly up to 55 inches, but panels 65 inches and above experience non-linear premium price jumps[cite: 1].

## 4. Insight 3: Value Recommendation
* **Objective:** Determine the best value category for consumers[cite: 1].
* **Workflow Steps:** Secondary `Expression` and `Pivot` nodes calculate the cost-to-feature ratios (screen real estate per dollar).
* **Visualizations:** A series of comparative `Bar Chart` nodes output the final aggregated metrics, concluding that mid-range 55-inch models offer the highest screen real estate per dollar spent[cite: 1].