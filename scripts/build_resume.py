"""Generate the one-page resume and the full CV (requires reportlab).

    python scripts/build_resume.py

The resume is what the portfolio serves at /api/track-download. The CV is the long version with
education, publications, intellectual property, training and languages, for applications that ask for it.
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import CondPageBreak, HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUT_DIR = Path(__file__).resolve().parents[1] / "apps/web/assets/resume"
RESUME = OUT_DIR / "2026_ICLSalinas_Resume.pdf"
CV = OUT_DIR / "2026_ICLSalinas_CV.pdf"

NAME_TEXT = "Ivan Christian L. Salinas"
INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#4a4a4a")
RULE = colors.HexColor("#d6d6d6")
ACCENT = "#d40000"
WIDTH = 176 * mm - 12  # A4 width minus 17 mm margins and the frame's 6 pt padding on each side


def style(name, size, leading, bold=False, color=INK, **kwargs):
    return ParagraphStyle(name, fontName="Helvetica-Bold" if bold else "Helvetica", fontSize=size, leading=leading, textColor=color, spaceAfter=0, **kwargs)


NAME = style("name", 20, 24, True)
ROLE = style("role", 10.5, 14, True, colors.HexColor(ACCENT))
BODY = style("body", 9.2, 12.6)
SMALL = style("small", 8.9, 12, color=MUTED)
RIGHT = style("right", 8.9, 12, color=MUTED, alignment=TA_RIGHT)
HEADING = style("heading", 9.4, 12, True)
JOB = style("job", 9.4, 12.6, True)
BULLET = style("bullet", 9.2, 12.6, leftIndent=9, firstLineIndent=-9)


def link(url, label=None):
    return f"<link href='{url}' color='#111111'>{label or url.split('//')[-1].rstrip('/')}</link>"


CONTACT = " · ".join([
    "Science City of Muñoz, Nueva Ecija, Philippines",
    "+63 926 745 9456",
    link("mailto:banbansalinas@gmail.com", "banbansalinas@gmail.com"),
])
LINKS = " · ".join([
    link("https://ivansalinas.vercel.app/", "ivansalinas.vercel.app"),
    link("https://www.linkedin.com/in/banbansalinas/", "linkedin.com/in/banbansalinas"),
    link("https://github.com/sardinexszc", "github.com/sardinexszc"),
])


def bare(table):
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), *[(k, (0, 0), (-1, -1), 0) for k in ("LEFTPADDING", "RIGHTPADDING", "TOPPADDING", "BOTTOMPADDING")]]))
    return table


def header(role):
    return [Paragraph(NAME_TEXT, NAME), Spacer(1, 2), Paragraph(role, ROLE), Spacer(1, 4), Paragraph(CONTACT, SMALL), Paragraph(LINKS, SMALL)]


def section(title, gap=9):
    return [Spacer(1, gap), Paragraph(title.upper(), HEADING), Spacer(1, 2), HRFlowable(width="100%", thickness=0.6, color=RULE, spaceAfter=4)]


def block(title, items, gap=9):
    """A section that starts on a new page when too little room is left, so a heading never sits alone at the bottom."""
    return [CondPageBreak(35 * mm), *section(title, gap), *items]


def bullet(text):
    return Paragraph(f"<font color='{ACCENT}'>&#8226;</font>&nbsp;&nbsp;{text}", BULLET)


def entry(title, dates, sub=None, points=(), note=None, gap=6):
    row = bare(Table([[Paragraph(title, JOB), Paragraph(dates, RIGHT)]], colWidths=[WIDTH - 45 * mm, 45 * mm]))
    parts = [row]
    if sub:
        parts.append(Paragraph(sub, SMALL))
    if note:
        parts.append(Paragraph(note, SMALL))
    if points:
        parts.append(Spacer(1, 2))
        parts += [bullet(p) for p in points]
    parts.append(Spacer(1, gap))
    return KeepTogether(parts)


# Shared content -------------------------------------------------------------------------------

SKILLS = [
    ("Full-stack web", "PHP, Laravel, JavaScript, TypeScript, Next.js, React, Tailwind CSS, Supabase, REST APIs, HTML/CSS"),
    ("Databases &amp; data", "MySQL, PostgreSQL (row-level security, materialized views, window functions, CUBE/ROLLUP), Kimball dimensional modeling, SCD Type 2, Python ETL, dbt Core"),
    ("AI-assisted dev &amp; automation", "Claude Code, Codex, Gemini, GitHub Copilot; n8n email automations, webhooks and bots"),
    ("IoT &amp; GIS", "ESP32, Arduino, PlatformIO, Python sensor control systems; ArcGIS, QGIS"),
    ("Tools &amp; delivery", "Git, GitHub, GitHub Actions CI, Vercel, XAMPP; requirements gathering, technical documentation, stakeholder coordination"),
]

INSTRUCTOR_POINTS = [
    "Co-developed the CLAARRDEC Real-Time Monitoring System (" + link("https://rtms.clsu.edu.ph/", "rtms.clsu.edu.ph") + ") in Laravel, PHP and MySQL, used by all member State Universities and Colleges of the regional R&amp;D consortium.",
    "Built the CRRDC enterprise information system (" + link("https://crrdc.vercel.app/", "crrdc.vercel.app") + ") in Next.js, React, TypeScript, Tailwind CSS and Supabase (PostgreSQL) with role-based access control, and the CLAARRDEC CMS and e-library in Laravel and MySQL.",
    "Lead developer for IoT smart indoor-farming systems (ESP32, Arduino, sensors, Python): automated evaporative cooling, fertigation, light and climate monitoring and retractable solar panels, with a real-time monitoring web app.",
    "Led the CRRDC Information and Communication Division (1 of 4 divisions), turning R&amp;D outputs into databases, knowledge products and ICT-based innovations.",
    "Taught web and Java programming, media and business courses to 150–250 students per semester; designed outcomes-based curriculum and mentored student capstone system-development teams.",
]

JDNP_POINTS = [
    "Managed project documents and correspondence, and monitored fund utilization.",
    "Prepared work, financial and accomplishment reports for project stakeholders.",
]

WAREHOUSE = "PostgreSQL 17 data warehouse unifying multi-agency Philippine disaster data: Kimball model with 4 star schemas and 9 conformed dimensions, Python and dbt Core ETL, 36 data-quality rules that caught all 19 planted defect types, materialized views that made dashboard queries 78x faster, row-level security, 99+ dbt tests and Next.js dashboards."
PORTFOLIO = "Server-rendered portfolio with a private analytics dashboard, admin sign-in and rate-limited tracking APIs (Next.js, TypeScript, Supabase). Lighthouse 100 for accessibility on mobile and desktop."
TCEHUB = "Mobile-first community site for the Toyota Camry Elite community: filterable, paginated shop directory, journals, events and galleries (Next.js, TypeScript, Tailwind CSS)."


def skills_table():
    rows = [[Paragraph(f"<b>{k}</b>", BODY), Paragraph(v, BODY)] for k, v in SKILLS]
    table = Table(rows, colWidths=[43 * mm, WIDTH - 43 * mm])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5)]))
    return table


def doc(path, title, top=14 * mm, bottom=13 * mm):
    return SimpleDocTemplate(str(path), pagesize=A4, leftMargin=17 * mm, rightMargin=17 * mm, topMargin=top, bottomMargin=bottom, title=title, author=NAME_TEXT, subject="Full-stack developer")


def page_number(canvas, document):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(A4[0] - 17 * mm, 8 * mm, f"{NAME_TEXT} · CV · page {document.page}")
    canvas.restoreState()


# Resume: one page -----------------------------------------------------------------------------

def build_resume():
    story = header("Full-Stack Developer · Web, Data &amp; IoT")
    story += section("Summary", 6)
    story.append(Paragraph(
        "Full-stack web developer with 7 years at Central Luzon State University building and maintaining live information systems "
        "in Laravel, PHP, MySQL, Next.js and TypeScript, including a real-time monitoring system used by all member universities of the "
        "CLAARRDEC research consortium. Ships end to end, from database design to deployed UI, and works fast across stacks with "
        "AI-assisted development. Remote-ready, with strong written English and a structured, detail-focused approach.", BODY))
    story += block("Skills", [skills_table()], 6)
    story += block("Experience", [
        entry("Full-Stack Web Developer", "2026–present", "Independent and collaborative product work",
              ["Building web applications and automation workflows with Next.js, Laravel and Supabase."]),
        entry("Instructor I, Department of Information Technology", "Aug 2019–Jun 2026", "Central Luzon State University, Science City of Muñoz",
              INSTRUCTOR_POINTS, note="Also designated to the Crops and Resources Research and Development Center (CRRDC); Information and Communication Division Head, Jul 2024–Dec 2025."),
        entry("Project Technical Staff", "Jul 2017–Jul 2019", "Central Luzon State University · CHED–British Council JDNP", JDNP_POINTS, gap=0),
    ], 6)
    story += block("Selected Projects", [
        bullet("<b>Disaster Response Intelligence Warehouse:</b> PostgreSQL 17 Kimball warehouse (4 star schemas) for multi-agency Philippine disaster data; Python and dbt Core ETL with 36 data-quality rules and 99+ tests; materialized views made dashboard queries 78x faster."),
        bullet(f"<b>Portfolio and Analytics Platform</b> ({link('https://ivansalinas.vercel.app/', 'ivansalinas.vercel.app')}): Next.js and Supabase site with a private analytics dashboard and rate-limited tracking APIs; Lighthouse 100 accessibility."),
        bullet(f"<b>TCEHub</b> ({link('https://tcehub-alpha.vercel.app/', 'tcehub-alpha.vercel.app')}): mobile-first community site with a shop directory, journals, events and galleries."),
    ], 6)
    story += section("References", 6)
    story.append(Paragraph("Available upon request.", BODY))
    out = doc(RESUME, f"{NAME_TEXT} | Resume", top=11 * mm, bottom=10 * mm)
    out.build(story)
    return out


# CV: full version -----------------------------------------------------------------------------

def build_cv():
    story = header("Curriculum Vitae · Full-Stack Developer · Web, Data &amp; IoT")
    story += section("Profile")
    story.append(Paragraph(
        "Full-stack web developer with 7 years at Central Luzon State University building and maintaining live information systems "
        "in Laravel, PHP, MySQL, Next.js and TypeScript, including a real-time monitoring system used by all member universities of the "
        "CLAARRDEC research consortium. Ships end to end, from database design to deployed UI, and works fast across stacks with "
        "AI-assisted development in Claude Code. Brings data engineering (PostgreSQL, Kimball modeling, dbt), IoT control systems, "
        "published research and a teaching background. Currently completing an MS in IT (Data Science). Remote-ready, with strong "
        "written English and a structured, detail-focused approach.", BODY))
    story += block("Skills", [skills_table()])

    story += block("Professional Experience", [
        entry("Full-Stack Web Developer", "2026–present", "Independent and collaborative product work",
              ["Building web applications and automation workflows with Next.js, Laravel and Supabase."]),
        entry("Instructor I, Department of Information Technology", "Aug 2019–Jun 2026", "Central Luzon State University, Science City of Muñoz, Philippines",
              INSTRUCTOR_POINTS, note="Also designated to the Crops and Resources Research and Development Center (CRRDC); Information and Communication Division Head, Jul 2024–Dec 2025."),
        entry("Project Technical Staff", "Jul 2017–Jul 2019", "Central Luzon State University, Science City of Muñoz, Philippines",
              JDNP_POINTS, note="CHED–British Council Joint Development of Niche Programmes through Philippine–UK Linkages (JDNP).", gap=0),
    ])

    story += block("Projects", [
        entry("CLAARRDEC Real-Time Monitoring System (RTMS)", "Laravel · PHP · MySQL", link("https://rtms.clsu.edu.ph/"),
              ["Shared R&amp;D project reporting and oversight, used by all member State Universities and Colleges of the CLAARRDEC consortium. Co-developer of the monitoring and reporting workflows."]),
        entry("CRRDC Enterprise Information System", "Next.js · Supabase", link("https://crrdc.vercel.app/") + " · " + link("https://github.com/sardinexszc/crrdc"),
              ["A single platform for research, extension, personnel and administrative records, with role-based access control for each team. Built end to end: requirements, database design, access control and deployment."]),
        entry("Disaster Response Intelligence Warehouse", "PostgreSQL · Python · dbt", None, [WAREHOUSE]),
        entry("Smart Indoor Farming IoT System", "ESP32 · Arduino · Python", link("https://smart-indoor-farming-website.vercel.app/", "smart-indoor-farming-website.vercel.app"),
              ["Automated evaporative cooling, fertigation, light and climate monitoring and retractable solar panels, with a real-time monitoring web app. Lead developer for the sensor control systems and the web app."]),
        entry("CLAARRDEC Website, CMS and E-Library", "Laravel · MySQL", None,
              ["Public website and e-library with controlled access, administration and usage reporting."]),
        entry("Portfolio and Analytics Platform", "Next.js · Supabase", link("https://ivansalinas.vercel.app/") + " · " + link("https://github.com/sardinexszc/SardinexszcPortfolio"), [PORTFOLIO]),
        entry("TCEHub", "Next.js · TypeScript", link("https://tcehub-alpha.vercel.app/") + " · " + link("https://github.com/sardinexszc/tcehub"), [TCEHUB], gap=0),
    ])

    story += block("Education", [
        entry("MS Information Technology, major in Data Science", "Feb 2026–present", "Nueva Ecija University of Science and Technology, Philippines",
              ["In progress, expected 2027–2028. Coursework includes Enterprise Data Warehousing."]),
        entry("BS Information Technology, major in Systems Development", "2013–2017", "Central Luzon State University, Science City of Muñoz, Philippines",
              ["Capstone: “CLSU Open University Student Academic Information Monitoring and Record Keeping System” (C# desktop application, MySQL).",
               "300-hour OJT at CLSU Open University (web development, portal updates), commended for excellent performance."], gap=0),
    ])

    story += block("Publications", [
        bullet("Salvador, M.A., Botangen, K.A., Rabang, M.C., Salinas, I.C., et al. (2024). Development of a Web-based Research Consortium Database Management System: Advancing Data-driven and Knowledge-based Project Management. ACM. " + link("https://doi.org/10.1145/3670105.3670120", "doi:10.1145/3670105.3670120")),
        bullet("Vicencio, J.J., et al., Salinas, I.C. (2025). Senior Digital World: Social Media Usage and Online Identity Expression Among Senior Citizens in Selected Barangays of Talavera, Nueva Ecija. CGCI International Journal of Administration, Management, Education and Technology. " + link("https://doi.org/10.70059/nv6q0j65", "doi:10.70059/nv6q0j65")),
        bullet("Maglaque, E.J., Basinga, K., Ravela, R.A., Botangen, K.A., Salinas, I.C., Ledesma, A. (2026). Designing an IoT-Based Tilapia Fingerling Counter for Smart Aquaculture Operations. Accepted, ICEECIT 2026."),
        bullet("Hidalgo, L.G., Guevarra, A., Quitos, R., Sebbey, G., Villanueva, E., Salinas, I.C., Nate, J.V. Automated and Real-Time Monitoring Feeder System for CLSU Tunnel-Type Broiler Production Project. Under review, IEEE NEPCON 2026."),
    ])

    story += block("Intellectual Property", [
        bullet("Registered software copyrights N2026-331 to N2026-335 (5 programs): smart indoor-farming control software, National Library of the Philippines, 2026 (co-author)."),
        bullet("Published patent application (named inventor): “Automated Vitamins and Antibiotics Injection System for Broiler Production”, PH 12023050744 (published 2025)."),
        bullet("Registered copyright: “Solar Grow” and “Ang Solar Grow” brochures."),
        bullet("Pending team filings (smart indoor farming): 1 software copyright, 2 documentation copyrights, 4 utility models, 1 patent application (Solar-Powered Elevated Pots)."),
    ])

    story += block("Training and Certificates", [
        bullet("Advanced GIS Applications for Agricultural Resources Management (5-day workshop), DOST-PCAARRD, Oct 2025."),
        bullet("Fundamentals of GIS (3-day workshop), DOST-PCAARRD, Nov 2024."),
        bullet("Flexible Learning Systems Training Course, Central Luzon State University, Jul 2020."),
        bullet("Intercultural Fluency Essentials, British Council, Jan 2018."),
        bullet("Networking Fundamentals (2016) and C# Fundamentals (2015), Microsoft Virtual Academy."),
    ])

    story += block("Languages", [bullet("Filipino (native); English (C2 written, OnlineJobs.ph English test; B2 spoken).")])

    story += block("References", [Paragraph("Available upon request.", BODY)])

    out = doc(CV, f"{NAME_TEXT} | Curriculum Vitae")
    out.build(story, onFirstPage=page_number, onLaterPages=page_number)
    return out


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    build_resume()
    build_cv()
    print(f"Wrote {RESUME}\nWrote {CV}")


if __name__ == "__main__":
    main()
