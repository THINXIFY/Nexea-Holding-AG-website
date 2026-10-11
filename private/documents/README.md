# Documents emailed on request

The PDF files in this folder are attached to the "Request Private Documents" email that
verified visitors receive. They are committed to the repository and deployed with the code.

- Only `.pdf` files are used; hidden files and other types are ignored.
- **Every** PDF here is attached, so only keep files that are approved for that audience.
- The folder is outside `public/`, so the website never serves the files directly.
- Total size of all PDFs must stay under 28 MB (email provider limit).
- To change what visitors receive: add, replace or delete PDFs here, commit, and deploy.
- Optional: set `DOCUMENTS_DIR` to use another folder; it falls back to this one when empty.
