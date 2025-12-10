# Project Research Folder

This folder contains pre-collected research materials that will be **automatically detected** and used during the RLM workflow phases.

## Purpose

Drop any research files here before running `/cc-discover`, `/cc-design`, or `/cc-create-specs`. The AI agents will automatically incorporate this research into their outputs.

## Supported File Types

| Type | Extensions | Used By |
|------|------------|---------|
| Documents | `.md`, `.txt`, `.pdf` | All phases |
| Data | `.json`, `.csv`, `.yaml` | Specs, Design |
| Images | `.png`, `.jpg`, `.svg` | Design |
| Screenshots | `.png`, `.jpg` | Design, UX Research |

## Folder Structure

```
RLM/research/project/
├── README.md                    # This file
├── market/                      # Market research
│   ├── competitors.md           # Competitor analysis
│   ├── market-size.md           # TAM/SAM/SOM data
│   └── trends.md                # Industry trends
├── users/                       # User research
│   ├── interviews/              # User interview transcripts
│   ├── surveys/                 # Survey results
│   ├── personas.md              # Existing personas
│   └── journey-maps.md          # User journey maps
├── technical/                   # Technical research
│   ├── architecture-notes.md    # Architecture considerations
│   ├── integrations.md          # Third-party integration notes
│   └── constraints.md           # Technical constraints
├── design/                      # Design research
│   ├── inspiration/             # Design inspiration images
│   ├── brand-guidelines.md      # Existing brand guidelines
│   ├── color-palettes.md        # Color preferences
│   └── wireframes/              # Existing wireframes
└── requirements/                # Business requirements
    ├── stakeholder-notes.md     # Stakeholder meeting notes
    ├── business-rules.md        # Business logic rules
    └── compliance.md            # Regulatory requirements
```

## Auto-Detection Behavior

### During `/cc-discover` (Discovery Phase)
- Reads all `.md` and `.txt` files
- Incorporates competitor analysis into PRD
- Uses market data for business context
- References user research for persona creation

### During `/cc-design system` (Design System Phase)
- Reads `design/` folder for brand guidelines
- Uses color palettes if provided
- References design inspiration images
- Incorporates existing wireframes

### During `/cc-design research` (UX Research Phase)
- Prioritizes existing user research over web research
- Merges interview transcripts into persona synthesis
- Uses provided journey maps as foundation

### During `/cc-create-specs` (Specs Phase)
- Reads technical constraints
- Incorporates integration requirements
- References compliance requirements

## Example Usage

1. **Before starting a new project:**
   ```
   # Add your research files
   cp ~/my-research/*.md RLM/research/project/market/
   cp ~/user-interviews/*.txt RLM/research/project/users/interviews/
   ```

2. **Run discovery:**
   ```
   /cc-discover "Build a habit tracking app"
   ```

3. **The agent will report:**
   ```
   ┌─────────────────────────────────────────────────────────────────┐
   │ Project Research Detected                                       │
   ├─────────────────────────────────────────────────────────────────┤
   │ Found 12 research files:                                        │
   │ - market/competitors.md (competitor analysis)                   │
   │ - market/market-size.md (market data)                           │
   │ - users/interviews/user-001.txt (user interview)                │
   │ - users/interviews/user-002.txt (user interview)                │
   │ - design/brand-guidelines.md (brand guidelines)                 │
   │                                                                 │
   │ These will be incorporated into the discovery process.          │
   │ Web research will supplement (not replace) your research.       │
   └─────────────────────────────────────────────────────────────────┘
   ```

## Research Priority

When project research exists, AI agents follow this priority:

1. **Project research** (this folder) - Highest priority
2. **Previous RLM outputs** (specs, PRD) - Second priority
3. **Web research** - Supplements gaps only

## Best Practices

- **Be specific**: Name files descriptively (`competitor-stripe-analysis.md` vs `notes.md`)
- **Add context**: Include dates and sources in documents
- **Organize**: Use subfolders to categorize research
- **Update**: Remove outdated research to avoid conflicts
- **Format**: Use Markdown for best AI parsing

## Clearing Research

To start fresh without project research:
```bash
# Archive existing research
mv RLM/research/project RLM/research/project-backup-$(date +%Y%m%d)

# Create empty folder
mkdir RLM/research/project
```
