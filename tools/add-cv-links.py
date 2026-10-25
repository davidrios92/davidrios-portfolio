"""Add clickable link annotations to the exported CV PDF.

Word exports the contact line as plain text, so the LinkedIn / GitHub / email
entries are not clickable. Re-run this after regenerating the PDF from a new
.docx:

    py -3 tools/add-cv-links.py assets/David-Rios-CV-2026.pdf

Idempotent: existing URI annotations are cleared before new ones are added.
"""
import sys
import pymupdf

LINKS = {
    "linkedin.com/in/davidemanuelrios": "https://www.linkedin.com/in/davidemanuelrios/",
    "github.com/davidrios92": "https://github.com/davidrios92",
    "emarios.92@gmail.com": "mailto:emarios.92@gmail.com",
}


def main(path):
    doc = pymupdf.open(path)
    added, missing = [], []

    for needle, uri in LINKS.items():
        hits = [(pno, r) for pno in range(doc.page_count)
                for r in doc[pno].search_for(needle)]
        if not hits:
            missing.append(needle)
            continue
        for pno, rect in hits:
            page = doc[pno]
            for link in page.get_links():
                if link.get("uri") and pymupdf.Rect(link["from"]).intersects(rect):
                    page.delete_link(link)
            page.insert_link({"kind": pymupdf.LINK_URI, "from": rect, "uri": uri})
            added.append((needle, uri, pno + 1))

    doc.saveIncr()
    doc.close()

    for needle, uri, pno in added:
        print(f"  p{pno}  {needle}  ->  {uri}")
    for needle in missing:
        print(f"  NOT FOUND: {needle}", file=sys.stderr)
    print(f"{len(added)} link(s) added")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "assets/David-Rios-CV-2026.pdf"))
