# Team Pulse — Final Project Report

## Project overview

**Team Pulse** is a responsive, accessible, and performance-conscious mini web application that displays team productivity data. It integrates the main skills developed during the internship: responsive layout design, interactive UI development, accessibility, DOM manipulation, data rendering, and front-end performance optimization.

The dashboard loads a static JSON dataset containing eight team members from Engineering, Design, and Marketing. It displays summary metrics, an SVG bar chart, and a sortable, filterable data table.

## Requirements and wireframe

The dashboard was planned with a simple mobile-to-desktop wireframe:

1. Header with application name and loading/status message  
2. Four summary metric cards  
3. Team productivity chart  
4. Filter and search controls  
5. Sortable productivity table  
6. Footer  

On desktop, metrics appear in four columns and the chart and table use the full content width. On tablet, metrics reduce to two columns. On mobile, all metric cards and controls stack vertically, while the table remains horizontally scrollable within its own region.

## Features implemented

### Dynamic data display

The application fetches `data/team-data.json` using the Fetch API and renders:

- Total team members
- Total tasks completed
- Total hours logged
- Number of active members
- Tasks completed by team
- A detailed team-member table

The JSON file separates content from presentation, making the dashboard easy to update without changing HTML or JavaScript.

### Interactive filtering and sorting

Users can filter by team, filter by status, and search by name or role. The table can be sorted by any column by selecting its header button. Selecting the same column again reverses the sort direction.

A “Reset filters” button restores the default view. All controls immediately update the metrics, chart, and table.

### SVG chart

The chart is generated with vanilla JavaScript and inline SVG. It avoids external charting libraries, reducing JavaScript payload and dependency risk. Each bar includes a native SVG `<title>` and an accessible `aria-label`, while the chart is also supported by a text summary.

## Accessibility enhancements

The dashboard follows accessibility and ARIA practices:

- Semantic landmarks: `header`, `main`, `section`, and `footer`
- One clear `h1` and a logical heading hierarchy
- A skip link to bypass repeated header content
- Visible focus indicators for links, buttons, inputs, selects, and chart bars
- Native `select`, `input`, and `button` elements for reliable keyboard and screen-reader support
- `aria-sort` on sortable table headers
- `scope="row"` for member names and `scope="col"` for table headings
- A table caption explaining how sorting works
- `role="status"` and `aria-live="polite"` for data-loading and filtered-result updates
- A text-based chart summary in addition to the visual chart
- An accessible error state if the JSON file cannot be loaded

Color is not the only means of conveying status. Active and on-leave statuses also use distinct text labels and semantic class names.

## Performance optimizations

- JavaScript is minified and loaded with `defer`, preventing it from blocking initial HTML parsing.
- CSS is minified and kept in one small stylesheet.
- The chart is generated with lightweight inline SVG rather than a third-party charting library.
- The favicon is inlined as a data URI, eliminating an additional network request.
- The application uses system fonts, avoiding external font downloads.
- DOM updates are consolidated through focused render functions instead of repeatedly manipulating unrelated elements.
- The JSON dataset is external, allowing the browser to cache data separately from the application code.

For deployment, static assets should be served with long-lived immutable cache headers and versioned filenames. HTML should use a shorter cache duration so users receive updated asset references.

## Development process

The project began with a requirements outline and low-fidelity wireframe. The HTML structure was created first, using semantic landmarks and accessible form controls. CSS was then implemented with CSS Grid for the metric cards and controls, Flexbox for the header, and media queries for responsive behavior.

JavaScript was organized around a single application state object and focused render functions. This separation keeps filtering, sorting, metrics, chart rendering, and table rendering maintainable. Error handling ensures that failed data loading does not leave the interface in an unclear state.

## Testing performed

Testing covered desktop, tablet, and mobile layouts at approximately 1280px, 768px, and 375px widths. The dashboard was checked using keyboard-only navigation, including tabbing through controls, activating sort buttons, changing filters, and using the reset button.

Functional tests confirmed that:

- Team, status, and search filters update the table and metrics.
- Sorting works in both ascending and descending order.
- The reset control restores all default values.
- The chart updates when filters change.
- Empty filter results display a clear message.
- Invalid or missing JSON data produces an accessible error message.

Accessibility testing included checking heading order, label associations, focus visibility, live-region announcements, table semantics, and reduced-motion behavior. The application should also be checked with Lighthouse, WAVE, and a screen reader before final deployment.

## Conclusion

Team Pulse demonstrates an integrated front-end workflow: a responsive interface, dynamic JSON-driven content, interactive filtering and sorting, accessible semantic markup, and lightweight performance-conscious implementation. The project provides a practical foundation that could be extended with authentication, persistent user preferences, real API data, or additional visualizations.
