# Fahad Almalki, MD — Clinical Operating System Update

This update reorganizes the website as a clinical operating system:

- Public home page only
- Protected clinical pathway library using a soft static-site login gate
- Clinical pathway categories:
  - Vascular Medicine Clinic Pathways
  - Antithrombotic Safety Pathways
  - General Internal Medicine Diagnostic Reasoning
  - CTU / Rounding Standard

Replace App.jsx and styles.css in the repository root. Keep CNAME for GitHub Pages.

Default soft-gate credentials inside App.jsx:
- Username: fahad
- Password: ChangeThisPassword2026!

Important: GitHub Pages is static. This soft gate is not true security. For real privacy, put the protected tools behind Cloudflare Access or a server-auth layer.
