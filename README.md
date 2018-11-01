# Understand
Understand is a Google Chrome extension that converts the images inside PDFs to text. This is incredibly useful for searching through scanned books.

Chrome extension for PDF optical character recognition

[![Known Vulnerabilities](https://snyk.io/test/github/andrew4699/understand/badge.svg?targetFile=src%2Fserver%2Fpackage.json)](https://snyk.io/test/github/andrew4699/understand?targetFile=src%2Fserver%2Fpackage.json)

# TODO
## Features
* Stitch all images into 1 to reduce # of API requests
* PDF download progress
* Re-enable pages > 1
* Fix "All images processed indicator"
* Order "recognize-ed" text properly (vertically)
* Improve highlight positioning
* Understand local files (file://....) - ask user to select file using \<input type="file"\>, alternative: native app (these 2 are necessary if they don't have "allow file URLs" checked for the extension)
* Offer to load normally (especially if there was an error)
* Loading progress bars (instead of just spinner)
* Port to other browsers

## Developer Tooling
* SCSS pre-processing
* Use a UI library (React?)
* TypeScript on the server
* Unit tests
* Integration tests
* Continuous integration
* Docker

## Other
* Code cleanup (split app.ts into smaller files)

# Design Decisions
### See [this document](/DESIGN_DECISIONS.md) for a list of critical design decisions.

# Contributing
### See [this document](/CONTRIBUTING.md) for contribution guidelines, development environment setup, and build processes.