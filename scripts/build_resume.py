"""Generate the one-page portfolio resume (requires reportlab)."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT = Path(__file__).resolve().parents[1] / "apps/web/assets/resume/2026_ICLSalinas_Resume.pdf"
INK = colors.HexColor("#1c211d")
MUTED = colors.HexColor("#49524c")
RULE = colors.HexColor("#d4d9d0")


def style(name, size=9, leading=13, bold=False, color=INK, **kwargs):
    return ParagraphStyle(
        name,
        fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size,
        leading=leading,
        textColor=color,
        spaceAfter=0,
        **kwargs,
    )


NAME = style("name", 21, 26, True)
ROLE = style("role", 11, 16, True)
BODY = style("body", 9.6, 14)
SMALL = style("small", 9.1, 13, color=MUTED)
CONTACT = style("contact", 9, 13, color=MUTED, alignment=TA_RIGHT)
HEADING = style("heading", 9.6, 13, True)
JOB = style("job", 9.6, 14, True)


def paragraph(text, kind=BODY):
    return Paragraph(text, kind)


def section(title):
    return [Spacer(1, 11), paragraph(title.upper(), HEADING), Spacer(1, 4), HRFlowable(width="100%", thickness=.6, color=RULE), Spacer(1, 6)]


def bullet(text):
    return paragraph(f"<font color='#657f23'>&#8226;</font>  {text}")


def position(title, employer, dates, points):
    row = Table([[paragraph(title, JOB), paragraph(dates, CONTACT)]], colWidths=[126 * mm, 50 * mm])
    row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return KeepTogether([row, paragraph(employer, SMALL), Spacer(1, 4), *[bullet(point) for point in points], Spacer(1, 7)])


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=17 * mm, leftMargin=17 * mm, topMargin=16 * mm, bottomMargin=14 * mm, title="Ivan Christian L. Salinas | Resume", author="Ivan Christian L. Salinas")
    header = Table([[paragraph("Ivan Christian L. Salinas", NAME), paragraph("Science City of Muñoz, Nueva Ecija<br/>+63 926 745 9456<br/>banbansalinas@gmail.com<br/>ivansalinas.vercel.app", CONTACT)]], colWidths=[95 * mm, 81 * mm])
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    story = [header, Spacer(1, 4), paragraph("Full-stack software engineer", ROLE)]
    story += section("Profile")
    story.append(paragraph("I build web applications, research information systems, and automation for institutional teams. My work spans requirements, database design, development, and deployment."))
    story += section("Skills")
    story += [paragraph("<b>Web:</b> React, Next.js, TypeScript, JavaScript, PHP, Laravel"), paragraph("<b>Data and APIs:</b> MySQL, PostgreSQL, Supabase, SQL, REST APIs"), paragraph("<b>Automation and delivery:</b> n8n, webhooks, Git, GitHub, Vercel")]
    story += section("Experience")
    story += [
        position("Full-Stack Web Developer", "Independent and collaborative work", "2026–Present", ["Build web applications, databases, and automation workflows with Next.js, Laravel, and Supabase."]),
        position("Researcher, Instructor &amp; Information Systems Developer", "Central Luzon State University", "2019–2026", [
            "Delivered research information, monitoring, and content systems for institutional projects.",
            "Led small teams and worked with researchers and administrators to define requirements and coordinate delivery.",
            "Taught undergraduate programming and supervised software development capstone projects.",
        ]),
        position("Project Technical Staff", "Central Luzon State University", "2017–2019", ["Maintained project records and technical reports; supported requirements gathering and team coordination."]),
    ]
    story += section("Selected projects")
    story += [
        paragraph("<b>CRRDC web platform:</b> Research, extension, personnel, and administrative records in one system."),
        paragraph("<b>CLAARRDEC monitoring:</b> Shared project reporting and oversight across member institutions."),
        paragraph("<b>CLAARRDEC CMS / E-Library:</b> Public content, controlled access, and usage reporting."),
    ]
    story += section("Education")
    story += [paragraph("<b>MS Information Technology, Data Science</b> — Nueva Ecija University of Science and Technology (2026–Present)"), paragraph("<b>BS Information Technology, Systems Development</b> — Central Luzon State University (2013–2017)")]
    story += section("Selected publications")
    story += [paragraph("Development of a Web-based Research Consortium Database Management System: Advancing Data-driven and Knowledge-based Project Management (2024) — DOI: 10.1145/3670105.3670120", SMALL), paragraph("Senior Digital World: Social Media Usage and Online Identity Expression Among Senior Citizens in Selected Barangays of Talavera, Nueva Ecija (2025) — DOI: 10.70059/nv6q0j65", SMALL)]
    doc.build(story)


if __name__ == "__main__":
    main()
